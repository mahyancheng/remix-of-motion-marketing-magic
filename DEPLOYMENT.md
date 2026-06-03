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
| OpenClaw gateway + login sidecar | **a small VPS (~2 GB RAM)** | ❌ no — needs an always-on server |

> If you don't want a VPS: leave `OPENCLAW_URL` unset and reports fall back to the
> Lovable/Gemini engine (or switch the function to a direct OpenAI API key) — then
> shared hosting alone is enough. Otherwise, a ~RM20/mo VPS runs OpenClaw.

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

**Analytics:** the Plausible snippet in `index.html` points at `http://localhost:8000`
(local Plausible). Before going live, change that `src` to your real Plausible host
over **https**, e.g. `https://plausible.yourdomain.com/js/pa-...js`. (Analytics only
tracks public pages — admin/client/dashboard routes are excluded in code.)

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

## Step 3 — OpenClaw gateway + login sidecar → your VPS

```bash
git clone https://github.com/mahyancheng/remix-of-motion-marketing-magic.git
cd remix-of-motion-marketing-magic/server
cp .env.example .env        # set OPENCLAW_GATEWAY_TOKEN + OPENCLAW_SIDECAR_TOKEN
                            # to the SAME two values from Step 2a
docker compose up -d --build   # builds OpenClaw from source, ~3-5 min first time
docker compose logs -f         # gateway = :18789, sidecar = :8790
```

Front both ports with nginx + TLS (full config in [`server/README.md`](server/README.md)):
```nginx
server {
  server_name openclaw.yourdomain.com;
  location /         { proxy_pass http://127.0.0.1:18789; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
  location /sidecar/ { proxy_pass http://127.0.0.1:8790/; }
}
```
Then the `OPENCLAW_URL` / `OPENCLAW_SIDECAR_URL` from Step 2 resolve to this server.

---

## Step 4 — Connect ChatGPT (you, once)

1. On the ChatGPT account: **Settings → Security → enable device-code authorization
   for Codex** (one-time; requires a paid ChatGPT plan).
2. In the app: **admin Settings → AI Engine — OpenClaw → Connect ChatGPT**, approve
   the code shown. Done — "Generate Report" now runs through your ChatGPT subscription,
   and the report footer attribution updates automatically.

> If the first report fails right after connecting, run `docker compose restart` on
> the VPS once so the gateway picks up the new auth.
