import { build } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const ssrOutDir = path.resolve(rootDir, "dist-ssg");

// Static routes that should be pre-rendered
const staticRoutes = [
  "/",
  "/sem/",
  "/social-media-ads/",
  "/custom-software/",
  "/order-management/",
  "/contact/",
  "/zus-coffee-menu/",
  "/zus-coffee-menu/spanish-latte/",
  "/zus-coffee-menu/cham-latte/",
  "/zus-coffee-menu/cafe-mocha/",
  "/zus-coffee-menu/cafe-latte/",
  "/zus-coffee-menu/java-chip-frappe/",
  "/corporate-profile/",
  "/blog/",
  "/admin/",
];

// External Supabase config for fetching blog posts at build time
const EXTERNAL_SUPABASE_URL = "https://cchxoycyanozttgqddxn.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_3XFI8HX3hofFyc0Rwa_Gxw_Y4cpx4Az";

async function fetchBlogPosts() {
  try {
    const url = `${EXTERNAL_SUPABASE_URL}/rest/v1/LeadzapTable?select=id,title,slug,excerpt,image,author,publishedAt&order=publishedAt.desc`;
    const res = await fetch(url, {
      headers: {
        apikey: EXTERNAL_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${EXTERNAL_SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[ssg] Failed to fetch blog posts: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    console.log(`[ssg] Fetched ${data.length} blog posts from external DB`);
    return data;
  } catch (err) {
    console.warn("[ssg] Could not fetch blog posts:", err.message);
    return [];
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function run() {
  // 0. Fetch blog posts from external DB
  const blogPostsData = await fetchBlogPosts();

  console.log("[ssg] Building client bundle with Vite...");
  await build({ root: rootDir });

  console.log("[ssg] Building SSR bundle for entry-ssg...");
  // Run SSR build in a child process so SSR_BUILD env is read by a fresh vite config load
  const { spawnSync } = await import("child_process");
  const ssrScript = `
    import { build } from "vite";
    import path from "path";
    await build({
      root: ${JSON.stringify(rootDir)},
      build: {
        ssr: true,
        outDir: ${JSON.stringify(ssrOutDir)},
        rollupOptions: { input: path.resolve(${JSON.stringify(rootDir)}, "src/entry-ssg.tsx") },
      },
    });
  `;
  const ssrTmp = path.resolve(rootDir, "scripts/_ssr-build.mjs");
  await fs.writeFile(ssrTmp, ssrScript);
  const result = spawnSync(process.execPath, [ssrTmp], {
    stdio: "inherit",
    env: { ...process.env, SSR_BUILD: "1" },
  });
  await fs.unlink(ssrTmp).catch(() => {});
  if (result.status !== 0) throw new Error("[ssg] SSR build failed");

  const ssrEntryPath = path.resolve(ssrOutDir, "entry-ssg.js");
  const { render } = await import(pathToFileURL(ssrEntryPath));

  const templatePath = path.resolve(distDir, "index.html");
  let template = await fs.readFile(templatePath, "utf-8");

  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) {
    throw new Error('[ssg] Could not find <div id="root"></div> in dist/index.html.');
  }

  // Generate blog detail routes from fetched data
  const extractSlug = (raw) => {
    if (!raw) return '';
    const match = raw.match(/\/blog\/([^/]+)\/?$/);
    if (match) return match[1];
    return raw.replace(/^\/+|\/+$/g, '');
  };
  const getSlugForPost = (post) => extractSlug(post.slug) || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || post.id;
  const blogRoutes = blogPostsData.map((post) => `/blog/${getSlugForPost(post)}/`);
  const routes = [...staticRoutes, ...blogRoutes];

  // Breadcrumb config for each route
  const breadcrumbByPath = {
    "/": [{ name: "Home", item: "https://leadzap.com.my/" }],
    "/sem/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "SEO & Google Ads" }],
    "/social-media-ads/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Social Media Ads" }],
    "/custom-software/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Custom Software" }],
    "/order-management/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Order Management" }],
    "/contact/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Contact Us" }],
    "/corporate-profile/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Corporate Profile" }],
    "/blog/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Blog" }],
    "/admin/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Admin" }],
    "/growth-hub/": [{ name: "Home", item: "https://leadzap.com.my/" }, { name: "Growth Hub" }],
  };

  const leadzapBrand = "Leadzap Marketing";
  const canonicalBase = "https://leadzap.com.my";
  const metaTitleByPath = {
    "/": `Digital Marketing Agency Malaysia | SEO & Google Ads | ${leadzapBrand}`,
    "/corporate-profile/": `Corporate Profile | ${leadzapBrand}`,
    "/sem/": `SEO Services Malaysia & Google Ads Agency | Free Audit | ${leadzapBrand}`,
    "/social-media-ads/": `Social Media Marketing Malaysia | Facebook & TikTok Ads | ${leadzapBrand}`,
    "/custom-software/": `Custom Software Development & ERP Malaysia | ${leadzapBrand}`,
    "/blog/": `Digital Marketing Blog Malaysia | SEO Tips & Guides | ${leadzapBrand}`,
    "/contact/": `Free Digital Marketing Consultation Malaysia | Contact Us | ${leadzapBrand}`,
    "/zus-coffee-menu/": `ZUS Coffee Menu & Prices (Malaysia 2026) | ${leadzapBrand}`,
  };
  const metaDescByPath = {
    "/": "Leadzap Marketing – Malaysia digital marketing agency providing SEO services, Google Ads management, social media marketing, and website solutions to boost business growth.",
    "/sem/": "Stop losing leads to competitors. Our SEO & Google Ads agency in Malaysia delivers transparent results and high-intent traffic. Get a free SEO audit today.",
    "/social-media-ads/": "Leading social media marketing agency in Malaysia. We build conversion-optimized funnels using Facebook, Instagram, TikTok, and RedNote ads.",
    "/custom-software/": "Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization.",
    "/blog/": "Unlock the secrets to high-quality leads. Expert guides and data-driven tactics for SEO, Google Ads, and custom software in Malaysia.",
    "/contact/": "Get free SEO analysis Malaysia, social media marketing consultation, or custom software quotes. No sales pitch — just honest answers.",
    "/zus-coffee-menu/": "Full ZUS Coffee Malaysia menu & prices — Spanish Latte, CEO Latte, Americano and more. Built by Leadzap Marketing because zuscoffee.com has no menu page.",
    "/corporate-profile/": "Leadzap Marketing Sdn Bhd corporate profile - Leading digital marketing agency and software development company in Malaysia.",
    "/order-management/": "Custom order management system designed by a software development company in Malaysia. Automate order workflows with business automation software.",
    "/growth-hub/": "Comprehensive growth marketing hub offering scalable digital marketing packages, budget planning, and strategic consultation for Malaysian businesses.",
  };

  // ZUS drink cluster — focused pages off /zus-coffee-menu/ (prerendered meta).
  const zusDrinks = {
    "spanish-latte": { t: "ZUS Spanish Latte — Price, Calories & Details (Malaysia 2026)", d: "ZUS Coffee Spanish Latte — the #1 bestseller. Price RM 11.90 (indicative), taste, calories and how it compares. Full ZUS menu by Leadzap." },
    "cham-latte": { t: "ZUS Cham Latte — Price & Details (Malaysia 2026)", d: "ZUS Cham Latte — the Malaysian coffee-and-tea cham as a latte. Price RM 10.90 (indicative), taste and details. Full ZUS Coffee menu by Leadzap." },
    "cafe-mocha": { t: "ZUS Café Mocha — Price & Calories (Malaysia 2026)", d: "ZUS Café Mocha — chocolate, espresso and milk, hot or iced. Price RM 11.90 (indicative), calories and how it compares. Full ZUS menu by Leadzap." },
    "cafe-latte": { t: "ZUS Caffè Latte (Café Latte) — Price & Calories (Malaysia 2026)", d: "ZUS Caffè Latte — the smooth, not-too-sweet daily classic. Price RM 9.90 (indicative), calories and details. Full ZUS Coffee menu by Leadzap." },
    "java-chip-frappe": { t: "ZUS Java Chip Frappé — Price & Calories (Malaysia 2026)", d: "ZUS Java Chip Frappé — blended chocolate-chip coffee. Price RM 13.90 (indicative), calories and details. Full ZUS Coffee menu by Leadzap." },
  };
  for (const [slug, meta] of Object.entries(zusDrinks)) {
    const p = `/zus-coffee-menu/${slug}/`;
    metaTitleByPath[p] = `${meta.t} | ${leadzapBrand}`;
    metaDescByPath[p] = meta.d;
  }

  // JSON-LD schemas for each static page
  const jsonLdByPath = {
    "/": {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Leadzap Marketing",
      "url": "https://leadzap.com.my",
      "logo": "https://leadzap.com.my/Logo.webp",
      "description": metaDescByPath["/"],
      "address": { "@type": "PostalAddress", "streetAddress": "16-1, Jln SS19/6, SS 19", "addressLocality": "Subang Jaya", "addressRegion": "Selangor", "postalCode": "47500", "addressCountry": "MY" },
      "contactPoint": { "@type": "ContactPoint", "telephone": "+60-111-1335119", "contactType": "sales", "email": "sales@leadzap.com.my" }
    },
    "/sem/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "SEO & Google Ads Services Malaysia",
      "serviceType": ["SEO", "Google Ads", "SEM"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/sem/"]
    },
    "/social-media-ads/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Social Media Marketing & Paid Ads Malaysia",
      "serviceType": ["Social Media Marketing", "Facebook Ads", "Instagram Marketing", "TikTok Advertising"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/social-media-ads/"]
    },
    "/custom-software/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Custom Software Development Malaysia",
      "serviceType": ["Custom Software Development", "ERP Systems", "Business Automation"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/custom-software/"]
    },
    "/contact/": {
      "@context": "https://schema.org", "@type": "ContactPage",
      "name": "Contact Leadzap Marketing",
      "url": "https://leadzap.com.my/contact/",
      "description": metaDescByPath["/contact/"],
      "mainEntity": { "@type": "LocalBusiness", "name": "Leadzap Marketing", "telephone": "+60-111-1335119", "email": "sales@leadzap.com.my" }
    },
    "/corporate-profile/": {
      "@context": "https://schema.org", "@type": "Organization",
      "name": "Leadzap Marketing",
      "url": "https://leadzap.com.my",
      "description": metaDescByPath["/corporate-profile/"]
    },
    "/order-management/": {
      "@context": "https://schema.org", "@type": "SoftwareApplication",
      "name": "Leadzap Order Management System",
      "applicationCategory": "BusinessApplication",
      "description": metaDescByPath["/order-management/"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing", "url": "https://leadzap.com.my" }
    },
    "/blog/": {
      "@context": "https://schema.org", "@type": "Blog",
      "name": "Leadzap Marketing Blog",
      "url": "https://leadzap.com.my/blog/",
      "description": metaDescByPath["/blog/"],
      "publisher": { "@type": "Organization", "name": "Leadzap Marketing" }
    },
    "/growth-hub/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Leadzap Growth Hub",
      "serviceType": ["Digital Marketing", "Growth Marketing"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing", "url": "https://leadzap.com.my" },
      "description": metaDescByPath["/growth-hub/"]
    },
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  console.log("[ssg] Pre-rendering routes...");
  for (const url of routes) {
    const appHtml = await render(url);

    let pageHtml = template;

    const getSlug = (p) => getSlugForPost(p);

    const getMetaTitle = () => {
      if (url.startsWith("/blog/") && url !== "/blog/") {
        const blogSlug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
        const match = blogPostsData.find((p) => getSlug(p) === blogSlug);
        const postTitle = match?.title?.trim();
        return postTitle ? `${postTitle} | ${leadzapBrand}` : `Blog | ${leadzapBrand}`;
      }
      return metaTitleByPath[url] || `Leadzap Marketing - Supercharge Your Digital Marketing`;
    };

    const getMetaDescription = () => {
      if (url.startsWith("/blog/") && url !== "/blog/") {
        const blogSlug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
        const match = blogPostsData.find((p) => getSlug(p) === blogSlug);
        return match?.excerpt || "";
      }
      return metaDescByPath[url] || "";
    };

    const getCanonicalUrl = () => {
      if (url === "/") return `${canonicalBase}/`;
      const cleaned = url.replace(/^\/+/, "").replace(/\/+$/, "");
      return `${canonicalBase}/${cleaned}/`;
    };

    const pageTitle = getMetaTitle();
    const escapedTitle = escapeHtml(pageTitle);
    const escapedCanonical = escapeHtml(getCanonicalUrl());
    const metaDescription = getMetaDescription();

    // Canonical
    if (pageHtml.includes(`rel="canonical"`)) {
      pageHtml = pageHtml.replace(
        /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
        `<link rel="canonical" href="${escapedCanonical}">`,
      );
    } else {
      pageHtml = pageHtml.replace(
        /<\/head>/i,
        `  <link rel="canonical" href="${escapedCanonical}">\n</head>`,
      );
    }

    // Title
    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapedTitle}">`,
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapedTitle}">`,
    );

    // Description
    if (metaDescription) {
      const escapedDesc = escapeHtml(metaDescription);
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapedDesc}">`,
      );
      pageHtml = pageHtml.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${escapedDesc}">`,
      );
    }

    // OG Image for blog posts
    if (url.startsWith("/blog/") && url !== "/blog/") {
      const blogSlug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
      const match = blogPostsData.find((p) => getSlug(p) === blogSlug);
      if (match?.image) {
        const escapedImage = escapeHtml(match.image);
        if (pageHtml.includes('og:image')) {
          pageHtml = pageHtml.replace(
            /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:image" content="${escapedImage}">`,
          );
        } else {
          pageHtml = pageHtml.replace(
            /<\/head>/i,
            `  <meta property="og:image" content="${escapedImage}">\n</head>`,
          );
        }
      }
    }

    // JSON-LD structured data
    let jsonLd = jsonLdByPath[url];
    if (!jsonLd && url.startsWith("/blog/") && url !== "/blog/") {
      const blogSlug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
      const match = blogPostsData.find((p) => getSlug(p) === blogSlug);
      if (match) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": match.title,
          "image": match.image ? [match.image] : [],
          "datePublished": match.publishedAt ? new Date(match.publishedAt).toISOString() : undefined,
          "author": { "@type": "Person", "name": match.author || "Leadzap Expert" },
          "publisher": { "@type": "Organization", "name": "Leadzap Marketing", "logo": { "@type": "ImageObject", "url": "https://leadzap.com.my/Logo.webp" } },
          "description": match.excerpt,
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://leadzap.com.my/blog/${blogSlug}/` }
        };
      }
    }
    if (jsonLd) {
      pageHtml = pageHtml.replace(
        /<\/head>/i,
        `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`,
      );
    }

    // BreadcrumbList JSON-LD
    let breadcrumbItems = breadcrumbByPath[url];
    if (!breadcrumbItems && url.startsWith("/blog/") && url !== "/blog/") {
      const blogSlug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
      const match = blogPostsData.find((p) => getSlug(p) === blogSlug);
      breadcrumbItems = [
        { name: "Home", item: "https://leadzap.com.my/" },
        { name: "Blog", item: "https://leadzap.com.my/blog/" },
        { name: match?.title || blogSlug },
      ];
    }
    if (breadcrumbItems) {
      const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          ...(b.item ? { item: b.item } : {}),
        })),
      };
      pageHtml = pageHtml.replace(
        /<\/head>/i,
        `  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>\n</head>`,
      );
    }

    const html = pageHtml.replace(marker, `<div id="root">${appHtml}</div>`);

    let outDir;
    if (url === "/") {
      outDir = distDir;
    } else {
      const cleanPath = url.replace(/^\/+/, "").replace(/\/+$/, "");
      outDir = path.resolve(distDir, cleanPath);
    }

    await ensureDir(outDir);
    const outFile = path.resolve(outDir, "index.html");
    await fs.writeFile(outFile, html, "utf-8");
    console.log(`[ssg] Generated ${path.relative(distDir, outFile)}`);
  }

  console.log("[ssg] Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
