# OpenClaw gateway + login sidecar (VPS)

This runs on a small always-on server (your VPS, ~2 GB RAM). It cannot run on
shared/serverless hosting — OpenClaw holds a live ChatGPT/Codex session. It hosts
two things behind one container:

- **gateway** (`:18789`) — the OpenAI-compatible API the report function calls.
- **login sidecar** (`:8790`) — lets the admin Settings page connect ChatGPT.

## Quick start (Docker — recommended)

```bash
cd server
cp .env.example .env          # then edit the two tokens (openssl rand -hex 24)
docker compose up -d --build  # first build ~3-5 min (clones + builds OpenClaw)
docker compose logs -f        # watch it come up; gateway = :18789, sidecar = :8790
```
That's it for the box. Config + ChatGPT auth persist in the `openclaw-data` volume
across restarts/reboots (`restart: unless-stopped`).

### Put HTTPS in front (so Supabase can reach it)

Both ports bind to `127.0.0.1`; expose them via nginx + TLS (e.g. certbot):

```nginx
server {
  server_name openclaw.yourdomain.com;
  location /        { proxy_pass http://127.0.0.1:18789; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
  location /sidecar/ { proxy_pass http://127.0.0.1:8790/; }
}
```
Then set the Supabase secrets (see `../DEPLOYMENT.md`):
- `OPENCLAW_URL = https://openclaw.yourdomain.com`
- `OPENCLAW_SIDECAR_URL = https://openclaw.yourdomain.com/sidecar`

## Connect ChatGPT (one-time)

In ChatGPT → Settings → Security, enable **device-code authorization for Codex**
(needs a paid ChatGPT plan). Then in the app: **admin Settings → AI Engine —
OpenClaw → Connect ChatGPT**, approve the code. Done. If a report fails right
after the very first connect, `docker compose restart` once to pick up the new auth.

## Without Docker (manual)

```bash
git clone https://github.com/openclaw/openclaw.git && cd openclaw
pnpm install && pnpm build
node openclaw.mjs config set gateway.http.endpoints.chatCompletions.enabled true
node openclaw.mjs config set gateway.auth.mode token
node openclaw.mjs doctor --generate-gateway-token     # -> OPENCLAW_TOKEN
node openclaw.mjs gateway run &                        # :18789
ADMIN_TOKEN=<secret> OPENCLAW_BIN="$(pwd)/openclaw.mjs" PORT=8790 \
  node /path/to/repo/server/login-sidecar.mjs &        # :8790
```
Run both under `systemd`/`pm2` so they survive reboots, as the same user (shared
`~/.openclaw` / `~/.codex`). Leave thinking at default — `off` returns empty.
