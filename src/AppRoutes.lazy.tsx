import { lazy, Suspense } from "react";
// 🚨 1. 导入 Outlet
import { Routes, Route, Outlet } from "react-router-dom"; 
import { Index } from "./pages/Index";
// 🚨 2. 导入你的 ContentProvider
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

// 🚀 3. 新增：专门为博客功能准备的布局容器
// 只有当路由匹配到 /blog/* 时，这个组件才会被渲染，进而触发 Supabase 数据拉取
const BlogLayout = () => {
  return (
    <ContentProvider>
      <Outlet /> {/* 这里会渲染匹配到的子路由，比如 Blog 或 BlogPost */}
    </ContentProvider>
  );
};

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* ========================================== */}
      {/* ⚡ 极速加载区：不需要博客数据的页面完全解耦 */}
      {/* ========================================== */}
      <Route path="/" element={<Index />} />
      <Route path="/sem/" element={<SEM />} />
      <Route path="/social-media-ads/" element={<SocialMediaAds />} />
      <Route path="/custom-software/" element={<CustomerSoftware />} />
      <Route path="/order-management/" element={<OrderManagement />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/corporate-profile/" element={<CorporateProfile />} />
      <Route path="/admin/" element={<AdminDashboard />} />
      <Route path="/business-card/" element={<BusinessCard />} />

      {/* ========================================== */}
      {/* 📚 数据拉取区：只有进入这里才会请求 Supabase */}
      {/* ========================================== */}
      <Route element={<BlogLayout />}>
        <Route path="/blog/" element={<Blog />} />
        <Route path="/blog/:slug/" element={<BlogPost />} />
      </Route>

      <Route path="*" element={<NotFound />} /> 
    </Routes>
  </Suspense>
);