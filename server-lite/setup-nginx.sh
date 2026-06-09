#!/usr/bin/env bash
# Adds /openclaw + /openclaw-sidecar reverse-proxy paths to the live
# leadzap.com.my nginx server block so Supabase can reach the Codex wrapper.
#
# SAFE BY DESIGN: backs up the config, runs `nginx -t`, and only reloads if the
# test passes. On any failure it restores the backup, so the live site is never
# left on a broken config.
set -uo pipefail

CONF=/etc/nginx/sites-available/default
SNIP_SRC="$(cd "$(dirname "$0")" && pwd)/openclaw.conf"
SNIP_DST=/etc/nginx/snippets/openclaw.conf

[ -f "$CONF" ] || { echo "MISSING $CONF — aborting"; exit 1; }
mkdir -p /etc/nginx/snippets
cp "$SNIP_SRC" "$SNIP_DST"
echo "installed snippet -> $SNIP_DST"

if grep -q "snippets/openclaw.conf" "$CONF"; then
  echo "include already present in $CONF (skipping insert)"
else
  BAK="$CONF.bak.$(date +%s)"
  cp "$CONF" "$BAK"
  echo "backed up -> $BAK"
  if grep -qE "ssl_certificate .*leadzap\.com\.my" "$CONF"; then
    # insert the include right after the TLS cert line (inside the 443 block)
    sed -i '/ssl_certificate .*leadzap\.com\.my/a\    include /etc/nginx/snippets/openclaw.conf;' "$CONF"
    echo "inserted include into $CONF"
  else
    echo "ANCHOR_NOT_FOUND: no 'ssl_certificate ... leadzap.com.my' line in $CONF"
    echo "Not modifying. Paste the include manually inside the 443 server block."
    exit 2
  fi
fi

if nginx -t; then
  systemctl reload nginx
  echo "=== NGINX_RELOADED_OK ==="
  echo "Test it:  curl -s https://leadzap.com.my/openclaw/healthz"
else
  echo "=== NGINX_TEST_FAILED — restoring backup, site untouched ==="
  LATEST=$(ls -t "$CONF".bak.* 2>/dev/null | head -1)
  if [ -n "${LATEST:-}" ]; then cp "$LATEST" "$CONF"; echo "restored $LATEST"; fi
  nginx -t >/dev/null 2>&1 && echo "restored config is valid"
  exit 3
fi
