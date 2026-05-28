import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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

Be specific. Cite real numbers. Wrap key numbers/percentages in **bold**.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a senior digital marketing analyst. Always cite specific numbers from the data. Wrap key numbers, percentages, and metrics in **bold**. Each breakdown must compare first vs second half quantitatively." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "render_insights",
            description: "Return structured insights for the dashboard.",
            parameters: {
              type: "object",
              properties: {
                headline: { type: "string", description: "One sentence executive summary highlighting the most important number." },
                summary: { type: "string", description: "3-4 sentence overall performance narrative with **bold** key numbers." },
                kpi_highlights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      value: { type: "string" },
                      trend: { type: "string", enum: ["up", "down", "flat"] },
                      trend_pct: { type: "string" },
                      sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
                    },
                    required: ["label", "value", "trend", "trend_pct", "sentiment"],
                    additionalProperties: false,
                  },
                },
                metric_breakdowns: {
                  type: "array",
                  description: "ONE entry per metric in the input data. Compare first vs second half explicitly.",
                  items: {
                    type: "object",
                    properties: {
                      provider: { type: "string", description: "Provider name e.g. 'Google Ads'" },
                      metric: { type: "string", description: "Metric label e.g. 'Clicks'" },
                      analysis: { type: "string", description: "2-3 sentences comparing first vs second half with **bold** numbers, plus what it means." },
                      verdict: { type: "string", enum: ["positive", "negative", "neutral"] },
                    },
                    required: ["provider", "metric", "analysis", "verdict"],
                    additionalProperties: false,
                  },
                },
                wins: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { title: { type: "string" }, detail: { type: "string" } },
                    required: ["title", "detail"],
                    additionalProperties: false,
                  },
                },
                concerns: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { title: { type: "string" }, detail: { type: "string" } },
                    required: ["title", "detail"],
                    additionalProperties: false,
                  },
                },
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { title: { type: "string" }, detail: { type: "string" } },
                    required: ["title", "detail"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["headline", "summary", "kpi_highlights", "metric_breakdowns", "wins", "concerns", "recommendations"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "render_insights" } },
      }),
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
    const toolCall = ai.choices?.[0]?.message?.tool_calls?.[0];
    let result: any = null;
    if (toolCall?.function?.arguments) {
      try { result = JSON.parse(toolCall.function.arguments); } catch (e) { console.error("Parse failed", e); }
    }
    if (!result) {
      result = { headline: "Insights unavailable", summary: ai.choices?.[0]?.message?.content || "Could not parse response.", kpi_highlights: [], metric_breakdowns: [], wins: [], concerns: [], recommendations: [] };
    }

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
