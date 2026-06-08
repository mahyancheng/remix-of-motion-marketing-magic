# Deployment Guide

Everything your developer needs to deploy this app. It has **three pieces** because
OpenClaw (the AI engine that uses your ChatGPT subscription) is an always-on service
and can't run on static/serverless hosting.

```
Browser (frontend)
   ├─ login + client data ─────────────► Supabase (DB + Edge Functions)
   └─ "Generate Report" / "Connect" ───► Supabase Functions ──► OpenClaw gateway + login sidecar (your VPS)
```

| Piece | Where it runs | Shared hosting OK? |
|---|---|---|
| Frontend (`dist/`) | your web host | ✅ yes (static files) |
| Supabase Edge Functions | Supabase cloud | ✅ yes (not on your hosting) |
| AI engine (Codex wrapper) + login sidecar | **a small VPS — 1 GB RAM is plenty** | ❌ no — needs an always-on server |

> The AI engine is `server-lite/` — a stripped-down Codex wrapper (node-slim + the
> Codex binary + ~200 lines) that speaks the OpenAI `/v1/chat/completions` API
> against your ChatGPT subscription. **No compile step, ~30–80 MB RAM, builds and
> runs on a 1 GB VPS.** (The heavier full-OpenClaw stack in `server/` is an
> alternative only if you later need channels/plugins — most setups don't.)
>
> If you don't want a VPS at all: leave `OPENCLAW_URL` unset and reports fall back
> to the Lovable/Gemini engine — then shared hosting alone is enough.

---

## Step 1 — Frontend → your web host

```bash
npm install
npm run build          # outputs dist/
# upload dist/ to your host, or connect the repo to Vercel/Netlify/etc.
```

Build-time env vars (already in `.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
**Do not** set `VITE_OPENCLAW_LOGIN_URL`, `VITE_OPENCLAW_LOGIN_TOKEN`, or
`VITE_LOCAL_FUNCTIONS_URL` in production — those are local-dev only.

**Analytics:** the Plausible script URL comes from `VITE_PLAUSIBLE_SRC` (the `.env`
default points at local Plausible). For production set it in your host's build env
(or `.env.production`) to your real host over **https**:
```
VITE_PLAUSIBLE_SRC="https://plausible.yourdomain.com/js/pa-s3qf2v0-OPuJQFCLAK5Vd.js"
```
No code edit needed. Analytics only tracks public pages — admin/client/dashboard
routes are excluded in code (`PlausibleTracker`).

---

## Step 2 — Supabase Edge Functions

```bash
supabase link --project-ref sevqghqgpyhxcgqzstrz

# 2a. Generate the two shared tokens (use these SAME values on the VPS in Step 3)
GATEWAY_TOKEN=$(openssl rand -hex 24)
SIDECAR_TOKEN=$(openssl rand -hex 24)
echo "GATEWAY_TOKEN=$GATEWAY_TOKEN"     # copy both — server/.env on the VPS needs them
echo "SIDECAR_TOKEN=$SIDECAR_TOKEN"

# 2b. Set the secrets
supabase secrets set \
  OPENCLAW_URL="https://openclaw.yourdomain.com" \
  OPENCLAW_TOKEN="$GATEWAY_TOKEN" \
  OPENCLAW_SIDECAR_URL="https://openclaw.yourdomain.com/sidecar" \
  OPENCLAW_SIDECAR_TOKEN="$SIDECAR_TOKEN" \
  AI_MODEL="openclaw"

# 2c. Deploy the functions
supabase functions deploy metrics-insights
supabase functions deploy openclaw-auth
```

### Secret reference

| Secret | Value | Used by | Must match |
|---|---|---|---|
| `OPENCLAW_URL` | gateway URL, e.g. `https://openclaw.yourdomain.com` | `metrics-insights` | — |
| `OPENCLAW_TOKEN` | random (`openssl rand -hex 24`) | `metrics-insights` | VPS `OPENCLAW_GATEWAY_TOKEN` |
| `OPENCLAW_SIDECAR_URL` | sidecar URL, e.g. `…/sidecar` | `openclaw-auth` | — |
| `OPENCLAW_SIDECAR_TOKEN` | random (`openssl rand -hex 24`) | `openclaw-auth` | VPS `OPENCLAW_SIDECAR_TOKEN` |
| `AI_MODEL` | `openclaw` (optional; default) | `metrics-insights` | — |

- **Don't set** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` —
  Supabase injects these into every function automatically.
- `LOVABLE_API_KEY` (the Gemini fallback) is already set from before — leave it.
  Reports use it automatically whenever `OPENCLAW_URL` is unset.

---

## Step 3 — AI engine → your VPS (the lightweight Codex wrapper)

Uses `server-lite/` — installs the prebuilt Codex binary (no source compile, so it
**won't OOM on a 1 GB box**) and runs a tiny OpenAI-compatible server + login sidecar.

```bash
git clone https://github.com/mahyancheng/remix-of-motion-marketing-magic.git
cd remix-of-motion-marketing-magic/server-lite
cp .env.example .env
# set the two tokens to the SAME values from Step 2a (GATEWAY_TOKEN / SIDECAR_TOKEN):
sed -i "s/replace-me-gateway-token/$GATEWAY_TOKEN/; s/replace-me-sidecar-token/$SIDECAR_TOKEN/" .env
docker compose up -d --build   # installs Codex — no compile, ~2-4 min first time
docker compose ps              # gateway = :18789, sidecar = :8790
```

Front both ports with nginx + TLS. **Keep the 300s read timeout** — a report can take
30–120 s and nginx's default 60 s would cut it off:
```nginx
server {
  server_name openclaw.yourdomain.com;
  location /         { proxy_pass http://127.0.0.1:18789; proxy_http_version 1.1; proxy_read_timeout 300s; }
  location /sidecar/ { proxy_pass http://127.0.0.1:8790/;  proxy_read_timeout 300s; }
}
```
Then the `OPENCLAW_URL` / `OPENCLAW_SIDECAR_URL` from Step 2 resolve to this server.

**Tools / knobs** (env in `server-lite/.env`, see [`server-lite/README.md`](server-lite/README.md)):
`CODEX_REASONING=medium` (report depth), `CODEX_WEB_SEARCH=true` (web browsing),
`CODEX_SANDBOX=bypass` (file read/write for proposals — required inside Docker).
All are sensible defaults baked into the image; override only if you want to.

---

## Step 4 — Connect ChatGPT (you, once — via the app)

In the app: **admin Settings → AI Engine → Connect ChatGPT → click Connect**. The
panel auto-runs the device-code login and shows a **link + one-time code** — open the
link, sign in with your ChatGPT account, type the code. Done; reports and proposals
now run through your ChatGPT subscription (the footer attribution updates automatically).

> If the panel says device-code auth isn't enabled, turn it on in ChatGPT
> **Settings → Security**, then click Connect again. If the first report fails right
> after connecting, run `docker compose restart` on the VPS once.
