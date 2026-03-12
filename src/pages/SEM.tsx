import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { BarChart2, Search, ArrowUpRight, Globe, TrendingUp, LineChart, CheckCircle, Target, Zap, AlertTriangle, Flame, Clock, ShieldAlert, X } from "lucide-react";
import Footer from "./Footer";
import BlogSection from "@/components/BlogSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SEM = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <PainSection />
      <Features />
      <GEOExplanation />
      <Process />
      <PPCFeatures />
      <PPCProcess />
      <BlogSection
        tags={['SEM', 'SEO', 'search engine marketing', 'google ads', 'paid advertising', 'organic traffic']}
        title="SEM & SEO Insights"
        subtitle="Learn the latest strategies and tips for search engine marketing success"
      />
      <CallToAction />
      <Footer />
    </div>
  );
};

const Hero = () => {
  return (
    <section className="hero-gradient relative overflow-hidden pt-24 lg:pt-32 pb-12 lg:pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center">
        <motion.div className="lg:w-1/2 mb-8 lg:mb-0" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-primary-foreground/80">Your competitors rank above you</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary-foreground">
            Someone Just Googled Your Service — And Found <span className="text-gradient">Your Competitor</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-display font-bold mb-6 text-primary-foreground/80">
            SEO Services Malaysia | Malaysia SEO Expert | SEO Kuala Lumpur | SEO Penang
          </h2>
          <p className="text-md md:text-xl text-primary-foreground/70 mb-8">
            Every hour your website sits on page 2, you lose customers to businesses with worse products but better SEO. Get free SEO analysis Malaysia from our Malaysia SEO consultant team — and see exactly what's costing you leads.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              <Flame className="mr-2 h-5 w-5" />
              Get Your FREE SEO Audit — See What You're Losing
            </Button>
          </Link>
        </motion.div>
        <motion.div className="lg:w-1/2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-card">
            <h3 className="text-lg font-display font-bold mb-4 text-destructive">⚠️ The Cost of Inaction</h3>
            <div className="space-y-4">
              {[
                { stat: "75%", desc: "of users never scroll past the first page of Google" },
                { stat: "RM0", desc: "revenue from keywords you don't rank for" },
                { stat: "3-6 months", desc: "head start your competitor has if you wait" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-accent min-w-[80px]">{item.stat}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PainSection = () => {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Does This Sound Like You?
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <ShieldAlert className="h-8 w-8" />, pain: "\"I've been paying for SEO for months but see no results\"", solution: "Most agencies use outdated tactics. We combine SEO + GEO for both Google and AI search engines." },
            { icon: <AlertTriangle className="h-8 w-8" />, pain: "\"My Google Ads cost keeps going up but leads go down\"", solution: "We audit your campaigns, cut waste, and restructure for maximum ROI — often cutting costs by 30-50%." },
            { icon: <Clock className="h-8 w-8" />, pain: "\"I don't know if my current agency is actually doing anything\"", solution: "We provide transparent dashboards. You see every keyword, every click, every ringgit — in real-time." },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-destructive mb-4">{item.icon}</div>
              <p className="text-foreground font-bold mb-3 italic">{item.pain}</p>
              <p className="text-sm text-accent">{item.solution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Search className="h-7 w-7" />, title: "SEO Packages Malaysia", description: "Affordable SEO services pricing Malaysia with transparent packages. No lock-in contracts. Cancel if we don't deliver results." },
    { icon: <Globe className="h-7 w-7" />, title: "Local SEO Malaysia", description: "Dominate Google Maps and local search. When someone near your business searches, they find you — not your competitor." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "Google Ads Malaysia", description: "Stop burning money on bad ads. Our Google Ads agency Malaysia service delivers leads at the lowest cost per acquisition." },
    { icon: <TrendingUp className="h-7 w-7" />, title: "Free SEO Analysis", description: "Get free SEO analysis Malaysia from our Malaysia SEO specialist team. See exactly why you're losing to competitors." },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Arsenal</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            The Weapons Your Competitors Fear
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Our SEM strategy doesn't stop at top search positions. We supercharge every corner of Google's ecosystem — Maps, My Business, Search, and AI — with both SEO & GEO optimization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12">
          {features.map((feature, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GEOExplanation = () => {
  return (
    <section className="py-12 lg:py-24 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Your Competitors Don't Know This Yet</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
            <span className="text-gradient">GEO</span> — The Secret Weapon 99% of Agencies Ignore
          </h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            While everyone fights over Google rankings, a massive shift is happening. Over 60% of users now ask ChatGPT, Claude, and Perplexity for recommendations. If your business isn't optimized for AI search — you're invisible to the next generation of buyers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-display font-bold mb-6 text-accent">First-Mover Advantage</h3>
            <div className="space-y-4 text-muted-foreground">
              {[
                { label: "AI Search Growth:", text: "Over 60% of users now use AI chatbots for research — and this number doubles every year" },
                { label: "Window of Opportunity:", text: "Your competitors are still stuck in traditional SEO. Get ahead NOW while the door is open" },
                { label: "Higher Intent Traffic:", text: "People asking AI for recommendations are ready to buy — not just browse" },
                { label: "Local Domination:", text: "Be the business AI recommends when someone asks 'best [your service] in Malaysia'" },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                  <p><strong className="text-foreground">{item.label}</strong> {item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="rounded-2xl border border-accent/20 bg-card p-8 shadow-card">
              <h4 className="text-xl font-display font-bold mb-4 text-accent">Others vs Us</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-destructive pl-4">
                  <h5 className="font-semibold text-foreground">Other Agencies</h5>
                  <p className="text-muted-foreground text-sm">Still doing the same SEO they did in 2019. No AI strategy. No GEO. Falling behind.</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h5 className="font-semibold text-foreground">Leadzap (Our Approach)</h5>
                  <p className="text-muted-foreground text-sm">SEO + GEO dual optimization ensures your business dominates both Google AND AI-generated answers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="rounded-2xl bg-accent/10 p-8 border border-accent/30" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Our SEO + GEO Advantage</h3>
            <p className="text-md md:text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
              We don't just do traditional SEO. Our dual approach ensures your business dominates both Google search results AND gets featured in AI-powered responses when customers ask questions about your industry in Malaysia.
            </p>
            <div className="grid md:grid-cols-3 gap-3 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">Traditional SEO</div>
                <p className="text-muted-foreground">Google, Bing, Yahoo rankings</p>
              </div>
              <div className="text-center">
                <div className="text-xl text-muted-foreground">+</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">GEO Optimization</div>
                <p className="text-muted-foreground">ChatGPT, Claude, Perplexity mentions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { number: "01", title: "The X-Ray — SEM Audit", description: "We dissect your entire online presence. Every missed keyword. Every wasted dollar. Every competitor advantage. You'll see exactly where money is leaking." },
    { number: "02", title: "The Battle Plan", description: "Based on data (not guesses), we create a strategy combining SEO and GEO tactics custom-built for your market, your competition, and your budget." },
    { number: "03", title: "Deployment", description: "Our team executes on-page, off-page, technical SEO and GEO optimizations. You start climbing rankings while competitors wonder what happened." },
    { number: "04", title: "Compound & Dominate", description: "We continuously optimize based on real data. Your cost-per-lead drops every month while your traffic compounds — the rich get richer." },
  ];

  return (
    <section className="py-10 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">How We Take You to #1</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            A proven, methodical process — not random tactics. Every step builds on the last.
          </p>
        </motion.div>

        <div className="mt-12 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border transform -translate-x-1/2 hidden md:block"></div>
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div key={index}
                className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center md:gap-8`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} viewport={{ once: true }}>
                <div className={`md:w-1/2 mb-4 md:mb-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="block text-4xl md:text-5xl font-bold text-accent mb-2">{step.number}</span>
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-md md:text-lg">{step.description}</p>
                </div>
                <div className="md:w-1/2 flex justify-center relative"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PPCFeatures = () => {
  const features = [
    { icon: <TrendingUp className="h-7 w-7" />, title: "Surgical Targeting", description: "We don't spray and pray. Every ad targets buyers with high purchase intent — so you pay for leads, not clicks." },
    { icon: <ArrowUpRight className="h-7 w-7" />, title: "Results in 24 Hours", description: "While SEO builds momentum, PPC delivers leads TODAY. See traffic and enquiries the moment campaigns go live." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "Stop Wasting Money", description: "We cut wasted spend by 30-50% on average. Your budget goes to conversions, not irrelevant clicks." },
    { icon: <LineChart className="h-7 w-7" />, title: "Every Ringgit Tracked", description: "No more guessing. See exactly which keywords and ads drive revenue — down to the last sen." },
  ];

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-primary-foreground">
            Google Ads: Stop Burning Money. Start Printing Leads.
          </h2>
          <p className="text-md md:text-lg text-primary-foreground/70 max-w-3xl mx-auto">
            Most businesses waste 40-60% of their Google Ads budget on irrelevant clicks. We fix that — and turn your ad spend into a lead generation machine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PPCProcess = () => {
  const steps = [
    { number: "01", title: "Campaign Autopsy", description: "We audit your existing campaigns (or competitors') to find exactly where money is being wasted." },
    { number: "02", title: "Keyword Sniping", description: "Identify the exact keywords that bring buyers — not browsers. High intent, low competition, maximum ROI." },
    { number: "03", title: "Killer Ad Copy", description: "Craft ads that make people stop scrolling and start clicking. Headlines that convert. Landing pages that sell." },
    { number: "04", title: "Precision Launch", description: "Launch campaigns with surgical targeting, smart bidding, and daily optimization from day one." },
    { number: "05", title: "Scale What Works", description: "Double down on winners, kill losers. Every week your campaigns get cheaper and more profitable." },
  ];

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4 text-foreground">Our Google Ads Battle Plan</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="text-accent text-xl md:text-2xl font-bold mb-3 md:mb-4">{step.number}</div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [isServicePopoutOpen, setIsServicePopoutOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (error) { console.error("Error sending to Pabbly:", error); }
    setTimeout(() => setSubmitted(false), 3000);
  };

  const serviceOptions = [
    { value: "", label: "Select a Service" }, { value: "seo", label: "SEO" },
    { value: "social", label: "Social Media Ads" }, { value: "order", label: "Order Management System" },
    { value: "other", label: "Other" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
                <Clock className="h-4 w-4 text-destructive" />
                <span className="text-sm font-bold text-destructive">Limited: 5 free audits remaining this month</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground">
                Get Your FREE SEO Audit Before Your Competitor Does
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-6">
                Every week you wait, your competitor's SEO gets stronger and yours gets weaker. This free audit shows you exactly what to fix — and how much revenue you're missing.
              </p>
              <ul className="space-y-3 text-primary-foreground/70">
                {["Complete technical SEO & GEO analysis", "Competitor gap report — see what they rank for", "AI search visibility assessment", "Revenue opportunity calculator", "FREE Google Ads waste audit"].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div className="rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              {submitted ? (
                <motion.div className="bg-green-800/30 border border-green-600 rounded-lg p-5 md:p-6 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2 text-foreground">Your Audit Is Being Prepared!</h3>
                  <p className="text-sm text-muted-foreground">Expect it in your inbox within 24 hours.</p>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                      <input type="text" id="name" required value={formData.name} onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Email</label>
                      <input type="email" id="email" required value={formData.email} onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Website URL</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="www.yourwebsite.com" />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What do you need most?</label>
                    <div className="md:hidden">
                      <button type="button" onClick={() => setIsServicePopoutOpen(true)}
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between">
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
                        className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground focus:ring-accent focus:border-accent">
                        {serviceOptions.map((opt) => (<option key={opt.value || "none"} value={opt.value}>{opt.label}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What keywords do you want to rank for?</label>
                    <textarea id="message" rows={3} required value={formData.message} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent"
                      placeholder="e.g. 'dental clinic KL', 'best lawyer malaysia'..."></textarea>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Flame className="mr-2 h-5 w-5" />
                    Claim My Free SEO Audit
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">100% free. No obligations. Delivered within 24 hours.</p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEM;
