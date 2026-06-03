# Deployment

This app uses OpenClaw (your ChatGPT subscription) to generate the AI Performance
Reports. OpenClaw is an **always-on service**, so a deploy has three pieces. Do
them once; after that you only ever click **Connect ChatGPT** in admin Settings.

```
Browser (frontend)
   ├─ login + client data ─────────────► Supabase (DB + Edge Functions)
   └─ "Generate Report" / "Connect" ───► Supabase Functions ──► OpenClaw gateway + login sidecar (your VPS)
```

## 1. Frontend → your web host

```bash
npm install
npm run build      # outputs to dist/
# upload dist/ to your host (or connect the repo to Vercel/Netlify/etc.)
```
Set the build env vars on your host: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
(already in `.env`). **Do not** set the `VITE_OPENCLAW_LOGIN_URL` / `VITE_LOCAL_FUNCTIONS_URL`
vars in production — those are local-dev only.

## 2. Supabase Edge Functions

```bash
supabase link --project-ref <your-project-ref>
supabase functions deploy metrics-insights
supabase functions deploy openclaw-auth

# point the report engine at your OpenClaw gateway:
supabase secrets set OPENCLAW_URL="https://openclaw.yourdomain.com" OPENCLAW_TOKEN="<gateway-token>"
# let the admin login panel reach the sidecar (server-side only):
supabase secrets set OPENCLAW_SIDECAR_URL="http://<vps-host>:8790" OPENCLAW_SIDECAR_TOKEN="<sidecar-token>"
```
> Leave `OPENCLAW_URL` unset to fall back to the old Lovable/Gemini engine instead.

## 3. OpenClaw gateway + login sidecar → your VPS

See **[`server/README.md`](server/README.md)** for the exact commands. In short:
run the OpenClaw gateway (HTTP API + token auth) and `server/login-sidecar.mjs`
on the VPS as the same user, behind HTTPS.

## 4. Connect ChatGPT (you, once)

Open **admin Settings → AI Engine — OpenClaw → Connect ChatGPT**, approve the
device code in your browser, done. The "Generate Report" button now runs through
your ChatGPT subscription. The footer attribution updates automatically.
