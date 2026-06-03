import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Index } from "./pages/Index";
import { ContentProvider } from "@/contexts/ContentContext";
import Auth from "./GrowHubPages/Auth";
import SalesTool from "./GrowHubPages/SalesTool";
import Dashboard from "./GrowHubPages/Dashboard";
import ProposalOutput from "./GrowHubPages/ProposalOutput";
import SignProposal from "./GrowHubPages/SignProposal";
import SignedProposalView from "./GrowHubPages/SignedProposalView";
import Admin from "./GrowHubPages/Index";
import ClientLogin from "./GrowHubPages/ClientLogin";
import ClientDashboard from "./GrowHubPages/ClientDashboard";
import Settings from "./GrowHubPages/Settings";
import Invoices from "./GrowHubPages/Invoices";
import Contracts from "./GrowHubPages/Contracts";

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
const ZusCoffeeMenu = lazy(() => import("./pages/ZusCoffeeMenu"));
const ZusDrink = lazy(() => import("./pages/ZusDrink"));

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
      <Route path="/zus-coffee-menu/" element={<ZusCoffeeMenu />} />
      <Route path="/zus-coffee-menu/:slug/" element={<ZusDrink />} />
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
        <Route path="/admins" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/tool" element={<SalesTool />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/proposal" element={<ProposalOutput />} />
        <Route path="/sign/:token" element={<SignProposal />} />
        <Route path="/signed/:token" element={<SignedProposalView />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/contracts" element={<Contracts />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);