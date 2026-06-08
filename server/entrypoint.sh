#!/usr/bin/env bash
# Starts the OpenClaw gateway + the login sidecar in one container, sharing one
# OPENCLAW_HOME / CODEX_HOME so the sidecar's login writes the auth the gateway reads.
set -uo pipefail

: "${OPENCLAW_GATEWAY_TOKEN:?set OPENCLAW_GATEWAY_TOKEN}"
: "${OPENCLAW_SIDECAR_TOKEN:?set OPENCLAW_SIDECAR_TOKEN}"
: "${OPENCLAW_MJS:=/usr/local/lib/node_modules/openclaw/openclaw.mjs}"
mkdir -p "$OPENCLAW_HOME" "$CODEX_HOME"

CFG="$OPENCLAW_HOME/.openclaw/openclaw.json"
if [ ! -f "$CFG" ]; then
  echo "[entrypoint] first run — onboarding gateway (token auth, no model yet)…"
  node "$OPENCLAW_MJS" onboard --non-interactive --accept-risk --auth-choice skip \
    --gateway-auth token --gateway-token "$OPENCLAW_GATEWAY_TOKEN" \
    --gateway-bind lan --gateway-port 18789 --skip-bootstrap --skip-health || true
fi

# Expose the OpenAI-compatible endpoint the report function calls. Leave thinking
# at default (medium) — "off" makes gpt-5.5 return empty.
node "$OPENCLAW_MJS" config set gateway.http.endpoints.chatCompletions.enabled true || true

echo "[entrypoint] starting login sidecar on :8790"
ADMIN_TOKEN="$OPENCLAW_SIDECAR_TOKEN" OPENCLAW_BIN="$OPENCLAW_MJS" PORT=8790 \
  node /srv/login-sidecar.mjs &

echo "[entrypoint] starting gateway on :18789"
exec node "$OPENCLAW_MJS" gateway run
