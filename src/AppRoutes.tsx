import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index").then(m => ({ default: m.Index })));
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

export const AppRoutes = () => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sem/" element={<SEM />} />
      <Route path="/social-media-ads/" element={<SocialMediaAds />} />
      <Route path="/custom-software/" element={<CustomerSoftware />} />
      <Route path="/order-management/" element={<OrderManagement />} />
      <Route path="/contact/" element={<Contact />} />
      <Route path="/corporate-profile/" element={<CorporateProfile />} />
      <Route path="/blog/" element={<Blog />} />
      <Route path="/blog/:slug/" element={<BlogPost />} />
      <Route path="/admin/" element={<AdminDashboard />} />
      <Route path="/business-card/" element={<BusinessCard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);
