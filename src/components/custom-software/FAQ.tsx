import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-6 text-center text-foreground">
          Questions We Get Asked Every Week
        </h2>

        <Accordion
          type="single"
          collapsible
          className="w-full max-w-md md:max-w-3xl mx-auto space-y-1"
        >
          <AccordionItem value="q1" className="border-border">
            <AccordionTrigger className="hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground">
              "How much does custom software cost?"
            </AccordionTrigger>
            <AccordionContent className="text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              It depends on complexity, but here's the truth: custom software costs less than you think when you factor in the cost of NOT having it. Manual errors, wasted hours, lost leads — those are the real expenses. We offer flexible pricing and can start with an MVP to prove ROI before scaling.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2" className="border-border">
            <AccordionTrigger className="hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground">
              "How long does it take to build?"
            </AccordionTrigger>
            <AccordionContent className="text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Most MVPs launch in 6-8 weeks. Full systems take 3-6 months. But here's the key: every week you delay, your competitor with automated systems gets further ahead. We can start with a prototype in 2 weeks so you see progress immediately.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3" className="border-border">
            <AccordionTrigger className="hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground">
              "What if I already use off-the-shelf software?"
            </AccordionTrigger>
            <AccordionContent className="text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              We integrate with everything — your existing CRM, ERP, accounting software, payment gateways. You don't have to rip and replace. We build systems that connect your existing tools and fill the gaps.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4" className="border-border">
            <AccordionTrigger className="hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground">
              "Are you really a software company in Malaysia?"
            </AccordionTrigger>
            <AccordionContent className="text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Yes. We're based in Malaysia, we understand Malaysian business workflows, local compliance, and we communicate in your timezone. No offshore guessing games.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5" className="border-border">
            <AccordionTrigger className="hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground">
              "What happens after launch?"
            </AccordionTrigger>
            <AccordionContent className="text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              We don't disappear. We provide ongoing support, monitoring, and optimization. As your business grows, your software grows with it. Think of us as your long-term technology partner, not a one-time vendor.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
