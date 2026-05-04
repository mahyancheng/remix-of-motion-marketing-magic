import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("framer-motion").then((m) => m.domMax);
import ScrollToTop from "@/components/ScrollToTop";
import { SiteDitheringBackground } from "@/components/ui/site-dithering-background";
import { AppRoutes } from "./AppRoutes.lazy";
// 🚨 1. 删除了 ContentProvider 的导入

const queryClient = new QueryClient();

const helmetContext = {};

const App = () => (
  <HelmetProvider context={helmetContext}>
    <LazyMotion features={loadFeatures} strict>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* 🚨 2. 移除了 <ContentProvider> 包裹，解除全局阻塞 */}
          <Toaster />
          <Sonner />
          <SiteDitheringBackground />
          <BrowserRouter>
            <ScrollToTop />
            <div className="relative z-10">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LazyMotion>
  </HelmetProvider>
);

export default App;