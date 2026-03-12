import GrowthHubNavbar from "@/components/growth-hub/Navbar";
import Hero from "@/components/growth-hub/Hero";
import Services from "@/components/growth-hub/Services";
import DeliveryModel from "@/components/growth-hub/DeliveryModel";
import Packages from "@/components/growth-hub/Packages";
import BudgetCalculator from "@/components/growth-hub/BudgetCalculator";
import FAQ from "@/components/growth-hub/FAQ";
import CTA from "@/components/growth-hub/CTA";
import GrowthHubFooter from "@/components/growth-hub/Footer";

const GrowthHub = () => {
  return (
    <div className="min-h-screen">
      <GrowthHubNavbar />
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