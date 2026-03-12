import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { Package, ShoppingCart, ClipboardList, BarChart2, Clock, Settings, CheckCircle, User, Target, Zap } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";

const OrderManagement = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Integration />
      <Pricing />
      <Footer />
    </div>
  );
};

const Hero = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="relative z-10">
        <AnimatedHero
          badge="Still tracking orders in spreadsheets?"
          titlePrefix="Your order management is"
          rotatingWords={["chaotic", "manual", "broken", "costing you money"]}
          description="Custom business systems designed by a software development company in Malaysia. Automate order workflows with business automation software tailored for cost optimization."
          primaryCTA={{ label: "Request a Demo", href: "/contact" }}
          secondaryCTA={{ label: "View Features", href: "/customer-software-demo" }}
        />
      </div>
    </header>
  );
};

const Features = () => {
  const features = [
    { icon: <ShoppingCart className="h-7 w-7" />, title: "Order Processing", description: "Streamline order capture, validation, and processing across multiple sales channels." },
    { icon: <Package className="h-7 w-7" />, title: "Inventory Management", description: "Real-time inventory tracking across all warehouses and sales channels." },
    { icon: <CheckCircle className="h-7 w-7" />, title: "Fulfillment Automation", description: "Automate picking, packing, and shipping processes with intelligent workflows." },
    { icon: <User className="h-7 w-7" />, title: "Customer Management", description: "Centralized customer data with order history, preferences, and communication tools." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "Analytics & Reporting", description: "Comprehensive reporting on sales, inventory, fulfillment, and customer insights." },
    { icon: <Settings className="h-7 w-7" />, title: "Customizable Workflows", description: "Tailor the system to your specific business processes and requirements." },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Key Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our comprehensive order management system is designed to streamline your entire order fulfillment process.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Integration = () => {
  const integrations = ["Shopify", "WooCommerce", "Magento", "Amazon", "eBay", "QuickBooks", "Xero", "ShipStation", "FedEx", "UPS", "USPS", "DHL", "PayPal", "Stripe", "Square"];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Seamless Integrations</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our system integrates with your favorite e-commerce platforms, payment processors, shipping carriers, and accounting software.</p>
        </motion.div>

        <motion.div className="mt-12 grid grid-cols-3 md:grid-cols-5 gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          {integrations.map((integration, index) => (
            <motion.div key={index}
              className="rounded-2xl border border-border bg-card p-4 flex items-center justify-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} viewport={{ once: true }}>
              <span className="text-center font-medium text-foreground">{integration}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plan = {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for high-volume businesses with complex needs.",
    features: ["Unlimited orders", "Unlimited users", "Dedicated account manager", "Custom reporting", "Custom integrations", "White-label options", "On-premise deployment"],
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Enterprise Solution</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">A comprehensive solution tailored to your business needs.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="rounded-2xl border border-border bg-card p-8 shadow-card card-glow"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-display font-bold mb-2 text-foreground">{plan.name}</h3>
            <div className="text-3xl font-bold mb-2 text-foreground">{plan.price}<span className="text-sm text-muted-foreground font-normal"> /month</span></div>
            <p className="text-muted-foreground mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-2 shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mb-4">
              <span className="text-lg font-display font-bold text-foreground">Ready to automate at <Cover>warp speed</Cover>?</span>
            </div>
            <Button variant="hero" size="lg" className="w-full"><Cover>Contact Sales</Cover></Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OrderManagement;
