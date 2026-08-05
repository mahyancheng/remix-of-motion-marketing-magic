import { useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import { m } from "framer-motion";
import { Navbar } from "./Index";
import { Phone, Mail, MessageCircle, CheckCircle, ChevronDown, X, Flame, MapPin } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import PhoneInput from "../components/PhoneInput";
import Footer from "./Footer";
import SEO from "@/components/SEO";
import { getContactSchema } from "@/lib/schema";
// ✅ 修改1: 删除未使用的 PageBreadcrumb import

// ==========================================
// 静态配置数据
// ==========================================

const SERVICE_LABELS: Record<string, string> = {
  "": "Select a Service",
  seo: "SEO — I'm invisible on Google",
  social: "Social Media Ads — I need leads NOW",
  order: "Custom Software — I need to automate",
  other: "Other — Let's talk",
};

const MOBILE_SERVICE_OPTIONS = ["seo", "social", "order", "other"];

// ✅ 修改2: Hero 内容改成包含关键词的版本
const HERO_ROTATING_WORDS = ["Digital Marketing Agency", "SEO Experts", "Google Ads Specialists", "Marketing Team"];
const HERO_PRIMARY_CTA = { label: "Get My Free Consultation", href: "/contact/" };
const HERO_SECONDARY_CTA = { label: "See Our Results", href: "/corporate-profile/" };

// ✅ 修改3: 加入 WhatsApp 联系方式
const CONTACT_DETAILS_DATA = [
  {
    icon: <Phone className="h-8 w-8 text-accent" />,
    title: "Call Us Now",
    details: ["+60-111-1335119", "Mon-Fri: 9AM - 6PM"],
    link: "tel:+601111335119"
  },
  {
    icon: <Mail className="h-8 w-8 text-accent" />,
    title: "Email Us",
    details: ["sales@leadzap.com.my", "Response within 4 hours"],
    link: "mailto:sales@leadzap.com.my"
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-accent" />,
    title: "WhatsApp Us",
    details: ["+60-111-1335119", "Quick response via WhatsApp"],
    link: "https://wa.me/601111335119"
  },
  {
    icon: <MapPin className="h-8 w-8 text-accent" />,
    title: "Visit Us",
    details: ["16-1, Jln SS19/6, SS 19", "47500 Subang Jaya, Selangor"],
    link: "https://www.google.com/maps/search/?api=1&query=Leadzap+Marketing+Sdn+Bhd"
  },
];

// ==========================================

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false); // ✅ 修改4: 加入错误状态
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
    setSubmitError(false);
    const submissionData = {
      ...formData,
      submittedAt: new Date().toLocaleString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        hour12: true
      }),
    };
    try {
      const res = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // ✅ 发送包含时间戳的数据包
          body: JSON.stringify(submissionData)
        }
      );
      if (res.ok) {
        setSubmitted(true);
        // ✅ 修改5: 成功后 6 秒才重置，给用户足够时间看到成功信息
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
        }, 6000);
      } else {
        // ✅ 修改6: 提交失败显示错误提示给用户
        setSubmitError(true);
      }
    } catch (err) {
      setSubmitError(true);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ✅ 修改9: Title 缩短到65字符，去掉 "Contact Us" */}
      <SEO
        title="Contact LeadZap | Get an SEO Quote"
        description="Contact Leadzap Marketing, a top digital marketing agency in Malaysia, for SEO, Google Ads, social media marketing and digital growth solutions."
        path="/contact/"
        schema={getContactSchema()}
      />
      <Navbar />
      <Hero />
      <ContactForm
        submitted={submitted}
        submitError={submitError}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        handleServiceChange={handleServiceChange}
      />
      <ContactInfo />
      <Footer />
    </div>
  );
};

const Hero = () => (
  <header className="hero-gradient relative overflow-hidden">
    <HeroBackground />
    <div className="relative z-10">
      <AnimatedHero
        badge="Contact Us - Free SEO Analysis Malaysia"
        titlePrefix="Contact Malaysia's Top"
        rotatingWords={HERO_ROTATING_WORDS}
        description="Get free SEO analysis Malaysia, social media marketing Malaysia consultation, or custom software quotes. No sales pitch — just honest answers about what's costing you customers."
        primaryCTA={HERO_PRIMARY_CTA}
        secondaryCTA={HERO_SECONDARY_CTA}
        breadcrumbs={[{ label: "Contact Us" }]}
      />
    </div>
  </header>
);

