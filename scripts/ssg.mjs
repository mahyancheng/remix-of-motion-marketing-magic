import { build } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is one level up from scripts/
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
  "/growth-hub/",
  "/blog/",
  "/admin/",
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function run() {
  console.log("[ssg] Building client bundle with Vite...");
  // 1. Normal client build -> outputs to dist/
  await build({
    root: rootDir,
  });

  console.log("[ssg] Building SSR bundle for entry-ssg...");
  // 2. SSR build for our React renderer
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

  // 3. Import the SSR bundle
  const ssrEntryPath = path.resolve(ssrOutDir, "entry-ssg.js");
  const { render, initialBlogPosts } = await import(pathToFileURL(ssrEntryPath));

  // 4. Read the built client HTML template
  const templatePath = path.resolve(distDir, "index.html");
  let template = await fs.readFile(templatePath, "utf-8");

  // We expect a placeholder root like <div id="root"></div>
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) {
    throw new Error(
      "[ssg] Could not find <div id=\"root\"></div> in dist/index.html. Make sure index.html has that container."
    );
  }

  const blogRoutes = Array.isArray(initialBlogPosts)
    ? initialBlogPosts.map((post) => `/blog/${post.id}/`)
    : [];

  const routes = [...staticRoutes, ...blogRoutes];

  const leadzapBrand = "Leadzap Marketing Sdn Bhd";
  const canonicalBase = "https://leadzap.com.my";
  const metaTitleByPath = {
    "/": `Best Digital Marketing Agency |Digital Marketing Service | ${leadzapBrand}`,
    "/corporate-profile/": `Digital Marketing Kuala Lumpur | About Us | ${leadzapBrand}`,
    "/sem/": `Best Seo Expert In Malaysia | ${leadzapBrand}`,
    "/social-media-ads/": `Social Media Marketing Malaysia | ${leadzapBrand}`,
    "/custom-software/": `Custom Software | ERP Software Malaysia | ${leadzapBrand}`,
    "/growth-hub/": `Digital Marketing Specialist | Service | ${leadzapBrand}`,
    "/blog/": `Blog | ${leadzapBrand}`,
    "/contact/": `Top Digital Marketing Agency Malaysia | Contact Us | ${leadzapBrand}`,
  };
  const homepageDescription =
    "Leadzap Marketing – Malaysia digital marketing agency providing SEO services, Google Ads management, social media marketing, and website solutions to boost business growth.";

  console.log("[ssg] Pre-rendering routes...");
  for (const url of routes) {
    const appHtml = await render(url);

    // Clone template for this route, then patch head meta title.
    let pageHtml = template;

    const escapeHtml = (value) =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const getMetaTitle = () => {
      if (url.startsWith("/blog/") && url !== "/blog/") {
        const blogId = url.replace(/^\/blog\//, "").replace(/\/$/, "");
        const match = Array.isArray(initialBlogPosts)
          ? initialBlogPosts.find((p) => p.id === blogId)
          : undefined;
        const postTitle = match?.title?.trim();
        return postTitle ? `${postTitle} | ${leadzapBrand}` : `Blog | ${leadzapBrand}`;
      }
      return metaTitleByPath[url] || `Leadzap Marketing - Supercharge Your Digital Marketing`;
    };

    const getCanonicalUrl = () => {
      if (url === "/") return `${canonicalBase}/`;
      // url example: "/sem" or "/blog/local-0"
      const cleaned = url.replace(/^\/+/, "").replace(/\/+$/, "");
      return `${canonicalBase}/${cleaned}/`;
    };

    const pageTitle = getMetaTitle();
    const escapedTitle = escapeHtml(pageTitle);
    const escapedCanonical = escapeHtml(getCanonicalUrl());
    const escapedHomepageDescription = escapeHtml(homepageDescription);

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

    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapedTitle}">`,
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapedTitle}">`,
    );
    if (url === "/") {
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapedHomepageDescription}">`,
      );
      pageHtml = pageHtml.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${escapedHomepageDescription}">`,
      );
      pageHtml = pageHtml.replace(
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:description" content="${escapedHomepageDescription}">`,
      );
    }

    const html = pageHtml.replace(marker, `<div id="root">${appHtml}</div>`);

    // Output folder logic:
    // - "/" => "dist/index.html"
    // - "/sem" => "dist/sem/index.html"
    // - "/blog/post-1" => "dist/blog/post-1/index.html"
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

function pathToFileUrl(p) {
  const resolved = path.resolve(p);
  const url = new URL(`file://${resolved.startsWith("/") ? "" : "/"}${resolved}`);
  return url;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

