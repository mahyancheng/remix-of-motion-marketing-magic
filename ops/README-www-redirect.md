# www -> non-www 301 (apply on the VPS)

Current state (June 2026): `https://www.leadzap.com.my` has **no TLS cert** and
fails to connect; `http://www` 404s. Non-www works fine. Canonical tags already
point everything to non-www, so this is cleanup, not urgent.

Run these on the VPS (one line at a time — the VNC keyboard mistypes `&&`).
All commands are special-char-free; the config content comes from git so you
never hand-type `{ } ; $`.

```sh
# 0. SEE the current setup first — confirm cert path + whether www is already in a server_name
ls /etc/letsencrypt/live/
nginx -T | grep -nE "server_name|ssl_certificate|listen"

# 1. Expand the existing cert to include www (webroot challenge; no config edits)
certbot certonly --webroot -w /var/www/my-app -d leadzap.com.my -d www.leadzap.com.my --expand --non-interactive --agree-tos
#    If that fails (www:80 not served from /var/www/my-app), use the nginx plugin instead:
#    certbot certonly --nginx -d leadzap.com.my -d www.leadzap.com.my --expand --non-interactive --agree-tos

# 2. Pull the redirect block from git and install it
cd ~/remix-of-motion-marketing-magic
git fetch origin main
git checkout origin/main -- ops/nginx-www-redirect.conf
cp ops/nginx-www-redirect.conf /etc/nginx/conf.d/www-redirect.conf

# 3. Test (this GATES the reload — a bad config can never take the site down) then reload
nginx -t
systemctl reload nginx
```

Verify from anywhere:
```sh
curl -sI https://www.leadzap.com.my/sem/      # expect: 301 -> https://leadzap.com.my/sem/
curl -s -o /dev/null -w '%{http_code}\n' https://leadzap.com.my/   # expect: 200
```

Rollback if needed: `rm /etc/nginx/conf.d/www-redirect.conf && nginx -t && systemctl reload nginx`
