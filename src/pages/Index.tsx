import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import DynamicActionBar, { type ActionItem } from "@/components/ui/dynamic-action";
import { Search, Megaphone, CodeXml, ArrowUpRight, Phone, Mail, CheckCircle, X, Menu, Zap, Target, TrendingUp } from "lucide-react";
import DemoOne from "@/components/ui/testimonials-3d";
import Logo from "@/image/Logo.png";
import Push_Pull from "@/image/Push-Pull-MarketingFrame.png";
import Push_ADS from "@/image/Push-ADS.png";
import Org_Traffic from "@/image/Org-Traffic.png";
import Workconnect from "@/image/workconnect.png";
import Tectone from "@/image/tectone.jpg";
import Puregen from "@/image/puregen.png";
import { Button } from "@/components/ui/button";

export const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Framework />
      <Vision />
      <TotalDigitalSolutions />
      <WebsiteDesign />
      <Services />
      <ContactForm />
      <Footer />
    </div>
  );
};

const SideMenu = ({ isMenuOpen, toggleMenu, actions }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (to) => {
    if (to === "/" && currentPath === "/") return true;
    return currentPath === to;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-background/50 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={toggleMenu}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 pt-6 flex justify-between items-center border-b border-border">
          <span className="text-primary-foreground font-bold text-lg">Navigation</span>
          <button onClick={toggleMenu} className="text-primary-foreground hover:text-accent p-1">
            <X className="size-6" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2 text-primary-foreground">
          <Link
            to="/"
            onClick={toggleMenu}
            className={`py-2 border-b border-border transition-colors ${isActive("/") ? "text-accent font-bold" : "hover:text-accent"}`}
          >
            Home
          </Link>

          <div className="pt-2">
            <h4 className="font-bold text-muted-foreground mb-2">Services</h4>
            <div className="flex flex-col space-y-2 pl-3">
              {actions.map((action) => (
                <Link
                  key={action.id}
                  to={action.to}
                  onClick={toggleMenu}
                  className={`py-1 text-sm transition-colors ${isActive(action.to) ? "text-accent font-medium" : "hover:text-accent text-muted-foreground"}`}
                >
                  <span className="flex items-center gap-2">
                    {action.icon && <action.icon className="size-4" />}
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link to="/blog" onClick={toggleMenu} className={`py-2 border-t border-b border-border transition-colors ${isActive("/blog") ? "text-accent font-bold" : "hover:text-accent"}`}>
            Blog
          </Link>
          <Link to="/corporate-profile" onClick={toggleMenu} className={`py-2 border-b border-border transition-colors ${isActive("/corporate-profile") ? "text-accent font-bold" : "hover:text-accent"}`}>
            Company Profile
          </Link>
          <Link to="/contact" onClick={toggleMenu} className={`py-2 border-b border-border transition-colors ${isActive("/contact") ? "text-accent font-bold" : "hover:text-accent"}`}>
            Contact Us
          </Link>

          <div className="mt-auto pt-4 border-t border-border">
            <Link to="/contact" onClick={toggleMenu}>
              <Button variant="hero" size="lg" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const actions: ActionItem[] = [
    {
      id: "sem",
      to: "/sem",
      label: "SEM",
      icon: Search,
      content: (
        <div className="flex flex-col items-center">
          <Link to="/sem" className="w-full">
            <div className="mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary">
              <div className="flex items-center gap-1">
                <Search className="size-6 text-accent" />
                <span className="font-bold text-foreground">Search Engine Marketing</span>
              </div>
              <div className="mt-1 text-sm text-accent">
                Data-driven SEM that boosts visibility and leads through SEO, GEO, and Google Ads across traditional and AI search platforms.
              </div>
            </div>
          </Link>
        </div>
      ),
      dimensions: { width: 500, height: 100 },
    },
    {
      id: "ads",
      to: "/social-media-ads",
      label: "Social Media Marketing",
      icon: Megaphone,
      content: (
        <div className="flex flex-col items-center">
          <Link to="/social-media-ads" className="w-full">
            <div className="mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary">
              <div className="flex items-center gap-1">
                <Megaphone className="size-6 text-accent" />
                <span className="font-bold text-foreground">Social Media Paid Ads</span>
              </div>
              <div className="mt-1 text-sm text-accent">
                Data-driven social media ads that turn audiences into customers — using Facebook, Instagram, TikTok, and more to drive leads, sales, and in-store traffic.
              </div>
            </div>
          </Link>
        </div>
      ),
      dimensions: { width: 500, height: 100 },
    },
    {
      id: "software",
      to: "/customer-software-demo",
      label: "Custom Software",
      icon: CodeXml,
      content: (
        <div className="flex flex-col items-center">
          <Link to="/customer-software-demo" className="w-full">
            <div className="mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary">
              <div className="flex items-center gap-1">
                <CodeXml className="size-6 text-accent" />
                <span className="font-bold text-foreground">Custom Software Solution</span>
              </div>
              <div className="mt-1 text-sm text-accent">
                Custom software development for Malaysian businesses — we design, build, and maintain tailored systems (CRM, ERP, automation, IoT, healthcare) to streamline operations and drive growth.
              </div>
            </div>
          </Link>
        </div>
      ),
      dimensions: { width: 500, height: 100 },
    },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-primary/95 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="relative container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={Logo} alt="Leadzap Marketing" className="h-8 md:h-10" />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Home
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground/70 hover:text-primary-foreground">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-primary z-50">
                  <div className="p-4">
                    <DynamicActionBar actions={actions} />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/blog" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Blog
          </Link>
          <Link to="/corporate-profile" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Company Profile
          </Link>
          <Link to="/contact" className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex ml-auto">
          <Link to="/contact" onClick={toggleMenu}>
            <Button variant="hero" size="default">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="text-primary-foreground hover:text-accent p-2 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      <SideMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} actions={actions} />
    </nav>
  );
};

// Hero component
const Hero = () => {
  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 opacity-0">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-primary-foreground/80">
            Top Digital Marketing Agency Malaysia
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up stagger-1 mb-6 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground opacity-0 md:text-5xl lg:text-6xl xl:text-7xl">
          Top <span className="text-gradient">Digital Marketing Agency</span> Malaysia
        </h1>

        {/* Subtitle */}
        <h2 className="animate-fade-up stagger-1 mb-2 font-display text-xl md:text-3xl font-bold text-primary-foreground opacity-0">
          Digital Marketing Kuala Lumpur & Beyond
        </h2>

        <p className="animate-fade-up stagger-2 mb-10 max-w-2xl text-lg text-primary-foreground/70 opacity-0 md:text-xl">
          Leadzap is the top digital marketing agency Malaysia businesses trust. From SEO services pricing Malaysia to social media marketing Malaysia, we deliver measurable ROI.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up stagger-3 mb-16 flex flex-col gap-4 opacity-0 sm:flex-row">
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Get a Free Consultation
            </Button>
          </Link>
          <Link to="/customer-software-demo">
            <Button variant="hero-outline" size="xl">
              View Our Work
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-up stagger-4 grid grid-cols-1 gap-8 opacity-0 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <Target className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">461K+</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Sessions Generated</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">75%</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Average Growth Rate</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <Zap className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">Push-Pull</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Marketing Framework</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary-foreground/30 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
};

// Framework component
const Framework = () => {
  return (
    <section id="framework" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Methodology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Marketing Framework</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Our proprietary Push-Pull marketing framework creates a connected ecosystem where push data feeds into pull marketing (e.g., retargeting), while pull data is used to improve push campaigns.
          </p>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img src={Push_Pull} alt="Push-Pull Marketing Framework" className="max-w-2xl w-[55%] mx-auto" />
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:gap-6">
          <motion.div
            className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-display font-bold mb-3 md:mb-4 text-accent">PUSH Strategy</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Our push marketing strategy actively promotes your brand through strategic paid advertising campaigns. Data from push campaigns feeds into pull marketing for retargeting and remarketing.
            </p>
            <ul className="mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>Facebook, Instagram & TikTok advertising</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>Influencer marketing campaigns</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>Retargeting with pull data insights</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-display font-bold mb-3 md:mb-4 text-accent">PULL Strategy</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Our pull strategy naturally attracts users through search engines and organic discovery. Pull data is used to improve push campaigns and create highly targeted audiences.
            </p>
            <ul className="mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>SEO audit Malaysia & local optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>Content marketing & authority building</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">→</span>
                <span>Data feeds into push advertising</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Vision component
const Vision = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">Our Vision</h2>
          <p className="text-sm md:text-xl text-muted-foreground leading-relaxed">
            To be Malaysia's most trusted turnkey growth partner, compounding client value by fusing creativity and innovation. We believe breakthroughs come from innovative ideas that are tested rigorously, scaled responsibly, and measured transparently.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Total Digital Solutions component
const TotalDigitalSolutions = () => {
  const solutions = [
    { title: "SEO Services Malaysia", description: "Free SEO analysis Malaysia, SEO Kuala Lumpur & SEO Penang optimization by Malaysia SEO experts" },
    { title: "Facebook Marketing Malaysia", description: "Social media marketing agency Malaysia delivering ROI-focused Facebook marketing campaigns" },
    { title: "Google Ads Agency Malaysia", description: "Google Ads Malaysia campaigns with precision targeting and cost optimization" },
    { title: "Social Media Marketing Malaysia", description: "Social media agency marketing across Facebook, Instagram, TikTok & LinkedIn" },
  ];

  return (
    <section className="py-10 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Complete Solutions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Total Digital Marketing Solutions</h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide everything needed for a complete digital marketing ecosystem. All services included under one roof for maximum synergy and results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-accent">{solution.title}</h3>
              <p className="text-muted-foreground text-sm md:text-md">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Website Design component
const WebsiteDesign = () => {
  const websites = [
    { name: "WorkConnect", description: "Professional networking and career development platform", url: "https://workconnect.com.my", image: Workconnect },
    { name: "Tectone Steel", description: "Industrial steel solutions and construction services", url: "https://tectonesteel.com", image: Tectone },
    { name: "Puregen", description: "Advanced water purification and treatment systems", url: "https://www.puregen.com.my", image: Puregen },
  ];

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-3">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Website Design & Development</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Featured client websites showcasing our custom software development and web design capabilities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websites.map((website, index) => (
            <div key={index} className="group rounded-2xl p-2 -m-2">
              <motion.a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-transparent transition-all duration-300 bg-card shadow-card hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 group-hover:border-accent/50 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img src={website.image} alt={website.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-display font-bold mb-2 text-accent group-hover:text-accent/80 transition-colors">
                    {website.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{website.description}</p>
                  <span className="inline-flex items-center text-sm text-accent group-hover:text-accent/80 transition-colors">
                    Visit Website
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </motion.a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services component - Bento Grid Design
const Services = () => {
  const serviceItems = [
    { emoji: "🎯", title: "Search Engine Marketing (SEM)", description: "Get a free SEO analysis — strategies that not only rank, but also grow revenue. Includes SEO & GEO optimization.", cta: "FREE SEO AUDIT", link: "/sem" },
    { emoji: "📱", title: "Social Media Marketing", description: "TikTok, Facebook, Instagram management & ads with electrifying content.", cta: "Get Consultation", link: "/social-media-ads" },
    { emoji: "💻", title: "Custom Software", description: "Lightning-fast ERP & IoT solutions.", cta: "Get Consultation", link: "/customer-software-demo" },
    { emoji: "⚡", title: "Full Service Digital Marketing", description: "From social to web — our Push & Pull Power System to supercharge growth.", cta: "Get Free Consultation", link: "/contact" },
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Services</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital marketing solutions to supercharge your business growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {serviceItems.map((item, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full min-h-[240px] md:min-h-[280px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <span className="text-accent font-bold text-2xl md:text-3xl">{item.emoji}</span>
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-accent">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{item.description}</p>
              </div>
              <Link to={item.link} className="mt-auto">
                <Button variant="hero" size="default" className="w-full text-sm md:text-base">
                  {item.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact component
const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (error) {
      console.error("Error sending to Pabbly:", error);
    }
    setTimeout(() => setSubmitted(false), 3000);
  };

  const serviceOptions = [
    { value: "", label: "Select a Service" },
    { value: "seo", label: "SEO" },
    { value: "social", label: "Social Media Ads" },
    { value: "order", label: "Order Management System" },
    { value: "other", label: "Other" },
  ];

  const [isServicePopoutOpen, setIsServicePopoutOpen] = useState(false);

  return (
    <section className="py-6 lg:py-24 bg-secondary" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Get in Touch</h2>
          <p className="text-xs md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready to take your digital marketing to the next level? Contact us for a free consultation.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {submitted ? (
            <motion.div
              className="bg-green-800/30 border border-green-600 rounded-lg p-5 md:p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">Message Sent Successfully!</h3>
              <p className="text-sm md:text-base text-muted-foreground">Thank you for reaching out. Our team will get back to you shortly.</p>
            </motion.div>
          ) : (
            <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                  <input type="text" id="name" required value={formData.name} onChange={handleChange}
                    className="w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent"
                    placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Email</label>
                  <input type="email" id="email" required value={formData.email} onChange={handleChange}
                    className="w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent"
                    placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                <input type="text" id="company" value={formData.company} onChange={handleChange}
                  className="w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent"
                  placeholder="Your Company" />
              </div>

              <div>
                <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Service Interested In</label>
                <div className="md:hidden">
                  <button type="button" onClick={() => setIsServicePopoutOpen(true)}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between focus:ring-accent focus:border-accent">
                    <span>{serviceOptions.find((opt) => opt.value === formData.service)?.label || "Select a Service"}</span>
                    <span className="text-muted-foreground text-xs">Tap to choose</span>
                  </button>
                  {isServicePopoutOpen && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center">
                      <div className="absolute inset-0 bg-background/50" onClick={() => setIsServicePopoutOpen(false)} />
                      <div className="relative w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-foreground">Select a Service</h4>
                          <button type="button" onClick={() => setIsServicePopoutOpen(false)} className="text-muted-foreground text-xs">Close</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {serviceOptions.map((opt) => (
                            <button key={opt.value || "none"} type="button"
                              onClick={() => { setFormData((prev) => ({ ...prev, service: opt.value })); setIsServicePopoutOpen(false); }}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm border ${formData.service === opt.value ? "accent-gradient text-accent-foreground border-accent" : "bg-muted text-foreground border-border hover:bg-muted/80"}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <select id="service" value={formData.service} onChange={handleChange}
                    className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent">
                    {serviceOptions.map((opt) => (
                      <option key={opt.value || "none"} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Message</label>
                <textarea id="message" rows={4} required value={formData.message} onChange={handleChange}
                  className="w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent"
                  placeholder="Tell us about your project or inquiry..."></textarea>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Index;
