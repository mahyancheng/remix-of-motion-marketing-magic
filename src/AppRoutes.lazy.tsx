import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./pages/Index";
import { ContentProvider } from "@/contexts/ContentContext"; 

// Eagerly load homepage (initial route) to avoid extra round-trip on first paint.
// Lazy-load all other routes to dramatically reduce the initial JS bundle.
const NotFound = lazy(() => import("./pages/NotFound"));
const SEM = lazy(() => import("./pages/SEM"));
const SocialMediaAds = lazy(() => import("./pages/SocialMediaAds"));
const OrderManagement = lazy(() => import("./pages/OrderManagement"));
const Contact = lazy(() => import("./pages/Contact"));
const CustomerSoftware = lazy(() => import("./pages/CustomerSoftware"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CorporateProfile = lazy(() => import("./pages/CorporateProfile"));
const BusinessCard = lazy(() => import("./pages/BusinessCard"));

const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite" />
);

// Blog-only layout: mounts ContentProvider and Supabase fetch only for /blog/*.
const BlogLayout = () => (
  <ContentProvider>
    <Outlet />
  </ContentProvider>
);

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* Routes without blog data — no ContentProvider */}
      <Route path="/" element={<Index />} />
      <Route path="/sem/" element={<SEM />} />
      <Route path="/social-media-ads/" element={<SocialMediaAds />} />
      <Route path="/custom-software/" element={<CustomerSoftware />} />
      <Route path="/order-management/" element={<OrderManagement />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/corporate-profile/" element={<CorporateProfile />} />
      <Route path="/admin/" element={<AdminDashboard />} />
      <Route path="/business-card/" element={<BusinessCard />} />
      {/* Blog routes — ContentProvider + Supabase */}
      <Route element={<BlogLayout />}>
        <Route path="/blog/" element={<Blog />} />
        <Route path="/blog/:slug/" element={<BlogPost />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);