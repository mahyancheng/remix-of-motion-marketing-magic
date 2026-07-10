#!/usr/bin/env bash
# Enable SSH access on the VPS with KEY-ONLY auth (user request, July 2026).
# - installs/starts openssh-server
# - authorizes the leadzap-seo-agent ed25519 key for root
# - disables password login entirely (keys only) so enabling SSH adds no
#   brute-force surface
# Idempotent — safe to re-run.
set -uo pipefail

PUB="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG0/iWenPtyTl+rAHUdF4uB15BwVE3P3mCEfBM3VDDFA leadzap-seo-agent"

export DEBIAN_FRONTEND=noninteractive
apt-get install -y openssh-server >/dev/null 2>&1 || true

mkdir -p /root/.ssh
chmod 700 /root/.ssh
touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
grep -qF "leadzap-seo-agent" /root/.ssh/authorized_keys || printf '%s\n' "$PUB" >> /root/.ssh/authorized_keys

# key-only auth, no passwords (drop-in wins over sshd_config defaults)
install -d -m 755 /etc/ssh/sshd_config.d
printf 'PubkeyAuthentication yes\nPasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin prohibit-password\n' > /etc/ssh/sshd_config.d/99-leadzap.conf

# firewall: open 22 if ufw is in use
ufw allow 22/tcp >/dev/null 2>&1 || true

systemctl enable ssh >/dev/null 2>&1 || systemctl enable sshd >/dev/null 2>&1 || true
systemctl restart ssh 2>/dev/null || systemctl restart sshd 2>/dev/null

echo "=== sshd active? ==="
systemctl is-active ssh 2>/dev/null || systemctl is-active sshd 2>/dev/null
echo "=== listening ==="
ss -tlnp | grep -E '(:22)\b' || echo "NOT listening on 22"
echo "=== authorized keys for root ==="
cat /root/.ssh/authorized_keys
echo "=== auth policy ==="
sshd -T 2>/dev/null | grep -Ei 'passwordauthentication|pubkeyauthentication|permitrootlogin'
