import { useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { BarChart2, Target, TrendingUp, Users, Instagram, Facebook, Youtube, Megaphone, CheckCircle, Zap, AlertTriangle, Flame, Clock, ShieldAlert, X } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import Footer from "./Footer";
import BlogSection from "@/components/BlogSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SocialMediaAds = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <PainPoints />
      <Platforms />
      <CampaignTypes />
      <Process />
      <BlogSection
        tags={['social media marketing', 'social media ads', 'facebook ads', 'instagram marketing', 'tiktok advertising', 'paid social']}
        title="Social Media Marketing Insights"
        subtitle="Discover proven strategies for social media advertising and organic growth"
      />
      <CallToAction />
      <Footer />
    </div>
  );
};

const Hero = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <AnimatedHero
          badge="Your competitor's ad is showing to YOUR customers right now"
          titlePrefix="Your customers just scrolled past"
          rotatingWords={["your competitor's ad", "a rival's offer", "someone else's deal", "and clicked it"]}
          description="While you're 'thinking about it,' your competitors are running Facebook marketing Malaysia campaigns that steal your customers. As the leading social media marketing agency Malaysia, we turn the tables."
          primaryCTA={{ label: "Stop Losing Customers — Free Strategy Call", href: "/contact" }}
          secondaryCTA={{ label: "View Our Results", href: "/corporate-profile" }}
        />
      </div>
    </header>
  );
};

