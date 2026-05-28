// Sync Google Analytics 4 metrics for clients with a GA4 property ID stored
// in client_credentials (provider="google_analytics"). The credential_value
// must contain the GA4 numeric property ID (e.g. "492029865").
//
// Auth: service-account JSON saved in agency_settings under
// key_name = "google_analytics__service_account_json".
// The service account must be added as a Viewer on the GA4 property.
//
// Pulls daily Sessions, Active Users, Engaged Sessions, Conversions,
// Bounce Rate (%), Avg Session Duration (s) and inserts one row per metric
// per day into client_metrics_entries (provider="google_analytics").

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
    scope: "https://www.googleapis.com/auth/analytics.readonly",
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

// ---------- GA4 Data API query ----------
async function runReport(opts: {
  accessToken: string;
  propertyId: string;
  startDate: string;
  endDate: string;
}) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${opts.propertyId}:runReport`;
  const body = {
    dateRanges: [{ startDate: opts.startDate, endDate: opts.endDate }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "engagedSessions" },
      { name: "conversions" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
    limit: 100000,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { throw new Error(`GA4 non-JSON response: ${text.slice(0, 300)}`); }
  if (!res.ok) throw new Error(`GA4 query error for property ${opts.propertyId}: ${JSON.stringify(json).slice(0, 500)}`);
  return (json.rows || []) as Array<{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }>;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

// GA4 returns date as "YYYYMMDD"
function gaDateToIso(d: string): string {
  if (d.length === 8) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  return d;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Auth
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

    const { data: roleRows } = await admin.from("user_roles").select("role").eq("user_id", userId).in("role", ["team", "admin"]).limit(1);
    if (!roleRows || roleRows.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden — team/admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load service-account JSON
    const { data: setting } = await admin
      .from("agency_settings")
      .select("value")
      .eq("key_name", "google_analytics__service_account_json")
      .maybeSingle();
    if (!setting?.value) {
      return new Response(JSON.stringify({ error: "Google Analytics service account not configured. Add it in Settings → Google Analytics." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    let saJson: any;
    try { saJson = JSON.parse(setting.value); } catch {
      return new Response(JSON.stringify({ error: "Stored Google Analytics service account JSON is invalid." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!saJson.client_email || !saJson.private_key) {
      return new Response(JSON.stringify({ error: "Service account JSON missing client_email or private_key." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const clientId = body?.client_id as string | undefined;
    const reqStart = body?.start_date as string | undefined;
    const reqEnd = body?.end_date as string | undefined;
    const force = body?.force === true;

    // Find clients with a GA4 property credential
    let credQuery = admin.from("client_credentials")
      .select("client_id, credential_value, label")
      .eq("provider", "google_analytics");
    if (clientId) credQuery = credQuery.eq("client_id", clientId);
    const { data: creds, error: credErr } = await credQuery;
    if (credErr) throw credErr;
    if (!creds || creds.length === 0) {
      return new Response(JSON.stringify({ error: "No Google Analytics property IDs configured. Add a credential with provider 'Google Analytics' (numeric GA4 property ID) for each client." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: clients } = await admin.from("clients").select("id, name").in("id", creds.map((c: any) => c.client_id));
    const clientById: Record<string, { id: string; name: string }> = {};
    for (const c of clients || []) clientById[c.id] = c;

    // GA4 has a small processing lag; clamp end_date to (today - 1)
    const accessToken = await getAccessToken(saJson);
    const maxEnd = isoDaysAgo(1);
    const startDate = reqStart && reqStart < maxEnd ? reqStart : isoDaysAgo(30);
    const endDate = reqEnd && reqEnd <= maxEnd ? reqEnd : maxEnd;

    const summary: any[] = [];

    for (const cred of creds) {
      const client = clientById[cred.client_id];
      const propertyId = (cred.credential_value || "").replace(/[^0-9]/g, "");
      if (!propertyId) {
        summary.push({ client: client?.name, status: "error", error: "GA4 property ID empty after stripping non-digits" });
        continue;
      }

      // Skip if cached (unless force)
      if (!force) {
        const { data: existing } = await admin.from("client_metrics_entries")
          .select("period_end")
          .eq("client_id", cred.client_id)
          .eq("provider", "google_analytics")
          .gte("period_end", startDate)
          .lte("period_end", endDate);
        const cachedDates = new Set((existing || []).map((r: any) => r.period_end));
        const totalDays = Math.floor((+new Date(endDate) - +new Date(startDate)) / 86400000) + 1;
        if (cachedDates.size >= totalDays) {
          summary.push({ client: client?.name, status: "ok", days: 0, rows_inserted: 0, cached: cachedDates.size, skipped: true });
          continue;
        }
      }

      let rows: Array<{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }>;
      try {
        rows = await runReport({ accessToken, propertyId, startDate, endDate });
      } catch (e: any) {
        summary.push({ client: client?.name, status: "error", property_id: propertyId, error: e.message });
        continue;
      }

      // Replace existing in range
      await admin.from("client_metrics_entries")
        .delete()
        .eq("client_id", cred.client_id)
        .eq("provider", "google_analytics")
        .gte("period_end", startDate)
        .lte("period_end", endDate);

      const inserts: any[] = [];
      for (const row of rows) {
        const date = gaDateToIso(row.dimensionValues?.[0]?.value || "");
        if (!date) continue;
        const m = row.metricValues || [];
        const sessions = Number(m[0]?.value || 0);
        const users = Number(m[1]?.value || 0);
        const engaged = Number(m[2]?.value || 0);
        const conversions = Number(m[3]?.value || 0);
        const bounceRate = Number(m[4]?.value || 0); // 0..1
        const avgDuration = Number(m[5]?.value || 0); // seconds

        const base = {
          client_id: cred.client_id,
          provider: "google_analytics",
          period_start: date,
          period_end: date,
          created_by: userId,
          notes: `Auto-synced from GA4 property: ${propertyId}`,
        };
        inserts.push({ ...base, metric_label: "Sessions", metric_value: sessions });
        inserts.push({ ...base, metric_label: "Active Users", metric_value: users });
        inserts.push({ ...base, metric_label: "Engaged Sessions", metric_value: engaged });
        inserts.push({ ...base, metric_label: "Conversions", metric_value: conversions });
        inserts.push({ ...base, metric_label: "Bounce Rate (%)", metric_value: Number((bounceRate * 100).toFixed(2)) });
        inserts.push({ ...base, metric_label: "Avg Session Duration (s)", metric_value: Number(avgDuration.toFixed(2)) });
      }

      if (inserts.length) {
        const { error: insErr } = await admin.from("client_metrics_entries").insert(inserts);
        if (insErr) {
          summary.push({ client: client?.name, status: "insert_error", error: insErr.message });
          continue;
        }
      }
      summary.push({ client: client?.name, status: "ok", property_id: propertyId, days: rows.length, rows_inserted: inserts.length, range: `${startDate} → ${endDate}` });
    }

    return new Response(JSON.stringify({ ok: true, summary }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
