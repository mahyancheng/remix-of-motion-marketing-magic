// Sync Google Search Console metrics for all clients with a website.
// Uses the service-account JSON saved in agency_settings (key: google_search_console__service_account_json).
// For each client.website, pulls last 7 days of Clicks, Impressions, CTR, Position
// and upserts one row per metric per day into client_metrics_entries.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ---------- JWT signing for Google service account (RS256) ----------
function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") bytes = new TextEncoder().encode(input);
  else if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else bytes = input;
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

async function getAccessToken(saJson: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: saJson.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const keyData = pemToArrayBuffer(saJson.private_key);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google token error: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

// ---------- GSC query ----------
async function querySearchAnalytics(token: string, siteUrl: string, startDate: string, endDate: string) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate, endDate,
      dimensions: ["date"],
      rowLimit: 1000,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`GSC query error for ${siteUrl}: ${JSON.stringify(json)}`);
  return (json.rows || []) as Array<{ keys: [string]; clicks: number; impressions: number; ctr: number; position: number }>;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function normalizeSiteUrl(website: string): string[] {
  // GSC accepts either "sc-domain:example.com" or "https://example.com/".
  // We'll try both URL-prefix variants (with/without trailing slash) and the domain property.
  let raw = website.trim();
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  const u = new URL(raw);
  const host = u.hostname.replace(/^www\./, "");
  const prefixes = [
    `${u.protocol}//${u.hostname}/`,
    `${u.protocol}//${u.hostname}`,
    `https://${host}/`,
    `https://www.${host}/`,
    `sc-domain:${host}`,
  ];
  return Array.from(new Set(prefixes));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // 1. Verify caller is authenticated team/admin.
    // Decode JWT payload directly (avoids SDK version mismatches).
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return new Response(JSON.stringify({ error: "Missing auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    let userId = "";
    try {
      const part = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = part + "=".repeat((4 - part.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return new Response(JSON.stringify({ error: "Session expired — please sign in again." }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      userId = payload.sub;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!userId) return new Response(JSON.stringify({ error: "Invalid auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: roleRows } = await admin.from("user_roles").select("role").eq("user_id", userId).in("role", ["team", "admin"]).limit(1);
    if (!roleRows || roleRows.length === 0) return new Response(JSON.stringify({ error: "Forbidden — team/admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // 2. Load service-account JSON from agency_settings.
    const { data: setting } = await admin
      .from("agency_settings")
      .select("value")
      .eq("key_name", "google_search_console__service_account_json")
      .maybeSingle();
    if (!setting?.value) {
      return new Response(JSON.stringify({ error: "Google Search Console service account not configured. Add it in Settings." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    let saJson: any;
    try { saJson = JSON.parse(setting.value); } catch {
      return new Response(JSON.stringify({ error: "Stored service account JSON is invalid." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!saJson.client_email || !saJson.private_key) {
      return new Response(JSON.stringify({ error: "Service account JSON missing client_email or private_key." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 3. Get an access token.
    const accessToken = await getAccessToken(saJson);

    // 4. For each client with a website, sync.
    const body = await req.json().catch(() => ({}));
    const clientId = body?.client_id as string | undefined;
    const reqStart = body?.start_date as string | undefined;
    const reqEnd = body?.end_date as string | undefined;
    const force = body?.force === true;

    let clientsQuery = admin.from("clients").select("id, name, website").not("website", "is", null);
    if (clientId) clientsQuery = clientsQuery.eq("id", clientId);
    const { data: clients, error: clientsErr } = await clientsQuery;
    if (clientsErr) throw clientsErr;

    // GSC has ~2 day lag. Clamp end_date to (today - 2).
    const maxEnd = isoDaysAgo(2);
    const startDate = reqStart && reqStart < maxEnd ? reqStart : isoDaysAgo(30);
    const endDate = reqEnd && reqEnd <= maxEnd ? reqEnd : maxEnd;

    const summary: any[] = [];

    for (const client of clients || []) {
      if (!client.website) continue;

      // Find which dates in [startDate, endDate] are already cached for this client.
      let fetchStart = startDate;
      let fetchEnd = endDate;
      let alreadyCached = 0;
      if (!force) {
        const { data: existing } = await admin
          .from("client_metrics_entries")
          .select("period_end")
          .eq("client_id", client.id)
          .eq("provider", "google_search_console")
          .gte("period_end", startDate)
          .lte("period_end", endDate);
        const cachedDates = new Set((existing || []).map((r: any) => r.period_end));
        // Build the missing-date set
        const missing: string[] = [];
        const cur = new Date(startDate + "T00:00:00Z");
        const endD = new Date(endDate + "T00:00:00Z");
        while (cur <= endD) {
          const d = cur.toISOString().slice(0, 10);
          if (!cachedDates.has(d)) missing.push(d);
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
        alreadyCached = cachedDates.size;
        if (missing.length === 0) {
          summary.push({ client: client.name, status: "ok", site: "(cached)", days: 0, rows_inserted: 0, cached: alreadyCached, skipped: true });
          continue;
        }
        fetchStart = missing[0];
        fetchEnd = missing[missing.length - 1];
      }

      const candidates = normalizeSiteUrl(client.website);
      let rows: any[] | null = null;
      let usedSite = "";
      let lastError = "";
      for (const site of candidates) {
        try {
          rows = await querySearchAnalytics(accessToken, site, fetchStart, fetchEnd);
          usedSite = site;
          break;
        } catch (e: any) {
          lastError = e.message;
        }
      }
      if (!rows) {
        summary.push({ client: client.name, status: "error", error: lastError });
        continue;
      }

      // Delete existing GSC entries for this client in the *fetched* range to avoid duplicates.
      await admin.from("client_metrics_entries")
        .delete()
        .eq("client_id", client.id)
        .eq("provider", "google_search_console")
        .gte("period_end", fetchStart)
        .lte("period_end", fetchEnd);

      const inserts: any[] = [];
      for (const row of rows) {
        const date = row.keys[0];
        const base = {
          client_id: client.id,
          provider: "google_search_console",
          period_start: date,
          period_end: date,
          created_by: userId,
          notes: `Auto-synced from GSC site: ${usedSite}`,
        };
        inserts.push({ ...base, metric_label: "Clicks", metric_value: row.clicks });
        inserts.push({ ...base, metric_label: "Impressions", metric_value: row.impressions });
        inserts.push({ ...base, metric_label: "CTR (%)", metric_value: Number((row.ctr * 100).toFixed(2)) });
        inserts.push({ ...base, metric_label: "Avg Position", metric_value: Number(row.position.toFixed(2)) });
      }
      if (inserts.length) {
        const { error: insErr } = await admin.from("client_metrics_entries").insert(inserts);
        if (insErr) {
          summary.push({ client: client.name, status: "insert_error", error: insErr.message });
          continue;
        }
      }
      summary.push({ client: client.name, status: "ok", site: usedSite, days: rows.length, rows_inserted: inserts.length, range: `${fetchStart} → ${fetchEnd}`, cached: alreadyCached });
    }

    return new Response(JSON.stringify({ ok: true, summary }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
