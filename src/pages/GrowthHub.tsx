import GrowthHubNavbar from "@/components/growth-hub/Navbar";
import Hero from "@/components/growth-hub/Hero";
import Services from "@/components/growth-hub/Services";
import DeliveryModel from "@/components/growth-hub/DeliveryModel";
import Packages from "@/components/growth-hub/Packages";
import BudgetCalculator from "@/components/growth-hub/BudgetCalculator";
import FAQ from "@/components/growth-hub/FAQ";
import CTA from "@/components/growth-hub/CTA";
import GrowthHubFooter from "@/components/growth-hub/Footer";
import { Helmet } from "react-helmet-async";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const growthHubSchemaData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Leadzap Growth Hub",
  "serviceType": ["Digital Marketing", "Growth Marketing", "Marketing Consultation"],
  "provider": {
    "@type": "Organization",
    "name": "Leadzap Marketing Sdn Bhd",
    "url": "https://leadzap.com.my",
    "logo": "https://leadzap.com.my/assets/Logo-BtIJ7fab.webp"
  },
  "areaServed": { "@type": "Country", "name": "Malaysia" },
  "description": "Comprehensive growth marketing hub offering scalable digital marketing packages, budget planning, and strategic consultation for Malaysian businesses."
};

const GrowthHub = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Growth Hub | Digital Marketing Packages Malaysia | Leadzap</title>
        <meta name="description" content="Comprehensive growth marketing hub offering scalable digital marketing packages, budget planning, and strategic consultation for Malaysian businesses." />
        <link rel="canonical" href="https://leadzap.com.my/growth-hub/" />
        <meta property="og:title" content="Growth Hub | Leadzap Marketing" />
        <meta property="og:description" content="Scalable digital marketing packages and strategic consultation for Malaysian businesses." />
        <script type="application/ld+json">
          {JSON.stringify(growthHubSchemaData)}
        </script>
      </Helmet>
      <GrowthHubNavbar />
      <PageBreadcrumb items={[{ label: "Growth Hub" }]} />
      <Hero />
      <Services />
      <DeliveryModel />
      <Packages />
      <BudgetCalculator />
      <FAQ />
      <CTA />
      <GrowthHubFooter />
    </div>
  );
};

export default GrowthHub;