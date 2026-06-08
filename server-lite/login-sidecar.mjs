// Codex login sidecar — tiny HTTP API so the admin Settings page can connect
// ChatGPT without SSH. Drives `codex login --device-auth` under a PTY (via
// `script`), scrapes the verification URL + code, and reports status. Same
// endpoint contract as the OpenClaw sidecar, so the app's "Connect ChatGPT"
// panel works unchanged — only the underlying CLI is Codex directly.
//
// Env:
//   PORT          (default 8790)
//   ADMIN_TOKEN   shared secret the Supabase proxy must send (required)
//   CODEX_BIN     codex binary (default "codex")
//   CODEX_HOME    Codex home (where auth is written; set by the container)
//
// Endpoints (all require Authorization: Bearer ADMIN_TOKEN):
//   GET  /status                       -> { connected, account, expires }
//   POST /login/start                  -> { sessionId, verificationUri, userCode } | { needsDeviceCodeToggle:true }
//   GET  /login/status?sessionId=...   -> { state: 'pending'|'connected'|'error', detail }
import http from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT || 8790);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const CODEX_BIN = process.env.CODEX_BIN || "codex";
const CHILD_ENV = { ...process.env };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "").replace(/\x1b\][0-9;]*[^\x07]*\x07/g, "");
const sessions = new Map();

function runCodex(args) {
  return new Promise((resolve) => {
    let out = "";
    const p = spawn(CODEX_BIN, args, { env: CHILD_ENV });
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("error", () => resolve({ code: -1, out }));
    p.on("close", (code) => resolve({ code, out: stripAnsi(out) }));
  });
}

async function getStatus() {
  const { out } = await runCodex(["login", "status"]);
  // Codex prints something like "Logged in using ChatGPT" / an account/email.
  if (/logged in|authenticated|chatgpt/i.test(out)) {
    const acct = out.match(/([\w.+-]+@[\w.-]+\.\w+)/)?.[1] || out.match(/account[:\s]+([^\n]+)/i)?.[1]?.trim() || "ChatGPT";
    return { connected: true, account: acct, expires: null };
  }
  return { connected: false, account: null, expires: null };
}

function startLogin() {
  const sessionId = randomUUID();
  // `script -q /dev/null <cmd>` gives the login a PTY (device-auth needs one).
  const proc = spawn("script", ["-q", "/dev/null", CODEX_BIN, "login", "--device-auth"], { env: CHILD_ENV });
  const session = { proc, buf: "", state: "pending", detail: "" };
  sessions.set(sessionId, session);
  const onData = (d) => {
    session.buf += d;
    const clean = stripAnsi(session.buf);
    if (/logged in|success|credentials saved|authenticated/i.test(clean)) session.state = "connected";
    if (/enable device code authorization/i.test(clean)) { session.state = "error"; session.detail = "needsDeviceCodeToggle"; }
  };
  proc.stdout.on("data", onData);
  proc.stderr.on("data", onData);
  proc.on("close", (code) => {
    if (session.state === "pending") session.state = code === 0 ? "connected" : "error";
    if (session.state === "error" && !session.detail) session.detail = stripAnsi(session.buf).slice(-300);
  });

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = setInterval(() => {
      const clean = stripAnsi(session.buf).replace(/\s+/g, " ");
      const urlM = clean.match(/https:\/\/auth\.openai\.com\/[^\s"']+/i);
      const codeM = clean.match(/\b([A-Z0-9]{4}-?[A-Z0-9]{4,5})\b/);
      if (session.detail === "needsDeviceCodeToggle") { clearInterval(tick); return resolve({ needsDeviceCodeToggle: true }); }
      if (urlM && codeM) { clearInterval(tick); return resolve({ sessionId, verificationUri: urlM[0], userCode: codeM[1] }); }
      if (Date.now() - started > 25000) { clearInterval(tick); return resolve({ sessionId, verificationUri: "https://auth.openai.com/codex/device", userCode: null, detail: "code not detected yet" }); }
    }, 800);
  });
}

http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
  const send = (code, obj) => { res.writeHead(code, cors); res.end(JSON.stringify(obj)); };
  if (!ADMIN_TOKEN || (req.headers["authorization"] || "") !== `Bearer ${ADMIN_TOKEN}`) return send(401, { error: "unauthorized" });
  const url = new URL(req.url, "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/status") return send(200, await getStatus());
    if (req.method === "POST" && url.pathname === "/login/start") return send(200, await startLogin());
    if (req.method === "GET" && url.pathname === "/login/status") {
      const s = sessions.get(url.searchParams.get("sessionId"));
      if (!s) return send(404, { state: "error", detail: "unknown session" });
      if (s.state === "connected") { const st = await getStatus(); return send(200, { state: st.connected ? "connected" : "pending", account: st.account }); }
      return send(200, { state: s.state, detail: s.detail });
    }
    return send(404, { error: "not found" });
  } catch (e) { return send(500, { error: e?.message || "error" }); }
}).listen(PORT, () => console.log(`[codex-login-sidecar] listening on :${PORT}`));
