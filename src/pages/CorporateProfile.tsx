import { useEffect } from 'react';
import HeroBackground from "@/components/HeroBackground";
import { motion } from 'framer-motion';
import { Search, Megaphone, CodeXml, BarChart2, Globe, Users, CheckCircle, ArrowRight, Camera, PenTool, Monitor, TrendingUp, Target, Zap, Award, Eye, Clock, MousePointer } from 'lucide-react';
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import { Navbar } from './Index';
import Footer from './Footer';
import Logo from "@/image/Logo.png";
import MarketingProcessDiagram from "@/image/Clients.png";
import AnalyticsResults from "@/image/analytics-results.jpg";
import MultiplatformAnimation from "@/image/multiplatform-animation.gif";
import PushPullFramework from "@/image/Push-Pull-MarketingFrame.png";
import DoohRoadshowDemo from "@/image/dooh-roadshow-demo.mp4";
import { Button } from "@/components/ui/button";

const CorporateProfile = () => {
  useEffect(() => {
    document.title = 'Corporate Profile - Leadzap Marketing Sdn Bhd Malaysia';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Leadzap Marketing Sdn Bhd corporate profile - Leading digital marketing agency and software development company in Malaysia offering SEM, social media marketing, and custom software solutions.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <CompanyHeader />
        <CompanyOverview />
        <CoreServices />
        <ComprehensiveServices />
        <MarketingProcess />
        <MarketingFramework />
        <PerformanceResults />
        <WhyChooseUs />
        <OutOfHomePortfolio />
        <ContactInformation />
      </main>
      <Footer />
    </div>
  );
};

const CompanyHeader = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <AnimatedHero
          badge="Top Digital Marketing Agency Malaysia"
          titlePrefix="Leadzap Marketing is"
          rotatingWords={["your growth partner", "results-driven", "data-obsessed", "Malaysia's best"]}
          description="Top Digital Marketing Agency Malaysia | Digital Marketing Kuala Lumpur. We build the entire machine — SEO, ads, social, software — all working together so you never leave money on the table."
          primaryCTA={{ label: "Start Your Growth Journey", href: "/contact" }}
          secondaryCTA={{ label: "View Our Services", href: "/growth-hub" }}
        />
      </div>
    </header>
  );
};