const ContactForm = ({
  submitted, submitError, onSubmit, formData, handleChange, handlePhoneChange, handleServiceChange
}: {
  submitted: boolean;
  submitError: boolean; // ✅ 修改12: 加入 submitError prop
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handlePhoneChange: (value: string) => void;
  handleServiceChange: (value: string) => void;
}) => {
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  // ✅ 修改13: 删除未使用的 handleMobileServiceSelect

  return (
    <div className="py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <m.div
          className="max-w-xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-card border border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-6 md:p-10">
            {/* ✅ 修改14: H2 改成包含关键词的正面表达 */}
            <h2 className="text-xl md:text-3xl font-bold font-display mb-2 md:mb-4 text-foreground">
              Get Your Free Digital Marketing Consultation
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us about your business and we'll show you exactly how to grow — for free. No obligations.
            </p>

            {submitted ? (
              <m.div
                className="bg-green-800/30 border border-green-600 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">We're On It!</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Expect a response within 4 hours. Our team will reach out to discuss your free consultation.
                </p>
              </m.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">

                {/* ✅ 修改15: 提交失败时显示错误提示 */}
                {submitError && (
                  <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4 text-center">
                    <p className="text-red-400 text-sm">
                      Something went wrong. Please try again or contact us directly at{" "}
                      <a href="mailto:sales@leadzap.com.my" className="underline">sales@leadzap.com.my</a>
                    </p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text" id="name" required
                      value={formData.name} onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email" id="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <div className="w-full bg-muted rounded-md border border-border px-2 py-1.5">
                    <PhoneInput id="phone" value={formData.phone} onChange={handlePhoneChange} />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Company Name
                  </label>
                  <input
                    type="text" id="company"
                    value={formData.company} onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                  />
                </div>

                {/* 手机端服务选择器 */}
                <div className="md:hidden">
                  <label className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    What Service Do You Need?
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsServicePickerOpen(true)}
                    className="w-full bg-muted text-foreground px-3 py-2.5 rounded-md border border-border flex items-center justify-between text-sm outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors"
                  >
                    <span>{SERVICE_LABELS[formData.service] ?? "Select a Service"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* 桌面端服务下拉 */}
                <div className="hidden md:block">
                  <label htmlFor="service" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    What Service Do You Need?
                  </label>
                  <select
                    id="service"
                    value={formData.service} onChange={handleChange}
                    className="w-full bg-muted text-foreground px-4 py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm md:text-base"
                  >
                    <option value="">Select a Service</option>
                    <option value="seo">SEO — I'm invisible on Google</option>
                    <option value="social">Social Media Ads — I need leads NOW</option>
                    <option value="order">Custom Software — I need to automate</option>
                    <option value="other">Other — Let's talk</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted-foreground mb-1">
                    Tell Us About Your Business *
                  </label>
                  <textarea
                    id="message" rows={4} required
                    value={formData.message} onChange={handleChange}
                    placeholder="What are your main marketing challenges? Lost leads? Wasted ad spend? Manual processes? We've heard it all — and fixed it all."
                    className="w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                  />
                </div>

                <Cover variant="button">
                  <button
                    type="submit"
                    className="w-full accent-gradient text-accent-foreground px-4 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <Flame className="h-5 w-5" />
                    Get My Free Consultation
                  </button>
                </Cover>

                <p className="text-xs text-center text-muted-foreground">
                  Free. No credit card. Response within 4 hours.
                </p>
              </form>
            )}
          </div>
        </m.div>
      </div>

      {/* 手机端服务选择弹出层 */}
      {isServicePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 md:hidden">
          <m.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground">What Service Do You Need?</h3>
              <button type="button" className="text-muted-foreground" onClick={() => setIsServicePickerOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {MOBILE_SERVICE_OPTIONS.map((val) => (
                <button
                  key={val} type="button"
                  // ✅ 修改16: 直接用内联函数，删除多余的 handleMobileServiceSelect
                  onClick={() => { handleServiceChange(val); setIsServicePickerOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground"
                >
                  {SERVICE_LABELS[val]}
                </button>
              ))}
            </div>
          </m.div>
        </div>
      )}
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className="py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
            Prefer to Reach Us Directly?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            No bots. No runaround. Real digital marketing strategists who understand Malaysian businesses.
          </p>
        </m.div>

        {/* ✅ 修改17: 3列布局加入 WhatsApp，卡片加点击链接 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {CONTACT_DETAILS_DATA.map((item, index) => (
            <m.a
              key={index}
              href={item.link}
              target={item.link.startsWith('http') ? '_blank' : undefined}
              rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-center text-accent">{item.title}</h3>
              <div className="text-muted-foreground text-center">
                {item.details.map((detail, detailIndex) => (
                  <p key={detailIndex}>{detail}</p>
                ))}
              </div>
            </m.a>
          ))}
        </div>

        {/* Google Maps */}
        <m.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7968.220928114995!2d101.57687007531642!3d3.065133353662673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4d8ca7d43a6f%3A0xf969dd3aaa08482c!2sLeadzap%20Marketing%20Sdn%20Bhd!5e0!3m2!1sen!2smy!4v1781144580110!5m2!1sen!2smy"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Leadzap Marketing Office Location - Subang Jaya, Selangor"
            />
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default Contact;