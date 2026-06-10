// Sync Google Ads metrics for clients that have a "customer_id" credential
// stored under provider="google_ads" in client_credentials.
//
// Uses OAuth (Developer Token + Client ID/Secret + Refresh Token + Login Customer ID)
// from agency_settings. Pulls daily Clicks, Impressions, Cost, Conversions, CTR, Avg CPC
// and inserts one row per metric per day into client_metrics_entries (provider="google_ads").

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function stripDashes(id: string): string {
  return (id || "").replace(/[^0-9]/g, "");
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google OAuth error: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

async function queryAds(opts: {
  accessToken: string;
  developerToken: string;
  loginCustomerId: string;
  customerId: string;
  startDate: string;
  endDate: string;
}) {
  const url = `https://googleads.googleapis.com/v21/customers/${opts.customerId}/googleAds:searchStream`;
  const query = `
    SELECT
      segments.date,
      metrics.clicks,
      metrics.impressions,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc
    FROM customer
    WHERE segments.date BETWEEN '${opts.startDate}' AND '${opts.endDate}'
  `;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "developer-token": opts.developerToken,
      "login-customer-id": opts.loginCustomerId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { throw new Error(`Google Ads non-JSON response: ${text.slice(0, 300)}`); }
  if (!res.ok) throw new Error(`Google Ads query error for customer ${opts.customerId}: ${JSON.stringify(json).slice(0, 500)}`);
  // searchStream returns an array of chunks { results: [...] }
  const chunks = Array.isArray(json) ? json : [json];
  const rows: any[] = [];
  for (const chunk of chunks) {
    for (const r of (chunk.results || [])) rows.push(r);
  }
  return rows;
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

    // Load Google Ads agency settings
    const keys = [
      "google_ads__developer_token",
      "google_ads__oauth_client_id",
      "google_ads__oauth_client_secret",
      "google_ads__refresh_token",
      "google_ads__login_customer_id",
    ];
    const { data: settingsRows } = await admin.from("agency_settings").select("key_name, value").in("key_name", keys);
    const settings: Record<string, string> = {};
    for (const r of settingsRows || []) settings[r.key_name] = r.value;
    const missing = keys.filter((k) => !settings[k]);
    if (missing.length) {
      return new Response(JSON.stringify({ error: `Google Ads is not fully configured. Missing: ${missing.map(k => k.replace("google_ads__", "")).join(", ")}. Add them in Settings → Google Ads.` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const developerToken = settings["google_ads__developer_token"].trim();
    const oauthClientId = settings["google_ads__oauth_client_id"].trim();
    const oauthClientSecret = settings["google_ads__oauth_client_secret"].trim();
    const refreshToken = settings["google_ads__refresh_token"].trim();
    const loginCustomerId = stripDashes(settings["google_ads__login_customer_id"]);

    const body = await req.json().catch(() => ({}));
    const clientId = body?.client_id as string | undefined;
    const reqStart = body?.start_date as string | undefined;
    const reqEnd = body?.end_date as string | undefined;
    const force = body?.force === true;

    // Find clients to sync — must have a credential row with provider=google_ads, label=customer_id
    let credQuery = admin.from("client_credentials").select("client_id, credential_value, label").eq("provider", "google_ads").ilike("label", "customer_id");
    if (clientId) credQuery = credQuery.eq("client_id", clientId);
    const { data: creds, error: credErr } = await credQuery;
    if (credErr) throw credErr;
    if (!creds || creds.length === 0) {
      return new Response(JSON.stringify({ error: "No Google Ads Customer IDs configured. Add a credential with provider 'Google Ads' and label 'customer_id' for each client.", hint: "Open the client → Credentials tab → Add credential." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: clients } = await admin.from("clients").select("id, name").in("id", creds.map((c: any) => c.client_id));
    const clientById: Record<string, { id: string; name: string }> = {};
    for (const c of clients || []) clientById[c.id] = c;

    // Get an OAuth access token (one for the whole batch)
    const accessToken = await getAccessToken(oauthClientId, oauthClientSecret, refreshToken);

    const startDate = reqStart || isoDaysAgo(30);
    const endDate = reqEnd || isoDaysAgo(1);

    const summary: any[] = [];
    for (const cred of creds) {
      const client = clientById[cred.client_id];
      const customerId = stripDashes(cred.credential_value);
      if (!customerId) {
        summary.push({ client: client?.name, status: "error", error: "Customer ID empty after stripping non-digits" });
        continue;
      }

      // Skip if cached (unless force)
      if (!force) {
        const { data: existing } = await admin.from("client_metrics_entries")
          .select("period_end")
          .eq("client_id", cred.client_id)
          .eq("provider", "google_ads")
          .gte("period_end", startDate)
          .lte("period_end", endDate);
        const cachedDates = new Set((existing || []).map((r: any) => r.period_end));
        const totalDays = Math.floor((+new Date(endDate) - +new Date(startDate)) / 86400000) + 1;
        if (cachedDates.size >= totalDays) {
          summary.push({ client: client?.name, status: "ok", days: 0, rows_inserted: 0, cached: cachedDates.size, skipped: true });
          continue;
        }
      }

      let rows: any[];
      try {
        rows = await queryAds({ accessToken, developerToken, loginCustomerId, customerId, startDate, endDate });
      } catch (e: any) {
        summary.push({ client: client?.name, status: "error", customer_id: customerId, error: e.message });
        continue;
      }

      // Replace existing in range
      await admin.from("client_metrics_entries")
        .delete()
        .eq("client_id", cred.client_id)
        .eq("provider", "google_ads")
        .gte("period_end", startDate)
        .lte("period_end", endDate);

      const inserts: any[] = [];
      for (const row of rows) {
        const date = row.segments?.date;
        const m = row.metrics || {};
        if (!date) continue;
        const base = {
          client_id: cred.client_id,
          provider: "google_ads",
          period_start: date,
          period_end: date,
          created_by: userId,
          notes: `Auto-synced from Google Ads customer: ${customerId}`,
        };
        const cost = (Number(m.costMicros || 0)) / 1_000_000;
        const avgCpc = (Number(m.averageCpc || 0)) / 1_000_000;
        inserts.push({ ...base, metric_label: "Clicks", metric_value: Number(m.clicks || 0) });
        inserts.push({ ...base, metric_label: "Impressions", metric_value: Number(m.impressions || 0) });
        inserts.push({ ...base, metric_label: "Cost", metric_value: Number(cost.toFixed(2)) });
        inserts.push({ ...base, metric_label: "Conversions", metric_value: Number((m.conversions || 0)) });
        inserts.push({ ...base, metric_label: "CTR (%)", metric_value: Number((Number(m.ctr || 0) * 100).toFixed(2)) });
        inserts.push({ ...base, metric_label: "Avg CPC", metric_value: Number(avgCpc.toFixed(2)) });
      }

      if (inserts.length) {
        const { error: insErr } = await admin.from("client_metrics_entries").insert(inserts);
        if (insErr) {
          summary.push({ client: client?.name, status: "insert_error", error: insErr.message });
          continue;
        }
      }
      summary.push({ client: client?.name, status: "ok", customer_id: customerId, days: rows.length, rows_inserted: inserts.length, range: `${startDate} → ${endDate}` });
    }

    return new Response(JSON.stringify({ ok: true, summary }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
