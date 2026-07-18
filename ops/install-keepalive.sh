#!/usr/bin/env bash
# One-shot installer for the Supabase keep-alive (run on the VPS from the repo root).
# Bundles every step so it can be invoked with a single short command over the
# flaky VNC console. Idempotent — safe to re-run.
set -uo pipefail

install -m 755 ops/supabase-keepalive.sh /root/supabase-keepalive.sh
install -m 644 ops/supabase-keepalive.cron /etc/cron.d/supabase-keepalive

# reload cron so it picks up the new /etc/cron.d entry
systemctl restart cron 2>/dev/null || service cron restart 2>/dev/null || true

echo "=== installed files ==="
ls -l /root/supabase-keepalive.sh /etc/cron.d/supabase-keepalive
echo "=== cron entry ==="
cat /etc/cron.d/supabase-keepalive
echo "=== test run (expect http=200) ==="
bash /root/supabase-keepalive.sh
