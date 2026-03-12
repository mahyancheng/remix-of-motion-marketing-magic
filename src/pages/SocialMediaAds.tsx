import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { BarChart2, Target, TrendingUp, Users, Instagram, Facebook, Youtube, Megaphone, CheckCircle, Zap } from "lucide-react";
import Footer from "./Footer";
import BlogSection from "@/components/BlogSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SocialMediaAds = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
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
    <section className="hero-gradient relative overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center">
        <motion.div className="lg:w-1/2 mb-8 lg:mb-0" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <Megaphone className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/80">Social Media Marketing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary-foreground">
            <span className="text-gradient">Social Media Marketing Malaysia</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-primary-foreground">
            Social Media Marketing Agency Malaysia | Facebook Marketing Malaysia
          </h2>
          <p className="text-md md:text-xl text-primary-foreground/70 mb-8">
            Leading social media agency marketing in Malaysia. Our social media marketing agency delivers Facebook marketing Malaysia campaigns that convert audiences into customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">Get a Free Ad Strategy</Button>
            </Link>
            <Link to="/blog">
              <Button variant="hero-outline" size="xl">View Success Stories</Button>
            </Link>
          </div>
        </motion.div>
        <motion.div className="lg:w-1/2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Social Media Marketing" className="w-full rounded-2xl shadow-card" />
        </motion.div>
      </div>
    </section>
  );
};

const Platforms = () => {
  const platforms = [
    { icon: <Facebook className="h-12 w-12" />, name: "Facebook & Instagram", description: "Meta's powerful advertising ecosystem with advanced demographic and interest targeting capabilities.", features: ["Precise audience targeting", "Visual storytelling", "Shopping integration", "Messenger automation"] },
    { icon: <Youtube className="h-12 w-12" />, name: "TikTok Advertising", description: "Reach younger demographics through engaging short-form video content and trending challenges.", features: ["Viral content potential", "Creative video formats", "Hashtag challenges", "Influencer collaborations"] },
    { icon: <Instagram className="h-12 w-12" />, name: "RedNote (Xiaohongshu)", description: "China's leading lifestyle platform for authentic product discovery and recommendations.", features: ["Lifestyle targeting", "Product discovery", "KOL partnerships", "Community engagement"] },
  ];

  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Platforms</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Social Media Marketing Platforms</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Social media marketing packages Malaysia covering Facebook, Instagram, TikTok and more. As a social media marketing agency Malaysia leader, we maximize your ROI.
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
    { icon: <Megaphone className="h-10 w-10" />, name: "Brand Awareness", description: "Build brand awareness and reach new potential customers with continuos refined targeting." },
    { icon: <TrendingUp className="h-10 w-10" />, name: "Lead Generation", description: "Generate high quality leads for your sales team to convert them into revenue numbers" },
    { icon: <Users className="h-10 w-10" />, name: "Foot Traffic", description: "Want people to visit your physical store? We design online campaigns that lead people to your store" },
    { icon: <Target className="h-10 w-10" />, name: "Online Sales", description: "Want to see gren in your ecommerce revenue? We have implemented retargeting strategies to bring interested customers back to your site" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Campaign Types</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">We create campaigns based on your business goals -</p>
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
    { title: "Audience Research", description: "We identify your ideal customers and analyze their online behaviors and preferences." },
    { title: "Campaign Strategy", description: "We develop a tailored strategy with optimal ad formats, placements, and bidding approaches." },
    { title: "Creative Development", description: "Our team creates compelling ad creative that resonates with your target audience." },
    { title: "A/B Testing", description: "We continuously test variations of your ads to optimize performance and reduce costs." },
    { title: "Performance Tracking", description: "We track key metrics and provide transparent reporting on campaign performance." },
  ];

  return (
    <section className="py-10 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Ad Management Process</h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">A strategic approach to creating, testing, and optimizing social media ad campaigns.</p>
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
    <section className="py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground">Get Your FREE Social Media Ads Consultation!</h2>
              <p className="text-md text-primary-foreground/70 mb-6">
                Discover how our social media advertising can supercharge your business growth. Get a comprehensive strategy session delivered to your inbox.
              </p>
              <ul className="space-y-3 text-primary-foreground/70">
                {["Complete social media audit", "Campaign strategy recommendations", "Competitor analysis report", "ROI improvement opportunities"].map((item, i) => (
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
                  <h3 className="text-lg font-bold mb-2 text-foreground">Message Sent Successfully!</h3>
                  <p className="text-sm text-muted-foreground">Our team will get back to you shortly.</p>
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
                    <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent" placeholder="Your Company" />
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
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent"
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

export default SocialMediaAds;
