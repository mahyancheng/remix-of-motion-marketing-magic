import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { BarChart2, Search, ArrowUpRight, Globe, TrendingUp, LineChart, CheckCircle, Target, Zap } from "lucide-react";
import Footer from "./Footer";
import BlogSection from "@/components/BlogSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SEM = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <Search className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/80">Search Engine Marketing</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary-foreground">
            <span className="text-gradient">SEO Services Malaysia</span> & Google Ads
          </h1>
          <h2 className="text-xl md:text-3xl font-display font-bold mb-6 text-primary-foreground">
            Malaysia SEO Expert | SEO Kuala Lumpur | SEO Penang
          </h2>
          <p className="text-md md:text-xl text-primary-foreground/70 mb-8">
            Get free SEO analysis Malaysia from a trusted Malaysia SEO consultant. Our SEO packages Malaysia combine local SEO Malaysia with Google SEO Malaysia expertise for top rankings.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">Get Your FREE SEM Audit</Button>
          </Link>
        </motion.div>
        <motion.div className="lg:w-1/2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" alt="SEM Data Analytics" className="w-full rounded-2xl shadow-card" />
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: <Search className="h-7 w-7" />, title: "SEO Packages Malaysia", description: "Affordable SEO services pricing Malaysia with transparent packages. From SEO Kuala Lumpur to SEO Penang coverage." },
    { icon: <Globe className="h-7 w-7" />, title: "Local SEO Malaysia", description: "Local SEO Malaysia optimization for Google Maps and local search visibility across all Malaysian cities." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "Google Ads Malaysia", description: "Google Ads agency Malaysia services with proven ROI. Expert Google Ads management and optimization." },
    { icon: <TrendingUp className="h-7 w-7" />, title: "Free SEO Analysis", description: "Get free SEO analysis Malaysia from our Malaysia SEO specialist team with actionable recommendations." },
  ];

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-6 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our SEM Services</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">What can you expect from our services?</p>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Our SEM strategy doesn't stop at top search positions. We supercharge every corner of Google's ecosystem—Maps, My Business, Search, and more with both SEO & GEO optimization
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
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
            What is <span className="text-gradient">GEO</span> (Generative Engine Optimization)?
          </h2>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <p className="text-md md:text-lg text-accent font-medium text-center">⚠️ Not to be confused with Geographic SEO or Local SEO</p>
          </div>
          <p className="text-md md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            GEO is the cutting-edge practice of optimizing your content specifically for AI-powered search engines and generative AI tools like ChatGPT, Claude, Bard, Perplexity, and other AI assistants that generate answers from web content.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-display font-bold mb-6 text-accent">Why GEO Matters for Your Business</h3>
            <div className="space-y-4 text-muted-foreground">
              {[
                { label: "AI Search Growth:", text: "Over 60% of users now use AI chatbots for research and product discovery" },
                { label: "Future-Proof Strategy:", text: "Get ahead of competitors who are still stuck in traditional SEO" },
                { label: "Higher Quality Traffic:", text: "AI-powered searches often indicate higher purchase intent" },
                { label: "Local Market Advantage:", text: "Dominate AI search results for Malaysia and KL market" },
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
              <h4 className="text-xl font-display font-bold mb-4 text-accent">GEO vs Traditional SEO</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-accent pl-4">
                  <h5 className="font-semibold text-foreground">Traditional SEO</h5>
                  <p className="text-muted-foreground text-sm">Optimizes for keyword rankings on Google search results pages</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h5 className="font-semibold text-foreground">GEO (Our Approach)</h5>
                  <p className="text-muted-foreground text-sm">Optimizes for AI responses, ensuring your business gets mentioned in AI-generated answers and recommendations</p>
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
                <div className="text-3xl font-bold text-green-400 mb-2">GEO Optimization</div>
                <p className="text-muted-foreground">ChatGPT, Claude, Bard, Perplexity mentions</p>
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
    { number: "01", title: "SEM Audit & Analysis", description: "We conduct a comprehensive analysis of your current SEM performance, including SEO and GEO optimization opportunities." },
    { number: "02", title: "Strategy Development", description: "Based on our findings, we create a customized SEM strategy combining SEO and GEO tactics tailored to your business goals." },
    { number: "03", title: "Implementation", description: "Our team executes the strategy, implementing on-page, off-page, technical SEO optimizations, and GEO strategies for AI-powered search." },
    { number: "04", title: "Monitoring & Refinement", description: "We continuously monitor your SEM performance across traditional and generative search engines, refining our approach to maximize results." },
  ];

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our SEM Process</h2>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            A methodical approach to improving your search engine visibility and organic traffic through comprehensive SEM strategies.
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
    { icon: <TrendingUp className="h-7 w-7" />, title: "Precision Targeting", description: "Target the exact keywords and demographics that matter most to your business for maximum ROI." },
    { icon: <ArrowUpRight className="h-7 w-7" />, title: "Lightning-Fast Results", description: "See immediate traffic and conversions as soon as your campaigns go live." },
    { icon: <BarChart2 className="h-7 w-7" />, title: "Cost Optimization", description: "Advanced bid management and optimization strategies to minimize costs and maximize profits." },
    { icon: <LineChart className="h-7 w-7" />, title: "Performance Tracking", description: "Detailed reporting and analytics to track every click, conversion, and dollar spent." },
  ];

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-primary-foreground">Pay Per Click (Google Ads) Management</h2>
          <p className="text-md md:text-lg text-primary-foreground/70 max-w-3xl mx-auto">
            Want to pay your way up to the first page of Google? Our team crafts lightning-precise campaigns that strike with maximum impact and drive costs down.
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
    { number: "01", title: "Campaign Strategy", description: "We analyze your business goals and create a tailored Google Ads strategy." },
    { number: "02", title: "Keyword Research", description: "Identify high-converting keywords with the best cost-per-click ratios." },
    { number: "03", title: "Ad Creation", description: "Craft compelling ad copy and landing pages optimized for conversions." },
    { number: "04", title: "Campaign Launch", description: "Launch campaigns with precise targeting and bid optimization." },
    { number: "05", title: "Monitoring & Optimization", description: "Continuously monitor and optimize campaigns for maximum ROI." },
  ];

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4 text-foreground">Our Google Ads Process</h2>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground">Get Your FREE SEM Audit Today!</h2>
              <p className="text-lg text-primary-foreground/70 mb-6">
                Discover how our comprehensive SEM audit Malaysia service can improve your search rankings across traditional and AI-powered search engines.
              </p>
              <ul className="space-y-3 text-primary-foreground/70">
                {["Complete technical SEO & GEO analysis", "Local SEM Malaysia opportunities", "AI search optimization assessment", "Actionable SEM improvement recommendations", "FREE Google Ads audit & strategy"].map((item, i) => (
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
                  <h3 className="text-lg font-bold mb-2 text-foreground">Message Sent Successfully!</h3>
                  <p className="text-sm text-muted-foreground">Our team will get back to you shortly.</p>
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
                    <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="Your Company" />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Service Interested In</label>
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
                    <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Message</label>
                    <textarea id="message" rows={4} required value={formData.message} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent"
                      placeholder="Tell us about your project or inquiry..."></textarea>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">Send Message</Button>
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
