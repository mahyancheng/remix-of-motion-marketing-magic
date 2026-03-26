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

const queryClient = new QueryClient();

/**
 * Server-side render the app for a given URL.
 * Returns only the HTML for the #root container; the outer HTML shell
 * (head/meta tags, etc.) comes from the built index.html template.
 */
export function render(url: string) {
  const html = renderToString(
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
    </QueryClientProvider>,
  );

  return html;
}

// Export initial blog posts for the SSG script (Node side) to generate /blog/:id pages.
export { initialBlogPosts };

