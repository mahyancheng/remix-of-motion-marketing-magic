#!/usr/bin/env bash
# Starts the minimal Codex wrapper (:18789) + the login sidecar (:8790) in one
# container, sharing CODEX_HOME so the sidecar's login writes the auth the
# wrapper reads. No OpenClaw, no onboarding — just Codex behind an HTTP API.
set -uo pipefail

: "${OPENCLAW_GATEWAY_TOKEN:?set OPENCLAW_GATEWAY_TOKEN}"
: "${OPENCLAW_SIDECAR_TOKEN:?set OPENCLAW_SIDECAR_TOKEN}"
: "${CODEX_HOME:=/data/.codex}"
mkdir -p "$CODEX_HOME"
export CODEX_HOME

echo "[entrypoint] starting Codex login sidecar on :8790"
ADMIN_TOKEN="$OPENCLAW_SIDECAR_TOKEN" PORT=8790 node /srv/login-sidecar.mjs &

echo "[entrypoint] starting Codex wrapper on :18789"
exec node /srv/server.mjs