const CompanyOverview = () => {
  return (
    <section className="py-12 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">Digital Marketing Kuala Lumpur Leader</h2>
            <p className="text-md md:text-lg text-muted-foreground mb-6 leading-relaxed">
              Leadzap is the top digital marketing agency Malaysia businesses choose for results. As a leading social media marketing agency Malaysia, we deliver comprehensive SEO services pricing Malaysia and digital marketing Kuala Lumpur solutions.
            </p>
            <p className="text-md md:text-lg text-muted-foreground mb-6 leading-relaxed">
              Our Malaysia SEO consultant team provides free SEO analysis Malaysia, local SEO Malaysia optimization, and Google Ads agency Malaysia services—all under one roof.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card hover:border-accent/50 transition-all duration-300">
            <h3 className="text-2xl font-display font-bold mb-6 text-accent">Company Highlights</h3>
            <div className="space-y-4">
              {["One-stop solution provider with 461K+ sessions generated", "Full-service capabilities: SEO, Social Media, Design, Development", "Proprietary Push-Pull marketing framework", "75% average growth rate for client campaigns", "Malaysia-based with proven international success", "Custom software development and business automation"].map((item, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ title: "Our Mission", text: "To be the one-stop digital marketing solution provider that accelerates business growth through innovative strategies, creative excellence, and measurable results." },
            { title: "Our Vision", text: "To be Malaysia's most trusted turnkey growth partner, leading the digital transformation of businesses through creativity, innovation, and proven methodologies." }].map((item, i) => (
            <motion.div key={i}
              className="group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} viewport={{ once: true }}>
              <h4 className="text-lg font-display font-semibold text-accent mb-3">{item.title}</h4>
              <p className="text-sm md:text-md text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CoreServices = () => {
  const services = [
    { icon: <Search className="h-8 w-8" />, title: "SEO Services Malaysia", description: "Free SEO analysis Malaysia, SEO packages Malaysia, and local SEO Malaysia by Malaysia SEO expert consultants.", features: ["SEO Kuala Lumpur", "SEO Penang", "Google SEO Malaysia", "SEO Services Pricing Malaysia"] },
    { icon: <Megaphone className="h-8 w-8" />, title: "Social Media Marketing Malaysia", description: "Leading social media marketing agency Malaysia for Facebook marketing Malaysia and social media agency marketing.", features: ["Facebook Marketing Malaysia", "Social Media Packages", "Instagram Marketing", "TikTok Ads"] },
    { icon: <BarChart2 className="h-8 w-8" />, title: "Google Ads Agency Malaysia", description: "Expert Google Ads Malaysia management with proven ROI and transparent pricing.", features: ["Google Ads Malaysia", "Google Product Listing Ads", "Google Shopping Ads", "PPC Management"] },
    { icon: <CodeXml className="h-8 w-8" />, title: "Custom Software Development", description: "Software development company Malaysia delivering business automation and custom solutions.", features: ["CRM Systems", "ERP Solutions", "Business Automation", "Custom Applications"] },
  ];

  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Core Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Core Services</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive digital marketing and software development solutions designed to accelerate your business growth.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {service.icon}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-accent">{service.title}</h3>
              <p className="text-md md:text-lg text-muted-foreground mb-4">{service.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComprehensiveServices = () => {
  const additionalServices = [
    { icon: <PenTool className="h-6 w-6" />, title: "Graphic Design", description: "Creative visual solutions for branding and marketing materials" },
    { icon: <Monitor className="h-6 w-6" />, title: "Web Design & Development", description: "Responsive, conversion-optimized websites and applications" },
    { icon: <Camera className="h-6 w-6" />, title: "Photo & Video Production", description: "Professional content creation for marketing campaigns" },
    { icon: <Target className="h-6 w-6" />, title: "Content Production & Management", description: "Strategic content creation and distribution across platforms" },
  ];

  return (
    <section className="py-12 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Complete Digital Solutions</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto">Beyond our core services, we offer a comprehensive suite of creative and technical solutions to support your entire digital ecosystem.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {additionalServices.map((service, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {service.icon}
              </div>
              <h3 className="text-lg font-display font-bold mb-3 text-accent">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <div className="rounded-2xl bg-card p-8 border border-accent/30 shadow-card">
            <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-center text-accent">Multi-Device & Creative Excellence</h3>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <p className="text-md md:text-lg text-muted-foreground mb-4">Our comprehensive approach ensures seamless user experiences across all devices while delivering creative excellence through:</p>
                <ul className="space-y-2 text-muted-foreground">
                  {["Multi-device optimization for mobile, tablet, and desktop", "Professional graphic design and visual branding", "High-quality photo and video production", "Strategic content creation and management"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <img src={MultiplatformAnimation} alt="Multi-platform digital marketing animation showcasing responsive design across devices"
                  className="max-w-full h-auto rounded-lg shadow-lg bg-foreground/10 p-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MarketingProcess = () => {
  const processSteps = [
    { num: 1, title: "Multi-Channel Approach", desc: "Integrate SEO, Paid Ads, and Social Media for comprehensive market coverage." },
    { num: 2, title: "Data Collection & Analysis", desc: "Gather comprehensive data from all channels to optimize performance and identify opportunities." },
    { num: 3, title: "Traffic & Lead Generation", desc: "Convert optimized campaigns into qualified traffic and high-quality leads through CRM integration." },
    { num: 4, title: "Continuous Optimization", desc: "Maintain feedback loop to client, ensuring ongoing improvement and measurable results." },
  ];

  return (
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Strategic Marketing Process</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto">Our systematic approach ensures every campaign is data-driven, results-focused, and continuously optimized for maximum impact.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <img src={MarketingProcessDiagram} alt="Leadzap Marketing Sdn Bhd Process Flow Diagram" className="w-full h-auto rounded-lg border border-accent/20" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="space-y-3">
              {processSteps.map((step) => (
                <div key={step.num} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-accent/50 transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 accent-gradient text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold mr-4">{step.num}</div>
                    <h3 className="text-xl font-display font-bold text-accent">{step.title}</h3>
                  </div>
                  <p className="text-sm md:text-md text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MarketingFramework = () => {
  return (
    <section className="py-12 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Proprietary Push-Pull Framework</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto">Our innovative marketing framework creates a connected ecosystem where push data feeds into pull marketing for retargeting, while pull data improves push campaigns—maximizing ROI across all channels.</p>
        </motion.div>

        <motion.div className="flex justify-center mb-8 md:mb-12" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <img src={PushPullFramework} alt="Push-Pull Marketing Framework" className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl h-auto rounded-lg bg-card p-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 md:mt-12">
          {[
            { icon: <Megaphone className="h-8 w-8" />, title: "PUSH Strategy", desc: "Active brand promotion through strategic paid advertising campaigns that feed data into pull marketing.", items: ["Facebook, Instagram & TikTok advertising", "Influencer marketing campaigns", "Retargeting with pull data insights"] },
            { icon: <Search className="h-8 w-8" />, title: "PULL Strategy", desc: "Natural audience attraction through search engines and organic discovery that enhances push campaigns.", items: ["SEO audit Malaysia & GEO for AI search", "Content marketing & authority building", "Data feeds into push advertising"] },
          ].map((strategy, i) => (
            <motion.div key={i}
              className="group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4 text-accent">{strategy.icon}</div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-accent">{strategy.title}</h3>
              </div>
              <p className="text-sm md:text-lg text-muted-foreground mb-4 text-center">{strategy.desc}</p>
              <ul className="space-y-3">
                {strategy.items.map((item, j) => (
                  <li key={j} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 mr-3 shrink-0" />
                    <span className="text-sm md:text-md text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PerformanceResults = () => {
  const metrics = [
    { icon: <Eye className="h-8 w-8" />, number: "461K", label: "Total Sessions", growth: "+75%" },
    { icon: <Users className="h-8 w-8" />, number: "333K", label: "Total Users", growth: "+63%" },
    { icon: <TrendingUp className="h-8 w-8" />, number: "1.07M", label: "Page Views", growth: "+89%" },
    { icon: <MousePointer className="h-8 w-8" />, number: "2.96M", label: "Events Tracked", growth: "+73%" },
    { icon: <Clock className="h-8 w-8" />, number: "373d 5h", label: "User Engagement", growth: "+60%" },
    { icon: <Target className="h-8 w-8" />, number: "367K", label: "Organic Sessions", growth: "Leading Source" },
  ];

  return (
    <section className="py-6 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Proven Performance Results</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto">Real results from our digital marketing campaigns - showcasing the power of our integrated approach and data-driven strategies.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <img src={AnalyticsResults} alt="Google Analytics Results showing 461K sessions with 75% growth" className="w-full h-auto rounded-lg border border-accent/20" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="rounded-2xl border border-accent/30 bg-card p-8 shadow-card">
              <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-accent">Single Client Case Study</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-6 italic">*Results shown are from one individual client campaign, demonstrating the effectiveness of our integrated approach.</p>
              <div className="space-y-4">
                {[{ label: "Growth Achievement", value: "+75%" }, { label: "Organic Traffic Share", value: "79.6%" }, { label: "Campaign Duration", value: "6+ Years" }, { label: "Total Engagement", value: "373+ Days" }].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm md:text-md text-muted-foreground">{item.label}</span>
                    <span className="text-accent font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-accent"><strong>Client Industry:</strong> Legal Services - Red Kite Solicitors</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-6">
          {metrics.map((metric, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="text-accent mb-3 flex justify-center">{metric.icon}</div>
              <div className="text-2xl font-bold text-foreground mb-1">{metric.number}</div>
              <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
              <div className="text-xs text-green-400 font-medium">{metric.growth}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    { title: "Total Solution Provider", description: "Everything under one roof—from strategy to execution, marketing to software development." },
    { title: "Data-Driven Approach", description: "All strategies backed by rigorous testing, transparent measurement, and continuous optimization." },
    { title: "Malaysia Expertise", description: "Deep understanding of Malaysian market dynamics with local SEO and cultural insights." },
    { title: "Custom Technology", description: "Proprietary software solutions tailored to your specific business workflows and requirements." },
    { title: "Proven Framework", description: "Our Push-Pull methodology creates synergies between paid and organic marketing channels." },
    { title: "Scalable Solutions", description: "From startups to enterprises—solutions that grow with your business needs." },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center md:mb-12 mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Why Choose Leadzap Marketing Sdn Bhd</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">We believe breakthroughs come from innovative ideas that are tested rigorously, scaled responsibly, and measured transparently.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {reasons.map((reason, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-accent">{reason.title}</h3>
              <p className="text-sm md:text-md text-muted-foreground">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OutOfHomePortfolio = () => {
  const portfolioItems = [
    { title: "OOH (Out-of-Home) Advertising", description: "Strategic outdoor advertising campaigns that capture attention and drive brand awareness across Malaysia's key locations.", features: ["Billboard Campaigns", "Transit Advertising", "Street Furniture", "Digital Displays"] },
    { title: "DOOH (Digital Out-of-Home)", description: "Dynamic digital advertising solutions that deliver targeted, real-time content to engage audiences in high-traffic areas.", features: ["LED Screens", "Interactive Displays", "Real-time Content", "Data-Driven Targeting"] },
    { title: "Road Shows & Booth Exhibitions", description: "Complete event marketing solutions from concept to execution, creating memorable brand experiences that drive engagement.", features: ["Event Planning", "Booth Design", "Interactive Experiences", "Lead Generation"] },
  ];

  return (
    <section className="py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-foreground">Out-of-Home & Event Marketing</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive offline marketing solutions that create powerful brand presence and memorable customer experiences.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-3 md:gap-8 md:mb-6 mb-16">
          {portfolioItems.map((item, index) => (
            <motion.div key={index}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-accent">{item.title}</h3>
              <p className="text-sm md:text-md text-muted-foreground mb-4">{item.description}</p>
              <ul className="space-y-2">
                {item.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactInformation = () => {
  return (
    <section className="py-10 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Ready to accelerate your business growth? Let's discuss how our integrated marketing and technology solutions can help you achieve your goals.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-2 md:gap-8">
          {[
            { icon: <Globe className="h-12 w-12" />, title: "Location", main: "Malaysia", sub: "Serving Global Markets" },
            { icon: <Users className="h-12 w-12" />, title: "Email", main: "info@leadzap.com", sub: "Business Inquiries" },
            { icon: <CheckCircle className="h-12 w-12" />, title: "Free Consultation", main: "Available Now", sub: "Strategy & Planning" },
          ].map((item, i) => (
            <motion.div key={i}
              className="group rounded-2xl border border-border bg-card p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-accent mx-auto mb-4">{item.icon}</div>
              <h3 className="text-md md:text-xl font-display font-bold mb-2 text-accent">{item.title}</h3>
              <p className="text-foreground">{item.main}</p>
              <p className="text-sm text-muted-foreground">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-12 mb-5" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-6 text-foreground">
            Ready to <Cover>accelerate growth</Cover>?
          </h3>
          <a href="/contact">
            <Cover variant="button">
              <Button variant="hero" size="xl">
                Start Your Growth Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Cover>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CorporateProfile;
