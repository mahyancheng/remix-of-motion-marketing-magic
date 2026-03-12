import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What's included in the management fee?",
    answer: "Our management fee covers strategy & positioning, campaign setup, creatives, tracking setup, ongoing optimisation, and monthly reporting. For Google Ads + SEO, this also includes website/landing page creation. Ad budgets are paid separately directly to platforms.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Paid ads (Google & Social) typically show initial results within 2-4 weeks. SEO is a longer-term play: expect early movements in Month 2-3, stronger rankings by Month 4-6, and compounding growth from Month 6-12. Results vary based on competition and industry.",
  },
  {
    question: "What's the typical conversion rate?",
    answer: "Industry benchmark for website conversion is typically 2-3%. We use 2.5% for conservative planning. Your actual rate depends on factors like offer strength, landing page quality, and lead quality. We continuously optimise to improve this.",
  },
  {
    question: "Why annual contracts with monthly payments?",
    answer: "Marketing requires time to optimise and compound. Annual commitments allow us to build proper foundations, test strategies, and scale what works. Monthly instalments make it budget-friendly while ensuring long-term partnership for best results.",
  },
  {
    question: "How much ad budget should I allocate?",
    answer: "We recommend at least RM 2,000/month per platform for meaningful results. Use our budget calculator to estimate based on your revenue goals. Marketing budget is typically 15% of revenue for normal industries, 25% for highly competitive ones.",
  },
  {
    question: "What KPIs do you track and report?",
    answer: "Primary KPIs are leads (calls/WhatsApp/forms) or e-commerce sales. Secondary metrics include Cost Per Lead (CPL), Cost Per Acquisition (CPA), conversion rate, lead quality, and ROAS for e-commerce. You'll receive monthly reports with clear insights.",
  },
  {
    question: "Can I add more social media platforms later?",
    answer: "Yes! Each additional social platform is +RM 300/month management fee, plus we recommend RM 2,000/month ad budget per platform. We can expand your campaigns as your business grows.",
  },
  {
    question: "What access do you need from me?",
    answer: "We'll need Google Ads/GA4/Tag Manager access (or we create fresh accounts), website CMS access, Google Business Profile, and relevant social media ad account access. We'll also collect brand assets, product info, and testimonials during onboarding.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-secondary/30 py-24">
      <div className="container px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <HelpCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">FAQ</span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about working with us.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="overflow-hidden rounded-xl border border-border bg-card px-6 shadow-soft"
              >
                <AccordionTrigger className="py-5 text-left font-display font-semibold text-foreground hover:no-underline [&[data-state=open]>svg]:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;