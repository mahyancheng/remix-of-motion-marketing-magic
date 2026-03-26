import { Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import NotFound from "./pages/NotFound";
import SEM from "./pages/SEM";
import SocialMediaAds from "./pages/SocialMediaAds";
import OrderManagement from "./pages/OrderManagement";
import Contact from "./pages/Contact";
import CustomerSoftware from "./pages/CustomerSoftware";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminDashboard from "./pages/AdminDashboard";
import CorporateProfile from "./pages/CorporateProfile";
import GrowthHub from "./pages/GrowthHub";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/sem/" element={<SEM />} />
    <Route path="/social-media-ads/" element={<SocialMediaAds />} />
    <Route path="/custom-software/" element={<CustomerSoftware />} />
    <Route path="/order-management/" element={<OrderManagement />} />
    <Route path="/contact/" element={<Contact />} />
    <Route path="/corporate-profile/" element={<CorporateProfile />} />
    <Route path="/growth-hub/" element={<GrowthHub />} />
    <Route path="/blog/" element={<Blog />} />
    <Route path="/blog/:id/" element={<BlogPost />} />
    <Route path="/admin/" element={<AdminDashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

