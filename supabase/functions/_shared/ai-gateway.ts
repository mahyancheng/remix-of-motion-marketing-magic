// Single place that decides which OpenAI-compatible gateway powers AI features.
//
// Routing (resolved per request):
//   - If OPENCLAW_URL + OPENCLAW_TOKEN are set  -> self-hosted OpenClaw gateway
//     (ChatGPT/Codex OAuth on your VPS). Per-client memory via x-openclaw-session-key.
//   - Otherwise                                 -> Lovable AI gateway (the old path).
//
// Override the model with AI_MODEL. For OpenClaw the request "model" selects the
// AGENT ("openclaw" or "openclaw/<agentId>"), NOT the LLM — the underlying model
// (e.g. openai/gpt-5.5 over ChatGPT OAuth) is configured server-side on the agent.
// For Lovable, "model" is the LLM id (default google/gemini-2.5-flash).
// Both speak /v1/chat/completions, so callers pass the same
// messages/tools/tool_choice shape regardless of backend.

export type ChatMessage = {
  role: string;
  content: unknown;
  [key: string]: unknown;
};

export interface ChatOptions {
  messages: ChatMessage[];
  tools?: unknown[];
  toolChoice?: unknown;
  /** Per-client session key; routed to OpenClaw as x-openclaw-session-key for memory. */
  sessionKey?: string;
  stream?: boolean;
  signal?: AbortSignal;
}

interface ResolvedGateway {
  url: string;
  token: string;
  model: string;
  /** OpenClaw keeps per-session transcript memory; Lovable is stateless. */
  supportsSession: boolean;
  label: string;
}

function resolveGateway(): ResolvedGateway {
  const openclawUrl = Deno.env.get("OPENCLAW_URL");
  const openclawToken = Deno.env.get("OPENCLAW_TOKEN");
  if (openclawUrl && openclawToken) {
    return {
      url: `${openclawUrl.replace(/\/+$/, "")}/v1/chat/completions`,
      token: openclawToken,
      // Selects the OpenClaw agent, not the LLM. Must be "openclaw" or "openclaw/<agentId>".
      model: Deno.env.get("AI_MODEL") ?? "openclaw",
      supportsSession: true,
      label: "openclaw",
    };
  }

  const lovableToken = Deno.env.get("LOVABLE_API_KEY");
  if (lovableToken) {
    return {
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      token: lovableToken,
      model: Deno.env.get("AI_MODEL") ?? "google/gemini-2.5-flash",
      supportsSession: false,
      label: "lovable",
    };
  }

  throw new Error(
    "No AI gateway configured. Set OPENCLAW_URL + OPENCLAW_TOKEN (self-hosted) or LOVABLE_API_KEY.",
  );
}

/** Human-readable label of the active engine, for report attribution in the UI. */
export function engineLabel(): string {
  const override = Deno.env.get("AI_ENGINE_LABEL");
  if (override) return override;
  const gateway = resolveGateway();
  return gateway.label === "openclaw"
    ? "OpenAI GPT-5.5 via OpenClaw (ChatGPT OAuth)"
    : "Google Gemini 2.5 Flash via Lovable AI Gateway";
}

/**
 * Pulls a JSON object out of a model's free-text reply. Tolerates ```json fences
 * and surrounding prose by taking the outermost {...} span. Returns null if no
 * parseable object is found. Used for JSON-mode output (no tool calls), which is
 * the portable path across the OpenClaw/Codex runtime and stateless gateways.
 */
export function extractJsonObject(text: string): Record<string, unknown> | null {
  if (!text) return null;
  const fenced = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(fenced.slice(start, end + 1));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Calls the active gateway's /v1/chat/completions and returns the raw Response,
 * so streaming callers can read the body and non-streaming callers can `.json()`.
 */
export async function chatCompletion(opts: ChatOptions): Promise<Response> {
  const gateway = resolveGateway();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${gateway.token}`,
    "Content-Type": "application/json",
  };
  if (gateway.supportsSession && opts.sessionKey) {
    headers["x-openclaw-session-key"] = opts.sessionKey;
  }

  const body: Record<string, unknown> = {
    model: gateway.model,
    messages: opts.messages,
  };
  if (opts.tools) body.tools = opts.tools;
  if (opts.toolChoice) body.tool_choice = opts.toolChoice;
  if (opts.stream) body.stream = true;

  return await fetch(gateway.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: opts.signal,
  });
}
