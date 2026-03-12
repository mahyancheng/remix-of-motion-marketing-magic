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
import { Search, Megaphone, CodeXml, ArrowUpRight, Phone, Mail, CheckCircle, X, Menu, Zap, Target, TrendingUp, AlertTriangle, ShieldAlert, Flame, Clock, BarChart2 } from "lucide-react";
import DemoOne from "@/components/ui/testimonials-3d";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
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
      <PainPoints />
      <Framework />
      <BeforeAfter />
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
              <Cover variant="button">
                <Button variant="hero" size="lg" className="w-full">
                  Get Started
                </Button>
              </Cover>
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
                Stop losing leads to competitors who rank above you. Our SEO & Google Ads put you first.
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
                Your competitors are stealing your customers on social media right now. Let's fight back.
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
                Still running your business on spreadsheets? Automate and scale with custom-built systems.
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
            <Cover variant="button">
              <Button variant="hero" size="default">
                Get Started
              </Button>
            </Cover>
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

// Hero - AnimatedHero with fear/greed
const Hero = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="relative z-10">
        <AnimatedHero
          badge="90% of Malaysian SMEs fail within 5 years"
          titlePrefix="Your competitors are"
          rotatingWords={["stealing your leads", "outranking you", "automating", "scaling faster", "winning"]}
          description="Every day you wait, your competitors capture leads that should be yours. Leadzap is the top digital marketing agency Malaysia businesses trust to fight back — with SEO services pricing Malaysia can afford and social media marketing Malaysia that actually converts."
          primaryCTA={{ label: "Stop Losing Leads — Talk to Us Free", href: "/contact" }}
          secondaryCTA={{ label: "See What You're Missing", href: "/customer-software-demo" }}
        />
      </div>
    </header>
  );
};

