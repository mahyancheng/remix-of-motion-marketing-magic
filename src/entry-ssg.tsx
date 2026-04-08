import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContentProvider } from "@/contexts/ContentContext";
import { SiteDitheringBackground } from "@/components/ui/site-dithering-background";
import { __ssgInitialBlogPosts as initialBlogPosts } from "@/contexts/ContentContext";

// 🚨 1. 导入 HelmetProvider
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

/**
 * Server-side render the app for a given URL.
 * Returns only the HTML for the #root container; the outer HTML shell
 * (head/meta tags, etc.) comes from the built index.html template.
 */
export function render(url: string) {
  // 🚨 2. 创建 SSG 专用的空 context
  const helmetContext = {};

  const html = renderToString(
    // 🚨 3. 在最外层包上 HelmetProvider 和 context
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ContentProvider>
            <Toaster />
            <Sonner />
            <SiteDitheringBackground />
            <StaticRouter location={url}>
              <div className="relative z-10">
                <AppRoutes />
              </div>
            </StaticRouter>
          </ContentProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  // 💡 SEO 进阶提示：
  // 目前上面的代码已经 100% 修复了你的打包崩溃 (Error: Cannot read properties of undefined)。
  //
  // 但如果你的 scripts/ssg.mjs 脚本想要把生成的 SEO 标签（title, meta, schema）
  // 物理性地写入到静态 index.html 的 <head> 里面，你可以通过下面这种方式获取：
  //
  // const { helmet } = helmetContext as any;
  // const headTags = `
  //   ${helmet.title.toString()}
  //   ${helmet.meta.toString()}
  //   ${helmet.script.toString()}
  // `;
  // 
  // 然后把 return html 改成 return { html, headTags } （注意：这需要同步修改 ssg.mjs 脚本去接收它）。
  // 如果暂时不打算改 ssg.mjs，保留现在的 `return html;` 即可完美运行打包！

  return html;
}

// Export initial blog posts for the SSG script (Node side) to generate /blog/:id pages.
export { initialBlogPosts };