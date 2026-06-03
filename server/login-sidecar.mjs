// OpenClaw login sidecar — runs on your VPS next to the OpenClaw gateway (sharing
// the same OPENCLAW_HOME / CODEX_HOME) and exposes a tiny HTTP API so the admin
// Settings page can connect ChatGPT without SSH. It drives the interactive
// `openclaw models auth login --provider openai --device-code` flow under a PTY
// (via `script`), scrapes the verification URL + code, and reports auth status.
//
// Env:
//   PORT                 (default 8790)
//   ADMIN_TOKEN          shared secret the Supabase proxy must send (required)
//   OPENCLAW_CMD         CLI command (default "openclaw"); or set OPENCLAW_BIN to a .mjs path
//   OPENCLAW_HOME        OpenClaw home (defaults to the gateway's)
//   CODEX_HOME           Codex home (defaults to ~/.codex)
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
const OPENCLAW_BIN = process.env.OPENCLAW_BIN || "";
const OPENCLAW_CMD = process.env.OPENCLAW_CMD || "openclaw";
const CHILD_ENV = { ...process.env };

// Build the argv that runs the OpenClaw CLI with the given args.
const openclawArgv = (args) => (OPENCLAW_BIN ? ["node", OPENCLAW_BIN, ...args] : [OPENCLAW_CMD, ...args]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "").replace(/\x1b\][0-9;]*[^\x07]*\x07/g, "");
const sessions = new Map();

function runOpenclaw(args) {
  return new Promise((resolve) => {
    let out = "";
    const [cmd, ...rest] = openclawArgv(args);
    const p = spawn(cmd, rest, { env: CHILD_ENV });
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("error", () => resolve({ code: -1, out }));
    p.on("close", (code) => resolve({ code, out: stripAnsi(out) }));
  });
}

async function getStatus() {
  const { out } = await runOpenclaw(["models", "auth", "list"]);
  const m = out.match(/openai:([^\s]+).*?\[openai\/oauth;\s*expires\s*([^\]]+)\]/i);
  if (m) return { connected: true, account: m[1], expires: m[2].trim() };
  return { connected: false, account: null, expires: null };
}

function startLogin() {
  const sessionId = randomUUID();
  // `script -q /dev/null <cmd>` gives the login a PTY (it refuses to run otherwise).
  const proc = spawn("script", ["-q", "/dev/null", ...openclawArgv(["models", "auth", "login", "--provider", "openai", "--device-code"])], { env: CHILD_ENV });
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
      const urlM = clean.match(/https:\/\/auth\.openai\.com\/codex\/device/i);
      const codeM = clean.match(/Code:?\s*([A-Z0-9]{4}-?[A-Z0-9]{4,5})/i);
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
}).listen(PORT, () => console.log(`openclaw login sidecar on :${PORT}`));
