# OpenClaw gateway + login sidecar (VPS)

These run on a small always-on server (your VPS). They are **not** part of the
static frontend and cannot run on serverless hosting — OpenClaw holds a live
ChatGPT/Codex session.

## Install OpenClaw

OpenClaw is a separate open-source project: https://github.com/openclaw/openclaw

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw && pnpm install && pnpm build
```
> Build from source — the published `:latest` Docker image can register a stale
> `openai-codex` auth profile that the current model route can't use.

## Configure + run the gateway

```bash
# from the openclaw checkout
node openclaw.mjs config set gateway.http.endpoints.chatCompletions.enabled true
node openclaw.mjs config set gateway.auth.mode token
node openclaw.mjs doctor --generate-gateway-token   # -> OPENCLAW_TOKEN (use in Supabase secrets)
# leave thinking at its default (medium) — do NOT set it to "off" (returns empty)

node openclaw.mjs gateway run                        # serves :18789
```
Put nginx + TLS in front of `:18789` so Supabase can reach it at `https://openclaw.yourdomain.com`.

## Run the login sidecar (same user as the gateway)

```bash
ADMIN_TOKEN="<random-secret>" \
PORT=8790 \
OPENCLAW_BIN="$(pwd)/openclaw.mjs" \
node /path/to/this-repo/server/login-sidecar.mjs
```
- Use the **same Linux user** as the gateway so it shares `~/.openclaw` / `~/.codex`.
- Keep it bound to localhost / your private network; the only thing that should
  reach it is the `openclaw-auth` Supabase function (`OPENCLAW_SIDECAR_TOKEN`).
- Put both under a process manager (`systemd`, `pm2`) so they restart on reboot.

## First login

Either run `node openclaw.mjs models auth login --provider openai --device-code`
once on the VPS, **or** just click **Connect ChatGPT** in the app's admin
Settings — the sidecar drives the same flow and the panel shows the code to approve.

> Prerequisite: in ChatGPT → Settings → Security, enable **device-code
> authorization for Codex** (one-time, on the ChatGPT account). Requires a paid
> ChatGPT plan (Plus/Pro/Business).
