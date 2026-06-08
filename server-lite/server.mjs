// Minimal OpenAI-compatible wrapper around the Codex CLI (ChatGPT OAuth).
//
// This is the *stripped-down* backend: no OpenClaw, no channels, no plugins, no
// web UI — just a tiny HTTP server that, per request, runs `codex exec` against
// your ChatGPT session and returns the assistant reply in OpenAI format. Your
// app only calls /v1/chat/completions and parses JSON out of the text reply
// (no tool calls), so this is a drop-in for the heavy gateway.
//
// Env:
//   PORT                    listen port (default 18789)
//   OPENCLAW_GATEWAY_TOKEN  bearer token callers must send (also accepts OPENCLAW_TOKEN)
//   CODEX_BIN               codex binary (default "codex")
//   CODEX_MODEL             model override (default: codex's ChatGPT-sub default)
//   CODEX_HOME              where the ChatGPT auth lives (set by the container)
//   REQUEST_TIMEOUT_MS      max time for one generation (default 240000)
import http from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = Number(process.env.PORT || 18789);
const TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN || "";
const CODEX_BIN = process.env.CODEX_BIN || "codex";
const CODEX_MODEL = process.env.CODEX_MODEL || "";
const REQ_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 240000);
// Tools: scoped, not zero. workspace-write = read anywhere + write the working
// dir (for proposals); --search = web browsing. Container is the outer sandbox.
const CODEX_SANDBOX = process.env.CODEX_SANDBOX || "workspace-write"; // read-only | workspace-write | danger-full-access | bypass
const CODEX_WEB_SEARCH = (process.env.CODEX_WEB_SEARCH || "true") !== "false";
const CODEX_WORKDIR = process.env.CODEX_WORKDIR || ""; // persistent workspace for file r/w; empty = throwaway tmp
const CODEX_REASONING = process.env.CODEX_REASONING || "medium"; // none | low | medium | high

const stripAnsi = (s) => String(s).replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "");

function readBody(req) {
  return new Promise((resolve, reject) => {
    let b = "";
    req.on("data", (c) => {
      b += c;
      if (b.length > 8e6) { reject(new Error("body too large")); req.destroy(); }
    });
    req.on("end", () => resolve(b));
    req.on("error", reject);
  });
}

// Flatten OpenAI chat messages into a single prompt Codex can run, and steer it
// to behave as a plain responder rather than a coding agent.
function buildPrompt(messages) {
  const parts = [];
  for (const m of messages || []) {
    const c = m?.content;
    const content = typeof c === "string"
      ? c
      : Array.isArray(c)
        ? c.map((p) => (typeof p === "string" ? p : p?.text || "")).join("\n")
        : String(c ?? "");
    parts.push(`${String(m?.role || "user").toUpperCase()}:\n${content}`);
  }
  return (
    "You are a helpful assistant answering through an API. Read the conversation " +
    "below and reply to the latest message. You MAY read/write files in the working " +
    "directory and use web search when it genuinely helps. Output ONLY your final " +
    "answer as the assistant message — no preamble, no tool chatter. If asked for " +
    "JSON, reply with JSON only.\n\n" +
    parts.join("\n\n") +
    "\n\nASSISTANT:"
  );
}

