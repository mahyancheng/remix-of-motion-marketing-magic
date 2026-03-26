
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ContentProvider } from "@/contexts/ContentContext";
import { SiteDitheringBackground } from "@/components/ui/site-dithering-background";
import { AppRoutes } from "./AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ContentProvider>
        <Toaster />
        <Sonner />
        {/* Dithering hero-style background across entire site */}
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
);

export default App;
