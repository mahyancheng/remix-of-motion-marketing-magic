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
  await build({
    root: rootDir,
    build: {
      ssr: true,
      outDir: ssrOutDir,
      rollupOptions: {
        input: path.resolve(rootDir, "src/entry-ssg.tsx"),
      },
    },
  });

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

  const leadzapBrand = "Leadzap Marketing Sdn Bhd";
  const canonicalBase = "https://leadzap.com.my";
  const metaTitleByPath = {
    "/": `Best Digital Marketing Agency | Digital Marketing Service | ${leadzapBrand}`,
    "/corporate-profile/": `Digital Marketing Kuala Lumpur | About Us | ${leadzapBrand}`,
    "/sem/": `Best Seo Expert In Malaysia | ${leadzapBrand}`,
    "/social-media-ads/": `Social Media Marketing Malaysia | ${leadzapBrand}`,
    "/custom-software/": `Custom Software | ERP Software Malaysia | ${leadzapBrand}`,
    "/blog/": `Blog | ${leadzapBrand}`,
    "/contact/": `Top Digital Marketing Agency Malaysia | Contact Us | ${leadzapBrand}`,
  };
  const metaDescByPath = {
    "/": "Leadzap Marketing – Malaysia digital marketing agency providing SEO services, Google Ads management, social media marketing, and website solutions to boost business growth.",
    "/sem/": "Stop losing leads to competitors. Our SEO & Google Ads agency in Malaysia delivers transparent results and high-intent traffic. Get a free SEO audit today.",
    "/social-media-ads/": "Leading social media marketing agency in Malaysia. We build conversion-optimized funnels using Facebook, Instagram, TikTok, and RedNote ads.",
    "/custom-software/": "Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization.",
    "/blog/": "Unlock the secrets to high-quality leads. Expert guides and data-driven tactics for SEO, Google Ads, and custom software in Malaysia.",
    "/contact/": "Get free SEO analysis Malaysia, social media marketing consultation, or custom software quotes. No sales pitch — just honest answers.",
    "/corporate-profile/": "Leadzap Marketing Sdn Bhd corporate profile - Leading digital marketing agency and software development company in Malaysia.",
    "/order-management/": "Custom order management system designed by a software development company in Malaysia. Automate order workflows with business automation software.",
    "/growth-hub/": "Comprehensive growth marketing hub offering scalable digital marketing packages, budget planning, and strategic consultation for Malaysian businesses.",
  };

  // JSON-LD schemas for each static page
  const jsonLdByPath = {
    "/": {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Leadzap Marketing Sdn Bhd",
      "url": "https://leadzap.com.my",
      "logo": "https://leadzap.com.my/Logo.webp",
      "description": metaDescByPath["/"],
      "address": { "@type": "PostalAddress", "streetAddress": "2-22, Jln SS19/6, Ss 19", "addressLocality": "Subang Jaya", "addressRegion": "Selangor", "postalCode": "47500", "addressCountry": "MY" },
      "contactPoint": { "@type": "ContactPoint", "telephone": "+60-111-1335119", "contactType": "sales", "email": "sales@leadzap.com.my" }
    },
    "/sem/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "SEO & Google Ads Services Malaysia",
      "serviceType": ["SEO", "Google Ads", "SEM"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/sem/"]
    },
    "/social-media-ads/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Social Media Marketing & Paid Ads Malaysia",
      "serviceType": ["Social Media Marketing", "Facebook Ads", "Instagram Marketing", "TikTok Advertising"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/social-media-ads/"]
    },
    "/custom-software/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Custom Software Development Malaysia",
      "serviceType": ["Custom Software Development", "ERP Systems", "Business Automation"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "url": "https://leadzap.com.my" },
      "areaServed": { "@type": "Country", "name": "Malaysia" },
      "description": metaDescByPath["/custom-software/"]
    },
    "/contact/": {
      "@context": "https://schema.org", "@type": "ContactPage",
      "name": "Contact Leadzap Marketing",
      "url": "https://leadzap.com.my/contact/",
      "description": metaDescByPath["/contact/"],
      "mainEntity": { "@type": "LocalBusiness", "name": "Leadzap Marketing Sdn Bhd", "telephone": "+60-111-1335119", "email": "sales@leadzap.com.my" }
    },
    "/corporate-profile/": {
      "@context": "https://schema.org", "@type": "Organization",
      "name": "Leadzap Marketing Sdn Bhd",
      "url": "https://leadzap.com.my",
      "description": metaDescByPath["/corporate-profile/"]
    },
    "/order-management/": {
      "@context": "https://schema.org", "@type": "SoftwareApplication",
      "name": "Leadzap Order Management System",
      "applicationCategory": "BusinessApplication",
      "description": metaDescByPath["/order-management/"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "url": "https://leadzap.com.my" }
    },
    "/blog/": {
      "@context": "https://schema.org", "@type": "Blog",
      "name": "Leadzap Marketing Blog",
      "url": "https://leadzap.com.my/blog/",
      "description": metaDescByPath["/blog/"],
      "publisher": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd" }
    },
    "/growth-hub/": {
      "@context": "https://schema.org", "@type": "Service",
      "name": "Leadzap Growth Hub",
      "serviceType": ["Digital Marketing", "Growth Marketing"],
      "provider": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "url": "https://leadzap.com.my" },
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
          "publisher": { "@type": "Organization", "name": "Leadzap Marketing Sdn Bhd", "logo": { "@type": "ImageObject", "url": "https://leadzap.com.my/Logo.webp" } },
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