const PainPoints = () => {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            "I Tried Social Media Ads. It Didn't Work."
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We hear this every week. Here's why it failed — and why it'll be different with us.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { wrong: "Boosted a post for RM50 and got likes but no sales", right: "We build conversion-optimized funnels with retargeting — likes mean nothing, sales mean everything" },
            { wrong: "Hired a 'social media manager' who just posted pretty pictures", right: "We run data-driven paid campaigns with A/B testing, audience segmentation, and performance tracking" },
            { wrong: "Tried Facebook Ads but the cost kept climbing with no results", right: "We optimize daily, kill underperformers, and scale winners — your cost goes DOWN over time" },
            { wrong: "Got lots of clicks but nobody actually bought anything", right: "We target buyers, not browsers. Custom audiences, lookalikes, and retargeting close the deal" },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="flex items-start gap-3 mb-3">
                <X className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm italic">"{item.wrong}"</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <p className="text-foreground text-sm font-medium">{item.right}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Platforms = () => {
  const platforms = [
    { icon: <Facebook className="h-12 w-12" />, name: "Facebook & Instagram", description: "Where your customers spend 2+ hours daily. We put your offer right in front of them — with surgical targeting.", features: ["Precise buyer targeting", "Retargeting warm audiences", "Shopping integration", "Messenger automation"] },
    { icon: <Youtube className="h-12 w-12" />, name: "TikTok Advertising", description: "The platform your competitors haven't figured out yet. Lower costs, higher engagement, massive reach.", features: ["Viral content potential", "50% lower CPM than Facebook", "Hashtag challenges", "Creator partnerships"] },
    { icon: <Instagram className="h-12 w-12" />, name: "RedNote (Xiaohongshu)", description: "Dominate the Chinese-Malaysian market. Where high-intent buyers discover and buy premium products.", features: ["Premium audience targeting", "Product discovery", "KOL partnerships", "Community trust building"] },
  ];

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Platforms</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Your Customers Are Here — <span className="text-gradient">Are You?</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Social media marketing packages Malaysia covering every platform where your customers hang out. As a social media marketing agency Malaysia leader, we maximize your ROI on each one.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 mt-6 md:mt-12">
          {platforms.map((platform, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-2 sm:p-3 md:p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-2 md:mb-4 text-accent flex justify-center text-2xl md:text-3xl">{platform.icon}</div>
              <h3 className="text-[9px] sm:text-xs md:text-lg font-display font-bold mb-1 md:mb-3 text-center leading-snug text-foreground">{platform.name}</h3>
              <p className="text-[9px] sm:text-xs md:text-sm text-muted-foreground mb-2 md:mb-4 text-center">{platform.description}</p>
              <ul className="space-y-1 md:space-y-2 mt-auto">
                {platform.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-[9px] sm:text-xs md:text-sm text-muted-foreground">
                    <span className="text-accent mr-1 md:mr-2 text-xs md:text-sm">✓</span>
                    <span>{feature}</span>
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

const CampaignTypes = () => {
  const campaigns = [
    { icon: <Megaphone className="h-10 w-10" />, name: "Brand Awareness", description: "Make your brand unforgettable. We put you in front of thousands of ideal customers daily — so when they're ready to buy, they think of YOU first." },
    { icon: <TrendingUp className="h-10 w-10" />, name: "Lead Generation", description: "Fill your sales pipeline with qualified leads. Real phone numbers, real emails, real people ready to talk — not vanity metrics." },
    { icon: <Users className="h-10 w-10" />, name: "Foot Traffic", description: "Empty store? We drive people from their phones to your door with geo-targeted campaigns that track every visit." },
    { icon: <Target className="h-10 w-10" />, name: "Online Sales", description: "Abandoned carts? We bring them back. Retargeting, dynamic product ads, and checkout optimization that turns browsers into buyers." },
  ];

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            What's Your <span className="text-gradient">Biggest Goal</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Tell us what you need — we build campaigns that deliver exactly that.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {campaigns.map((campaign, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 text-center"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="mb-4 text-accent flex justify-center">{campaign.icon}</div>
              <h3 className="text-xl font-display font-bold mb-3 text-foreground">{campaign.name}</h3>
              <p className="text-sm md:text-md text-muted-foreground">{campaign.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    { title: "Spy on Competitors", description: "We reverse-engineer your top competitors' ads. What works for them, we do better. What doesn't, we avoid." },
    { title: "Build the Machine", description: "Custom audiences, killer creative, landing pages that convert. We build the entire funnel — not just the ad." },
    { title: "Test Everything", description: "5 headlines. 3 images. 4 audiences. We test ruthlessly and let data pick the winner — not gut feelings." },
    { title: "Kill Losers, Scale Winners", description: "Every day we cut what doesn't work and double down on what does. Your ROI improves every single week." },
    { title: "Compound Results", description: "Retargeting, lookalike audiences, upsell campaigns. The longer we run, the cheaper your leads get." },
  ];

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Our Unfair Advantage
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">While other agencies set and forget, we optimize daily. Here's how we consistently outperform.</p>
        </motion.div>

        <motion.div className="mt-12 grid md:grid-cols-5 gap-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          {steps.map((step, index) => (
            <motion.div key={index}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="accent-gradient text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold absolute -top-5 left-1/2 transform -translate-x-1/2">
                {index + 1}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-3 mt-4 text-center text-foreground">{step.title}</h3>
              <p className="text-sm md:text-md text-muted-foreground text-center">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
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
    <section className="py-12 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
                <Clock className="h-4 w-4 text-destructive" />
                <span className="text-sm font-bold text-destructive">Every hour without ads = customers lost to competitors</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground">
                Your Competitors Are Running Ads Right Now. <Cover>Are You?</Cover>
              </h2>
              <p className="text-md text-primary-foreground/70 mb-6">
                Get a free ad strategy session and discover exactly how much revenue social media can generate for your business. No fluff. Just numbers.
              </p>
              <ul className="space-y-3 text-primary-foreground/70">
                {["Competitor ad analysis — see what they're running", "Custom audience strategy for your market", "Budget recommendation with projected ROI", "Creative direction and messaging framework"].map((item, i) => (
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
                <motion.div className="bg-green-800/30 border border-green-600 rounded-lg p-5 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2 text-foreground">Strategy Session Booked!</h3>
                  <p className="text-sm text-muted-foreground">We'll reach out within 24 hours with your custom plan.</p>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                      <input type="text" id="name" required value={formData.name} onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Email</label>
                      <input type="email" id="email" required value={formData.email} onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company / Brand Name</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="Your Company" />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What's your main goal?</label>
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
                    <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Monthly ad budget (approximate)</label>
                    <textarea id="message" rows={3} required value={formData.message} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent"
                      placeholder="e.g. RM3,000-5,000/month. Or tell us your goals and we'll recommend a budget."></textarea>
                  </div>
                  <Cover variant="button">
                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      <Flame className="mr-2 h-5 w-5" />
                      Get My Free Ad Strategy
                    </Button>
                  </Cover>
                  <p className="text-xs text-center text-muted-foreground">Free consultation. No obligations. Response within 24 hours.</p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaAds;
