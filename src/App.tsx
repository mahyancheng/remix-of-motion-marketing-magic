import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("framer-motion").then((m) => m.domMax);
import ScrollToTop from "@/components/ScrollToTop";
// 🚨 移除了这里的 ContentProvider 导入
import { SiteDitheringBackground } from "@/components/ui/site-dithering-background";
import { AppRoutes } from "./AppRoutes.lazy";

const queryClient = new QueryClient();
const helmetContext = {};

const App = () => (
  <HelmetProvider context={helmetContext}>
    <LazyMotion features={loadFeatures} strict>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* 🚨 这里不再包裹 ContentProvider，彻底解放首屏加载 */}
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