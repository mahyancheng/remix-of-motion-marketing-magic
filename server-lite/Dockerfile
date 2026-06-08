# Minimal Codex wrapper image — node-slim + the prebuilt Codex binary + a tiny
# HTTP server. No OpenClaw, no channels, no UI, no compile step. Builds in ~1-2
# min and runs in tens of MB of RAM — fits a 1 GB VPS comfortably.
FROM node:24-bookworm-slim

# util-linux provides `script` (the PTY codex device-auth login needs);
# tini for clean signal handling; ca-certificates for TLS.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates util-linux tini \
    && rm -rf /var/lib/apt/lists/*

# Install ONLY the Codex CLI (prebuilt — pulls the platform binary, no compile).
ARG CODEX_VERSION=0.135.0
RUN npm install -g @openai/codex@${CODEX_VERSION} && npm cache clean --force

COPY server.mjs /srv/server.mjs
COPY login-sidecar.mjs /srv/login-sidecar.mjs
COPY entrypoint.sh /srv/entrypoint.sh
RUN chmod +x /srv/entrypoint.sh

# ChatGPT auth + the agent's file workspace persist in a volume mounted at /data.
# CODEX_SANDBOX=bypass: the CONTAINER is the sandbox, so Codex skips its own
# bubblewrap sandbox (which needs unprivileged user namespaces that containers
# don't have). This is what enables the file read/write tools in here.
ENV CODEX_HOME=/data/.codex PORT=18789 CODEX_BIN=codex \
    CODEX_WORKDIR=/data/workspace CODEX_SANDBOX=bypass CODEX_WEB_SEARCH=true
EXPOSE 18789 8790
ENTRYPOINT ["tini", "-s", "--", "/srv/entrypoint.sh"]
