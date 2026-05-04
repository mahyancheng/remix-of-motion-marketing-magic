import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
// 🚨 1. 导入 HelmetProvider
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("framer-motion").then((m) => m.domMax);
import ScrollToTop from "@/components/ScrollToTop";
import { ContentProvider } from "@/contexts/ContentContext";
import { SiteDitheringBackground } from "@/components/ui/site-dithering-background";
import { AppRoutes } from "./AppRoutes.lazy";

const queryClient = new QueryClient();

// 🚨 2. 在组件外部创建一个空的 context 对象（专治 SSG 崩溃）
const helmetContext = {};

const App = () => (
  // 🚨 3. 用 HelmetProvider 包裹整个应用，并传入 context
  <HelmetProvider context={helmetContext}>
    <LazyMotion features={loadFeatures} strict>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ContentProvider>
            <Toaster />
            <Sonner />
            <SiteDitheringBackground />
            <BrowserRouter>
              <ScrollToTop />
              <div className="relative z-10">
                <AppRoutes />
              </div>
            </BrowserRouter>
          </ContentProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LazyMotion>
  </HelmetProvider>
);

export default App;