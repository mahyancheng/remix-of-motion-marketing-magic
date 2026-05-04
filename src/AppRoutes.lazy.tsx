import { lazy, Suspense } from "react";
// 🚨 1. 引入 Outlet，它是渲染子路由的关键
import { Routes, Route, Outlet } from "react-router-dom"; 
import { Index } from "./pages/Index";
// 🚨 2. 把刚刚从 App.tsx 踢出来的 ContentProvider 引入到这里
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

// 🚨 3. 创建一个专属的博客布局组件
// 当用户访问博客时，这个组件会挂载 ContentProvider，并通过 <Outlet /> 渲染对应的博客页面
const BlogLayout = () => {
  return (
    <ContentProvider>
      <Outlet />
    </ContentProvider>
  );
};

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* 这些路由不受 ContentProvider 影响，享受 0 延迟极速秒开 */}
      <Route path="/" element={<Index />} />
      <Route path="/sem/" element={<SEM />} />
      <Route path="/social-media-ads/" element={<SocialMediaAds />} />
      <Route path="/custom-software/" element={<CustomerSoftware />} />
      <Route path="/order-management/" element={<OrderManagement />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/corporate-profile/" element={<CorporateProfile />} />
      <Route path="/admin/" element={<AdminDashboard />} />
      <Route path="/business-card/" element={<BusinessCard />} />
      
      {/* 🚨 4. 关键隔离：只有这两个路由被 BlogLayout (和它内部的 ContentProvider) 包裹 */}
      <Route element={<BlogLayout />}>
        <Route path="/blog/" element={<Blog />} />
        <Route path="/blog/:slug/" element={<BlogPost />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);