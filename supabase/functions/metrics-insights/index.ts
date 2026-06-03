import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { chatCompletion, extractJsonObject, engineLabel } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { client_id, start_date, end_date } = await req.json();
    if (!client_id) {
      return new Response(JSON.stringify({ error: "client_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: client, error: cErr } = await supabase
      .from("clients").select("id, name, website").eq("id", client_id).single();
    if (cErr || !client) {
      return new Response(JSON.stringify({ error: "Client not found or access denied" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let q = supabase.from("client_metrics_entries")
      .select("provider, metric_label, metric_value, period_start, period_end, created_at")
      .eq("client_id", client_id)
      .order("period_end", { ascending: true });
    if (start_date) q = q.gte("period_end", start_date);
    if (end_date) q = q.lte("period_end", end_date);
    const { data: metrics, error: mErr } = await q;
    if (mErr) throw mErr;

    if (!metrics || metrics.length === 0) {
      return new Response(JSON.stringify({ result: { headline: "No data available.", summary: "No metrics in the selected period.", wins: [], concerns: [], recommendations: [] } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Aggregate per provider+label
    const agg: Record<string, { values: number[]; firstHalf: number[]; secondHalf: number[] }> = {};
    const sorted = [...metrics].sort((a, b) => (a.period_end || "").localeCompare(b.period_end || ""));
    const mid = Math.floor(sorted.length / 2);
    sorted.forEach((m, i) => {
      if (m.metric_value === null || m.metric_value === undefined) return;
      const k = `${m.provider} :: ${m.metric_label}`;
      const bucket = (agg[k] ||= { values: [], firstHalf: [], secondHalf: [] });
      bucket.values.push(Number(m.metric_value));
      (i < mid ? bucket.firstHalf : bucket.secondHalf).push(Number(m.metric_value));
    });

    const summary = Object.entries(agg).map(([k, b]) => {
      const isAvg = /ctr|position|rate|avg|%|bounce/i.test(k);
      const calc = (arr: number[]) => arr.length ? (isAvg ? arr.reduce((a, c) => a + c, 0) / arr.length : arr.reduce((a, c) => a + c, 0)) : 0;
      const total = calc(b.values);
      const fh = calc(b.firstHalf);
      const sh = calc(b.secondHalf);
      const change = fh ? ((sh - fh) / fh) * 100 : 0;
      return { metric: k, total: +total.toFixed(2), trendPct: +change.toFixed(1), points: b.values.length, agg: isAvg ? "average" : "sum" };
    });

    const prompt = `Analyze marketing performance for "${client.name}" (${client.website || 'no website'}) for ${start_date || 'recent'} to ${end_date || 'today'}.

Aggregated metrics (trendPct = % change first half vs second half of the period):
${JSON.stringify(summary, null, 2)}

Produce a structured analyst report with:
1. An OVERVIEW (headline + 3-4 sentence executive summary).
2. KPI highlight tiles for the 3-5 most important metrics.
3. A METRIC-BY-METRIC BREAKDOWN — one entry per metric in the data above. For each, give: a clear narrative comparing first half vs second half (cite both numbers in **bold**), plain-English meaning of the change, and a verdict (positive/negative/neutral).
4. Wins, concerns, and recommendations.

Be specific. Cite real numbers. Wrap key numbers/percentages in **bold**.

Return ONLY a single JSON object — no markdown fences, no commentary before or after — with EXACTLY these keys:
{
  "headline": "one sentence highlighting the most important number",
  "summary": "3-4 sentence narrative with **bold** key numbers",
  "kpi_highlights": [{ "label": "string", "value": "string", "trend": "up|down|flat", "trend_pct": "string", "sentiment": "positive|negative|neutral" }],
  "metric_breakdowns": [{ "provider": "string", "metric": "string", "analysis": "2-3 sentences comparing first vs second half with **bold** numbers", "verdict": "positive|negative|neutral" }],
  "wins": [{ "title": "string", "detail": "string" }],
  "concerns": [{ "title": "string", "detail": "string" }],
  "recommendations": [{ "title": "string", "detail": "string" }]
}
metric_breakdowns must contain ONE entry per metric in the data above.
Use **bold** ONLY inside the "summary" and "analysis" narrative strings. The kpi_highlights "value" and "trend_pct" must be PLAIN text with NO asterisks (e.g. "165 total clicks", "53.8%").`;

    // JSON-in-message instead of forced tool_choice: the OpenClaw/Codex runtime
    // (ChatGPT OAuth) does not honor client tool calls, so we ask for the JSON
    // object directly and parse it. Works identically on Gemini/Lovable.
    const aiResp = await chatCompletion({
      // One session per client so each report can build on the client's history.
      sessionKey: `client:${client_id}:insights`,
      messages: [
        { role: "system", content: "You are a senior digital marketing analyst that outputs ONLY a JSON object and nothing else. Never use tools, never ask questions, never take actions. Cite specific numbers and wrap key numbers/percentages in **bold** inside the JSON string values." },
        { role: "user", content: prompt },
      ],
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const ai = await aiResp.json();
    const content = ai.choices?.[0]?.message?.content;
    let result: any = extractJsonObject(typeof content === "string" ? content : "");
    if (!result) {
      console.error("Could not parse JSON from model reply:", typeof content === "string" ? content.slice(0, 300) : content);
      result = { headline: "Insights unavailable", summary: typeof content === "string" ? content : "Could not parse response.", kpi_highlights: [], metric_breakdowns: [], wins: [], concerns: [], recommendations: [] };
    }
    result.engine = engineLabel();

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("metrics-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