// Run one Codex turn with scoped tools (file r/w in the workspace + web search).
// The container is the outer sandbox. The final assistant message is read from -o.
function runCodex(prompt) {
  return new Promise((resolve) => {
    const persistent = !!CODEX_WORKDIR;
    const work = persistent ? CODEX_WORKDIR : mkdtempSync(join(tmpdir(), "codex-"));
    const outFile = join(work, `.reply-${randomUUID()}.txt`);
    // `--search` (web browsing) is a top-level flag, so it goes BEFORE `exec`.
    const args = CODEX_WEB_SEARCH ? ["--search", "exec"] : ["exec"];
    args.push("--skip-git-repo-check", "--ephemeral");
    if (CODEX_SANDBOX === "bypass") args.push("--dangerously-bypass-approvals-and-sandbox");
    else args.push("-s", CODEX_SANDBOX);
    if (CODEX_REASONING) args.push("-c", `model_reasoning_effort=${CODEX_REASONING}`);
    args.push("-C", work, "-o", outFile);
    if (CODEX_MODEL) args.push("-m", CODEX_MODEL);
    args.push("-"); // read prompt from stdin

    let err = "";
    let done = false;
    const finish = (v) => {
      if (done) return; done = true;
      try { rmSync(outFile, { force: true }); } catch {}
      if (!persistent) cleanup(work);
      resolve(v);
    };

    const p = spawn(CODEX_BIN, args, { env: process.env });
    const killer = setTimeout(() => { try { p.kill("SIGKILL"); } catch {} finish({ ok: false, error: "timeout" }); }, REQ_TIMEOUT_MS);
    p.stderr.on("data", (d) => { err += d; });
    p.on("error", (e) => { clearTimeout(killer); finish({ ok: false, error: e.message }); });
    p.on("close", (code) => {
      clearTimeout(killer);
      let reply = "";
      try { reply = readFileSync(outFile, "utf8").trim(); } catch {}
      if (reply) return finish({ ok: true, reply });
      finish({ ok: false, error: stripAnsi(err).slice(-600) || `codex exited ${code}` });
    });
    p.stdin.write(prompt);
    p.stdin.end();
  });
}
function cleanup(dir) { try { rmSync(dir, { recursive: true, force: true }); } catch {} }

function chatResponse(model, reply) {
  return {
    id: "chatcmpl-" + randomUUID(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: model || "codex",
    choices: [{ index: 0, message: { role: "assistant", content: reply }, finish_reason: "stop" }],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
  };
}

const server = http.createServer(async (req, res) => {
  const send = (code, obj, headers = {}) => {
    res.writeHead(code, { "Content-Type": "application/json", ...headers });
    res.end(typeof obj === "string" ? obj : JSON.stringify(obj));
  };
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && (url.pathname === "/healthz" || url.pathname === "/")) return send(200, { ok: true });
    if (req.method === "GET" && url.pathname === "/v1/models")
      return send(200, { object: "list", data: [{ id: CODEX_MODEL || "codex", object: "model", owned_by: "codex" }] });

    if (req.method === "POST" && (url.pathname === "/v1/chat/completions" || url.pathname === "/api/chat")) {
      if (TOKEN && (req.headers.authorization || "") !== `Bearer ${TOKEN}`)
        return send(401, { error: { message: "unauthorized", type: "auth_error" } });

      const body = JSON.parse((await readBody(req)) || "{}");
      const messages = url.pathname === "/api/chat" && body.message
        ? [{ role: "user", content: String(body.message) }]
        : body.messages || [];
      if (!Array.isArray(messages) || messages.length === 0)
        return send(400, { error: { message: "`messages` is required", type: "invalid_request_error" } });

      const result = await runCodex(buildPrompt(messages));
      if (!result.ok)
        return send(502, { error: { message: "codex failed: " + result.error, type: "api_error" } });

      if (body.stream) {
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
        const chunk = (delta, finish_reason = null) =>
          res.write(`data: ${JSON.stringify({ id: "chatcmpl-stream", object: "chat.completion.chunk", created: Math.floor(Date.now() / 1000), model: body.model || "codex", choices: [{ index: 0, delta, finish_reason }] })}\n\n`);
        chunk({ role: "assistant", content: result.reply });
        chunk({}, "stop");
        res.write("data: [DONE]\n\n");
        return res.end();
      }
      return send(200, chatResponse(body.model, result.reply));
    }
    return send(404, { error: { message: "not found" } });
  } catch (e) {
    return send(500, { error: { message: e?.message || "error", type: "api_error" } });
  }
});
server.listen(PORT, "0.0.0.0", () => console.log(`[codex-wrapper] listening on :${PORT}`));
