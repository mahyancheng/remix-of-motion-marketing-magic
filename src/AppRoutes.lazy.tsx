import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom"; 
import { Index } from "./pages/Index";
import { ContentProvider } from "@/contexts/ContentContext"; 

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

// 提供博客数据的布局组件
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
      {/* 🚀 绝对纯净区：首页等完全不需要 Blog 数据的地方，享受极致秒开，不拉取 Supabase */}
      <Route path="/" element={<Index />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/corporate-profile/" element={<CorporateProfile />} />
      <Route path="/admin/" element={<AdminDashboard />} />
      <Route path="/business-card/" element={<BusinessCard />} />
      
      {/* 🚨 数据保护区：所有页面里用到了 <BlogSection /> 的路由，都必须放在这里面！ */}
      <Route element={<BlogLayout />}>
        {/* 博客本体 */}
        <Route path="/blog/" element={<Blog />} />
        <Route path="/blog/:slug/" element={<BlogPost />} />
        
        {/* 把包含了 BlogSection 的服务页面移到这里面 */}
        <Route path="/sem/" element={<SEM />} />
        <Route path="/social-media-ads/" element={<SocialMediaAds />} />
        <Route path="/custom-software/" element={<CustomerSoftware />} />
        <Route path="/order-management/" element={<OrderManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);