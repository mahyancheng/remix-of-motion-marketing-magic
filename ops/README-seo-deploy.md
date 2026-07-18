# SEO / Performance deploy runbook (2026-07-18 audit)

## Why this matters — audit summary

Lighthouse (mobile) on the LIVE site scored **Performance 46**, while the same
audit on the current repo build scores **~87+**. The live server is running a
stale build: its homepage still has the old `SEO Agency Malaysia | LeadZap`
title, old JS bundles (5s of main-thread blocking from the always-on WebGL
background that the current code disables on mobile), and it 404s two image
assets. **Deploying a fresh build is the single biggest win.**

## 1. Build

```bash
npm run build
```

This now also generates:
- `dist/sitemap.xml` — auto-generated from the real prerendered routes
  (the hand-maintained `public/sitemap.xml` was stale — it listed blog slugs
  that no longer exist — and has been deleted)
- `dist/404.html` — a `noindex` SPA shell used for unknown URLs and private
  app routes (fixes Google "Soft 404" reports)
- `dist/admin/index.html` with `noindex, nofollow`

## 2. Deploy dist/ to the server

Upload the ENTIRE `dist/` directory (replace, don't merge — stale hashed
assets from old builds should not accumulate).

## 3. Install the nginx 404/redirect config (one-time)

Apply `ops/nginx-spa-404.conf` inside the leadzap.com.my `server` block
(see comments in that file). It:
- returns a real **HTTP 404** (with the styled noindex 404 page) for unknown
  URLs — currently they return 200 (soft-404)
- keeps private app routes (`/dashboard`, `/auth`, `/client/...`) working via
  the noindex shell
- 301-redirects the three old indexed blog slugs to their new URLs

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Verify after deploy

```bash
# fresh title deployed?
curl -s https://leadzap.com.my/ | grep -o "<title>[^<]*</title>"
#  -> Best SEO Expert In Malaysia | Google SEO Malaysia | Leadzap Marketing Sdn Bhd

# soft-404 fixed?
curl -s -o /dev/null -w "%{http_code}\n" https://leadzap.com.my/no-such-page/   # 404
curl -s -o /dev/null -w "%{http_code}\n" https://leadzap.com.my/dashboard       # 200

# admin not indexable?
curl -s https://leadzap.com.my/admin/ | grep robots   # noindex, nofollow

# og/logo image resolves?
curl -s -o /dev/null -w "%{http_code}\n" https://leadzap.com.my/Logo.webp       # 200

# old blog URLs redirect?
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  https://leadzap.com.my/blog/DigitalMarketingInMalaysia/                        # 301 -> new slug
```

## 5. Google Search Console

- Resubmit `https://leadzap.com.my/sitemap.xml`
- Request re-indexing of `/` (title/meta changed)
- The "Soft 404" and "Duplicate without user-selected canonical" reports
  should clear over the following weeks.
