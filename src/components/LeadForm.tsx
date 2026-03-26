import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown, X, Flame } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import PhoneInput from "@/components/PhoneInput";

const serviceLabels: Record<string, string> = {
  "": "Select a Service",
  seo: "SEO — I'm invisible on Google",
  social: "Social Media Ads — I need leads NOW",
  order: "Custom Software — I need to automate",
  other: "Other — Let's talk",
};

interface LeadFormProps {
  heading?: string;
  subheading?: string;
  defaultService?: string;
}

const LeadForm = ({
  heading = "Tell Us What's Broken",
  subheading = "We'll tell you exactly how to fix it — for free. No obligations.",
  defaultService = "",
}: LeadFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", service: defaultService, message: "",
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
    setIsServicePickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      );
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Error sending form:", err);
    }

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", service: defaultService, message: "" });
    }, 3000);
  };

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-card border border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-6 md:p-10">
            <h2 className="text-xl md:text-3xl font-bold font-display mb-2 md:mb-4 text-foreground">{heading}</h2>
            <p className="text-sm text-muted-foreground mb-6">{subheading}</p>

            {submitted ? (
              <motion.div className="bg-green-800/30 border border-green-600 rounded-lg p-6 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">We're On It!</h3>
                <p className="text-muted-foreground text-sm md:text-base">Expect a response within 4 hours. Your competitors should be worried.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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
                    <PhoneInput id="phone" value={formData.phone} onChange={handlePhoneChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                  <input type="text" id="company" value={formData.company} onChange={handleChange} placeholder="Your Company"
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm" />
                </div>

                {/* Mobile service picker */}
                <div className="md:hidden">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">What's Your Biggest Problem?</label>
                  <button type="button" onClick={() => setIsServicePickerOpen(true)}
                    className="w-full bg-muted text-foreground px-3 py-2.5 rounded-md border border-border flex items-center justify-between text-sm">
                    <span>{serviceLabels[formData.service] ?? "Select a Service"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                {/* Desktop service picker */}
                <div className="hidden md:block">
                  <label htmlFor="service" className="block text-sm font-medium text-muted-foreground mb-1">What's Your Biggest Problem?</label>
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
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">Tell Us About Your Project</label>
                  <textarea id="message" rows={4} required value={formData.message} onChange={handleChange}
                    placeholder="What processes do you want to automate? What's slowing your team down?"
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm" />
                </div>

                <Cover variant="button">
                  <button type="submit" className="w-full accent-gradient text-accent-foreground px-4 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-center gap-2">
                    <Flame className="h-5 w-5" />
                    Get My Free Quote
                  </button>
                </Cover>
                <p className="text-xs text-center text-muted-foreground">Free. No credit card. Response within 4 hours.</p>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {isServicePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 md:hidden">
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground">What's Your Biggest Problem?</h3>
              <button type="button" className="text-muted-foreground" onClick={() => setIsServicePickerOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              {["seo", "social", "order", "other"].map((val) => (
                <button key={val} type="button" onClick={() => handleServiceChange(val)}
                  className="w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground">
                  {serviceLabels[val]}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default LeadForm;