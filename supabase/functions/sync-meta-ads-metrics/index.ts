// Sync Meta (Facebook) Ads metrics for clients that have an "ad_account_id"
// credential stored under provider="meta_ads" in client_credentials.
//
// Uses a long-lived User or System User Access Token from agency_settings
// (meta_ads__access_token). Pulls daily Spend, Impressions, Clicks, CTR, CPC,
// Reach, and Conversions, inserting one row per metric per day into
// client_metrics_entries (provider="meta_ads").

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPH_VERSION = "v21.0";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function normalizeAccountId(raw: string): string {
  const id = (raw || "").trim();
  if (!id) return "";
  // Accept "act_1234", "1234", or URLs — extract digits and prefix with act_
  const digits = id.replace(/[^0-9]/g, "");
  return digits ? `act_${digits}` : "";
}

interface InsightRow {
  date_start: string;
  date_stop: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  reach?: string;
  actions?: Array<{ action_type: string; value: string }>;
}

async function queryMeta(opts: {
  accessToken: string;
  accountId: string; // act_xxx
  startDate: string;
  endDate: string;
}): Promise<InsightRow[]> {
  const fields = ["spend", "impressions", "clicks", "ctr", "cpc", "reach", "actions"].join(",");
  const params = new URLSearchParams({
    access_token: opts.accessToken,
    level: "account",
    time_increment: "1",
    time_range: JSON.stringify({ since: opts.startDate, until: opts.endDate }),
    fields,
    limit: "500",
  });

  const out: InsightRow[] = [];
  let url: string | null = `https://graph.facebook.com/${GRAPH_VERSION}/${opts.accountId}/insights?${params}`;
  let safety = 0;
  while (url && safety < 20) {
    safety++;
    const res = await fetch(url);
    const text = await res.text();
    let json: any;
    try { json = JSON.parse(text); } catch { throw new Error(`Meta non-JSON response: ${text.slice(0, 300)}`); }
    if (!res.ok || json.error) {
      throw new Error(`Meta query error for ${opts.accountId}: ${JSON.stringify(json.error || json).slice(0, 500)}`);
    }
    for (const r of (json.data || [])) out.push(r as InsightRow);
    url = json.paging?.next || null;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const targetClientId: string | undefined = body.client_id;
    const startDate: string = body.start_date || isoDaysAgo(30);
    const endDate: string = body.end_date || isoDaysAgo(0);

    // Load Meta access token from agency_settings
    const { data: settings, error: sErr } = await supabase
      .from("agency_settings")
      .select("key_name, value")
      .eq("provider", "meta_ads");
    if (sErr) throw sErr;
    const settingsMap = Object.fromEntries((settings || []).map((s: any) => [s.key_name, s.value]));
    const accessToken = settingsMap["meta_ads__access_token"];
    if (!accessToken) {
      // Adaptive: silently skip when Meta is not configured at agency level
      return new Response(JSON.stringify({
        summary: [{ status: "ok", skipped: true, reason: "not_configured", rows_inserted: 0, days: 0, cached: 0 }],
        not_configured: true,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load Meta ad account credentials per client
    let credQ = supabase
      .from("client_credentials")
      .select("client_id, label, credential_value")
      .eq("provider", "meta_ads");
    if (targetClientId) credQ = credQ.eq("client_id", targetClientId);
    const { data: creds, error: cErr } = await credQ;
    if (cErr) throw cErr;

    // Accept any meta_ads credential whose value looks like an ad account ID
    // (digits, optionally prefixed with "act_"). Label is informational only.
    const accounts = (creds || [])
      .map((c: any) => ({ client_id: c.client_id, account_id: normalizeAccountId(c.credential_value) }))
      .filter((a) => !!a.account_id && a.account_id.replace(/[^0-9]/g, "").length >= 6);

    if (accounts.length === 0) {
      // Adaptive: silently skip when this client has no Meta Ads credential
      return new Response(JSON.stringify({
        summary: [{ status: "ok", skipped: true, reason: "no_account", rows_inserted: 0, days: 0, cached: 0 }],
        not_configured: true,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const summary: any[] = [];
    for (const acct of accounts) {
      try {
        const rows = await queryMeta({
          accessToken,
          accountId: acct.account_id,
          startDate,
          endDate,
        });

        // Build inserts: one row per metric per day
        const inserts: any[] = [];
        for (const r of rows) {
          const day = r.date_start;
          const push = (label: string, value: number | null) => {
            if (value === null || Number.isNaN(value)) return;
            inserts.push({
              client_id: acct.client_id,
              provider: "meta_ads",
              metric_label: label,
              metric_value: value,
              period_start: day,
              period_end: day,
              created_by: "00000000-0000-0000-0000-000000000000",
            });
          };
          push("Spend", r.spend !== undefined ? Number(r.spend) : null);
          push("Impressions", r.impressions !== undefined ? Number(r.impressions) : null);
          push("Clicks", r.clicks !== undefined ? Number(r.clicks) : null);
          push("CTR (%)", r.ctr !== undefined ? Number(r.ctr) : null);
          push("Avg CPC", r.cpc !== undefined ? Number(r.cpc) : null);
          push("Reach", r.reach !== undefined ? Number(r.reach) : null);
          // Conversions = sum of common conversion-type actions
          const convTypes = /^(purchase|offsite_conversion|lead|complete_registration|onsite_conversion\.lead_grouped)/i;
          const conv = (r.actions || [])
            .filter((a) => convTypes.test(a.action_type))
            .reduce((acc, a) => acc + Number(a.value || 0), 0);
          if (conv > 0 || (r.actions && r.actions.length > 0)) push("Conversions", conv);
        }

        // Use creator (created_by) of an existing client's records to satisfy NOT NULL,
        // fallback: pick clients.created_by
        if (inserts.length > 0) {
          const { data: clientRow } = await supabase
            .from("clients")
            .select("created_by")
            .eq("id", acct.client_id)
            .single();
          const creator = (clientRow as any)?.created_by;
          if (creator) {
            for (const row of inserts) row.created_by = creator;
          }

          // Dedupe: delete existing rows for this client+provider+date range, then insert
          await supabase
            .from("client_metrics_entries")
            .delete()
            .eq("client_id", acct.client_id)
            .eq("provider", "meta_ads")
            .gte("period_end", startDate)
            .lte("period_end", endDate);

          // Chunked insert
          const CHUNK = 500;
          for (let i = 0; i < inserts.length; i += CHUNK) {
            const slice = inserts.slice(i, i + CHUNK);
            const { error: insErr } = await supabase.from("client_metrics_entries").insert(slice);
            if (insErr) throw insErr;
          }
        }

        summary.push({
          client_id: acct.client_id,
          account_id: acct.account_id,
          status: "ok",
          days: rows.length,
          rows_inserted: inserts.length,
        });
      } catch (e) {
        console.error(`Meta sync failed for ${acct.account_id}:`, e);
        summary.push({
          client_id: acct.client_id,
          account_id: acct.account_id,
          status: "error",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sync-meta-ads-metrics error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