// Pain Points - Agitation section
const PainPoints = () => {
  const pains = [
    { icon: <ShieldAlert className="h-7 w-7" />, title: "Invisible Online?", description: "Your potential customers are searching for your services right now — but finding your competitors instead. Every missed click is a missed sale." },
    { icon: <AlertTriangle className="h-7 w-7" />, title: "Wasting Ad Budget?", description: "You've tried Facebook Ads or Google Ads but got nothing. Bad targeting, weak copy, no strategy — your money burned with zero ROI." },
    { icon: <Clock className="h-7 w-7" />, title: "Stuck with Spreadsheets?", description: "While you manually track orders and chase invoices, your competitors are automating everything — and scaling 3x faster than you." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "No Idea What's Working?", description: "You're spending money on marketing but can't tell what's driving revenue. No dashboard. No data. Just hope." },
  ];

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Sound Familiar?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            These Problems Are Costing You Thousands Every Month
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Most Malaysian SMEs and startups face these exact challenges. The difference between those who thrive and those who close? <strong className="text-accent">Taking action before it's too late.</strong>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {pains.map((pain, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-destructive/20 bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {pain.icon}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground">{pain.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{pain.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Framework - The Solution (Push-Pull)
const Framework = () => {
  return (
    <section id="framework" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">The Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            While Others Guess, We <span className="text-gradient">Engineer Growth</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Most agencies run random ads and pray for results. Our proprietary Push-Pull framework creates a self-reinforcing ecosystem — push data feeds pull marketing, pull data optimizes push campaigns. The result? Compounding returns that get cheaper over time.
          </p>
        </motion.div>

        <motion.div className="mt-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
          <img src={Push_Pull} alt="Push-Pull Marketing Framework" className="max-w-2xl w-[55%] mx-auto" />
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:gap-6">
          <motion.div
            className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
            <h3 className="text-xl font-display font-bold mb-3 md:mb-4 text-accent">PUSH — Instant Leads</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Can't wait 6 months for SEO? Neither can we. Push campaigns put you in front of buyers <strong className="text-foreground">today</strong> — and every click feeds data back into your long-term strategy.
            </p>
            <ul className="mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>Facebook, Instagram & TikTok ads that convert</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>Retargeting audiences built from real data</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>Immediate enquiries from day one</span></li>
            </ul>
          </motion.div>

          <motion.div
            className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>
            <h3 className="text-xl font-display font-bold mb-3 md:mb-4 text-accent">PULL — Compounding Growth</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Ads stop when you stop paying. SEO doesn't. Our pull strategy builds an asset that generates free traffic <strong className="text-foreground">forever</strong> — and gets smarter from push campaign data.
            </p>
            <ul className="mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>SEO + GEO for Google and AI search engines</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>Content that ranks and converts</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">→</span><span>Lower cost-per-lead every month</span></li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Before/After Transformation
const BeforeAfter = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            The Transformation Is Real
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            This is what happens when you stop guessing and start growing with a proven system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div className="rounded-2xl border border-destructive/20 bg-card p-6 md:p-8 shadow-card"
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-sm font-bold text-destructive">BEFORE Leadzap</span>
            </div>
            <ul className="space-y-3">
              {[
                "Spending RM5,000/month on ads with zero trackable ROI",
                "Website buried on page 5 of Google",
                "Manually managing orders on WhatsApp and Excel",
                "Competitors outranking you for every keyword",
                "No idea which marketing channel actually works",
              ].map((item, i) => (
                <li key={i} className="flex items-start text-muted-foreground">
                  <X className="h-4 w-4 text-destructive mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div className="rounded-2xl border border-accent/30 bg-card p-6 md:p-8 shadow-card shadow-glow"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold text-accent">AFTER Leadzap</span>
            </div>
            <ul className="space-y-3">
              {[
                "Every RM spent tracked to real revenue — 3-5x ROAS average",
                "Ranking #1 for high-intent keywords in your industry",
                "Automated systems handling orders, invoices & follow-ups",
                "Competitors wondering how you grew so fast",
                "Clear dashboard showing exactly what drives growth",
              ].map((item, i) => (
                <li key={i} className="flex items-start text-foreground">
                  <CheckCircle className="h-4 w-4 text-accent mt-1 mr-3 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Total Digital Solutions
const TotalDigitalSolutions = () => {
  const solutions = [
    { title: "SEO Services Malaysia", description: "Your competitors are on page 1. You're not. Our free SEO analysis Malaysia reveals exactly why — and how to fix it fast." },
    { title: "Facebook Marketing Malaysia", description: "Stop boosting posts and hoping. Our data-driven Facebook marketing Malaysia campaigns target buyers, not browsers." },
    { title: "Google Ads Agency Malaysia", description: "Every wasted click costs you money. Our Google Ads Malaysia campaigns deliver leads at the lowest possible cost." },
    { title: "Social Media Marketing Malaysia", description: "Your audience scrolls past 300+ posts daily. We make sure they stop on yours — and take action." },
  ];

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Complete Solutions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Everything You Need to <span className="text-gradient">Dominate</span> Your Market
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto">
            While other agencies do one thing, we build the entire machine. SEO, ads, social, software — all working together so you never leave money on the table.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {solutions.map((solution, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-accent">{solution.title}</h3>
              <p className="text-muted-foreground text-sm md:text-md">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Website Design - Social Proof
const WebsiteDesign = () => {
  const websites = [
    { name: "WorkConnect", description: "From zero online presence to 200+ monthly leads in 4 months", url: "https://workconnect.com.my", image: Workconnect },
    { name: "Tectone Steel", description: "Went from page 10 to page 1 for 'steel supplier Malaysia'", url: "https://tectonesteel.com", image: Tectone },
    { name: "Puregen", description: "3x revenue growth through integrated digital marketing", url: "https://www.puregen.com.my", image: Puregen },
  ];

  return (
    <section className="py-10 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-3">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Businesses That Chose to <span className="text-gradient">Fight Back</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            These companies were once in your exact position. Now they dominate their industries online.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websites.map((website, index) => (
            <div key={index} className="group rounded-2xl p-2 -m-2">
              <motion.a href={website.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-transparent transition-all duration-300 bg-card shadow-card hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 group-hover:border-accent/50 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                <img src={website.image} alt={website.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-display font-bold mb-2 text-accent group-hover:text-accent/80 transition-colors">{website.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{website.description}</p>
                  <span className="inline-flex items-center text-sm text-accent group-hover:text-accent/80 transition-colors">
                    See Their Results
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

// Services - Urgency-driven CTAs
const Services = () => {
  const serviceItems = [
    { emoji: "🎯", title: "Search Engine Marketing (SEM)", description: "Your competitor just ranked above you for your main keyword. Our free SEO audit shows you exactly how to take it back.", cta: "GET FREE SEO AUDIT →", link: "/sem" },
    { emoji: "📱", title: "Social Media Marketing", description: "Your ideal customer just scrolled past a competitor's ad. We make sure the next ad they see is yours.", cta: "Steal Their Attention →", link: "/social-media-ads" },
    { emoji: "💻", title: "Custom Software", description: "Still copy-pasting between 5 different tools? Your competitor just automated their entire workflow.", cta: "Automate Now →", link: "/customer-software-demo" },
    { emoji: "⚡", title: "Full Service Package", description: "Why hire 4 agencies when one can do it all? One team, one strategy, one dashboard — maximum results.", cta: "Get Full Package →", link: "/contact" },
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Take Action Now</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Choose Your Weapon
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Every day without a strategy is a day your competitors get further ahead. Pick the service that solves your biggest bottleneck — or take all of them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {serviceItems.map((item, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full min-h-[240px] md:min-h-[280px]"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div>
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <span className="text-accent font-bold text-2xl md:text-3xl">{item.emoji}</span>
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-accent">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{item.description}</p>
              </div>
              <Link to={item.link} className="mt-auto">
                <Cover variant="button">
                  <Button variant="hero" size="default" className="w-full text-sm md:text-base">
                    {item.cta}
                  </Button>
                </Cover>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Form - Urgency driven
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
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Your Competitors Won't Wait. <Cover>Will You?</Cover>
          </h2>
          <p className="text-xs md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Get a free consultation and discover exactly how much revenue you're leaving on the table. No obligations. No pressure. Just clarity.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
          {submitted ? (
            <motion.div className="bg-green-800/30 border border-green-600 rounded-lg p-5 md:p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">We're On It!</h3>
              <p className="text-sm md:text-base text-muted-foreground">Expect a call from our strategist within 24 hours. Your competitors better watch out.</p>
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
                <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What's Your Biggest Challenge?</label>
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
                <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Tell Us About Your Situation</label>
                <textarea id="message" rows={4} required value={formData.message} onChange={handleChange}
                  className="w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent"
                  placeholder="What's costing you the most right now? Lost leads? Wasted ad spend? Manual processes?"></textarea>
              </div>

              <Cover variant="button">
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Flame className="mr-2 h-5 w-5" />
                  Get My Free Growth Strategy
                </Button>
              </Cover>
              <p className="text-xs text-center text-muted-foreground">Free. No credit card. Response within 24 hours.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Index;
