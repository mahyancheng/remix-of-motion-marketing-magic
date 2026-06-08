# Codex wrapper (the minimal backend)

The **stripped-down** alternative to `../server` (full OpenClaw). Same job for
your app — an OpenAI-compatible `/v1/chat/completions` endpoint backed by your
ChatGPT subscription — but it's just:

```
node:24-slim  +  the Codex binary  +  ~200 lines of server.mjs
```

No OpenClaw, no messaging channels, no plugins, no web UI, **no compile step**.
Builds in 1–2 minutes and idles in tens of MB of RAM — runs fine on a 1 GB VPS.

How it works: each request flattens the chat `messages` into a prompt, runs
`codex exec` once (ephemeral, with **scoped tools** — file read/write in a
persistent workspace + web search), and returns the assistant reply in OpenAI
format. Your reports/proposals already parse JSON out of the text reply, so
nothing in the app changes — just point `OPENCLAW_URL` at this.

Tools (env-tunable): `CODEX_SANDBOX=bypass` (container is the sandbox — required
for file tools to work in Docker), `CODEX_WEB_SEARCH=true`, files live in
`CODEX_WORKDIR=/data/workspace`. Set `CODEX_WEB_SEARCH=false` or
`CODEX_SANDBOX=read-only` to lock it down further.

## Quick start

```bash
cd server-lite
cp .env.example .env          # set the two tokens (openssl rand -hex 24)
docker compose up -d --build  # installs the Codex binary — no source compile
docker compose logs -f        # wrapper = :18789, login sidecar = :8790
```

## Connect ChatGPT (one-time)

Either via the admin Settings → **Connect ChatGPT** panel (it drives the sidecar
on :8790), **or** straight from the box:

```bash
docker compose exec codex codex login --device-auth
# open the printed https://auth.openai.com/... URL, enter the code, done.
docker compose exec codex codex login status   # verify
```

The auth is saved in the `codex-data` volume and survives restarts.

## Point the app at it

Same as the full server — set the Supabase secrets:
- `OPENCLAW_URL = https://<your-host>`            (→ wrapper :18789)
- `OPENCLAW_TOKEN = <OPENCLAW_GATEWAY_TOKEN>`
- `OPENCLAW_SIDECAR_URL = https://<your-host>/sidecar`  (→ sidecar :8790)

Both ports bind to `127.0.0.1`; front them with nginx + TLS (see `../server/README.md`).

## Quick test

```bash
curl -s http://127.0.0.1:18789/v1/chat/completions \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" -H "content-type: application/json" \
  -d '{"messages":[{"role":"user","content":"reply with the single word: pong"}]}'
```

## When to use which

| | `../server` (OpenClaw) | `server-lite` (this) |
|---|---|---|
| Build | installs full prebuilt OpenClaw (~1 GB deps) | just the Codex binary |
| RAM | heavier; leans on swap on 1 GB | tens of MB idle |
| Tools | full agent platform | file r/w + web search |
| Best for | if you later need channels/tools | reports & proposals only |
