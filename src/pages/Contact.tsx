import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Index";
import { Phone, Mail, CheckCircle, ChevronDown, X, AlertTriangle, Flame, Clock } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import PhoneInput from "../components/PhoneInput";
import Footer from "./Footer";

const serviceLabels: Record<string, string> = {
  "": "Select a Service",
  seo: "SEO — I'm invisible on Google",
  social: "Social Media Ads — I need leads NOW",
  order: "Custom Software — I need to automate",
  other: "Other — Let's talk",
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", service: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      );
      if (res.ok) { setSubmitted(true); }
      else { console.error("❌ Failed to send data to Pabbly"); }
    } catch (err) { console.error("❌ Error sending data to Pabbly:", err); }

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <ContactForm
        submitted={submitted} onSubmit={handleSubmit} formData={formData}
        handleChange={handleChange} handlePhoneChange={handlePhoneChange} handleServiceChange={handleServiceChange}
      />
      <ContactInfo />
      <Footer />
    </div>
  );
};

const Hero = () => (
  <header className="hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
    </div>
    <div className="relative z-10">
      <AnimatedHero
        badge="Every day you wait, competitors get stronger"
        titlePrefix="Ready to stop"
        rotatingWords={["losing leads", "wasting budget", "falling behind", "guessing"]}
        description="Get free SEO analysis Malaysia, social media marketing Malaysia consultation, or custom software quotes. No sales pitch — just honest answers about what's costing you customers."
        primaryCTA={{ label: "Get My Free Growth Strategy", href: "/contact" }}
        secondaryCTA={{ label: "See Our Results", href: "/corporate-profile" }}
      />
    </div>
  </header>
);

const ContactForm = ({ submitted, onSubmit, formData, handleChange, handlePhoneChange, handleServiceChange }: {
  submitted: boolean; onSubmit: (e: React.FormEvent) => void; formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handlePhoneChange: (value: string) => void; handleServiceChange: (value: string) => void;
}) => {
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  const handleMobileServiceSelect = (value: string) => { handleServiceChange(value); setIsServicePickerOpen(false); };

  return (
    <div className="py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="max-w-xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-card border border-border" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="p-6 md:p-10">
            <h2 className="text-xl md:text-3xl font-bold font-display mb-2 md:mb-4 text-foreground">Tell Us What's Broken</h2>
            <p className="text-sm text-muted-foreground mb-6">We'll tell you exactly how to fix it — for free. No obligations.</p>

            {submitted ? (
              <motion.div className="bg-green-800/30 border border-green-600 rounded-lg p-6 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">We're On It!</h3>
                <p className="text-muted-foreground text-sm md:text-base">Expect a response within 4 hours. Your competitors should be worried.</p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={handleChange} placeholder="John Doe"
                      className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Your Email</label>
                    <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com"
                      className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                  <div className="w-full bg-muted rounded-md border border-border px-2 py-1.5">
                    <PhoneInput value={formData.phone} onChange={handlePhoneChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                  <input type="text" id="company" value={formData.company} onChange={handleChange} placeholder="Your Company"
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm" />
                </div>
                <div className="md:hidden">
                  <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What's Your Biggest Problem?</label>
                  <button type="button" onClick={() => setIsServicePickerOpen(true)}
                    className="w-full bg-muted text-foreground px-3 py-2.5 rounded-md border border-border flex items-center justify-between text-sm outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors">
                    <span>{serviceLabels[formData.service] ?? "Select a Service"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What's Your Biggest Problem?</label>
                  <select id="service" value={formData.service} onChange={handleChange}
                    className="w-full bg-muted text-foreground px-4 py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm md:text-base">
                    <option value="">Select a Service</option>
                    <option value="seo">SEO — I'm invisible on Google</option>
                    <option value="social">Social Media Ads — I need leads NOW</option>
                    <option value="order">Custom Software — I need to automate</option>
                    <option value="other">Other — Let's talk</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">What's Keeping You Up at Night?</label>
                  <textarea id="message" rows={4} required value={formData.message} onChange={handleChange} placeholder="Tell us what's frustrating you most. Lost leads? Wasted ad spend? Manual processes? We've heard it all — and fixed it all."
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"></textarea>
                </div>
                <button type="submit" className="w-full accent-gradient text-accent-foreground px-4 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-center gap-2">
                  <Flame className="h-5 w-5" />
                  <Cover>Get My Free Growth Strategy</Cover>
                </button>
                <p className="text-xs text-center text-muted-foreground">Free. No credit card. Response within 4 hours.</p>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {isServicePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 md:hidden">
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground">What's Your Biggest Problem?</h3>
              <button type="button" className="text-muted-foreground" onClick={() => setIsServicePickerOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              {["seo", "social", "order", "other"].map((val) => (
                <button key={val} type="button" onClick={() => { handleServiceChange(val); setIsServicePickerOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground">
                  {serviceLabels[val]}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ContactInfo = () => {
  const contactDetails = [
    { icon: <Phone className="h-8 w-8 text-accent" />, title: "Call Us Now", details: ["+60-111-1335119", "Mon-Fri: 9AM - 6PM"] },
    { icon: <Mail className="h-8 w-8 text-accent" />, title: "Email Us", details: ["sales@leadzap.com.my", "Response within 4 hours"] },
  ];

  return (
    <div className="py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">Prefer to Talk to a Human?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">No bots. No runaround. Real strategists who understand your business.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
          {contactDetails.map((item, index) => (
            <motion.div key={index} className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className="flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-center text-accent">{item.title}</h3>
              <div className="text-muted-foreground text-center">
                {item.details.map((detail, detailIndex) => (<p key={detailIndex}>{detail}</p>))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.04181970438!2d-122.43523211165136!3d37.75790247804089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen title="Office Location"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
