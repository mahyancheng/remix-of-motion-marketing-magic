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
docker compose up -d --build  # first build clones + compiles OpenClaw (runtime only)
docker compose logs -f        # watch it come up; gateway = :18789, sidecar = :8790
```
That's it for the box. Config + ChatGPT auth persist in the `openclaw-data` volume
across restarts/reboots (`restart: unless-stopped`).

> **Compiling needs RAM even though running is light.** The image builds
> OpenClaw's runtime with `tsdown`, which needs ~2–4 GB *during the build*. On a
> 1 GB-RAM VPS the build OOM-kills (`tsdown ... SIGABRT` / exit 137) unless you
> add swap. Running the gateway afterwards is light. Two ways to handle a small box:
>
> **A) Add swap, then build on the box** (simplest):
> ```bash
> sudo fallocate -l 8G /swapfile2 && sudo chmod 600 /swapfile2
> sudo mkswap /swapfile2 && sudo swapon /swapfile2
> echo '/swapfile2 none swap sw 0 0' | sudo tee -a /etc/fstab   # persist on reboot
> free -h                                                       # confirm ~+8G swap
> # then build inside screen/tmux (it's slow on 1 core — be patient, don't interrupt):
> docker compose build 2>&1 | tee build.log && docker compose up -d
> ```
>
> **B) Build off-box, ship the image** (cleanest — never compile on prod):
> ```bash
> # on a machine with ≥4 GB RAM:
> docker compose build && docker save openclaw-gateway:local | gzip > oc.tar.gz
> scp oc.tar.gz root@VPS:/root/ && ssh root@VPS 'docker load < /root/oc.tar.gz'
> # then on the VPS just run it (no build): docker compose up -d
> ```
>
> If even with swap the build still gets killed, the box needs more RAM
> (2 GB works, 4 GB is comfortable).

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
