import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Cover } from "@/components/ui/cover";

const CTA = () => {
  return (
    <section className="bg-background py-24">
      <div className="container px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Drive <Cover>Measurable Growth</Cover>?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/70 md:text-xl">
              Let's discuss your business goals and create a tailored digital
              marketing strategy that delivers results.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Cover variant="button">
                <Button variant="hero" size="xl">
                  Get Your Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Cover>
              <Button
                variant="hero-outline"
                size="xl"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Quick Response</span>
              </div>
              <div className="h-4 w-px bg-primary-foreground/20" />
              <span>No Commitment Required</span>
              <div className="h-4 w-px bg-primary-foreground/20" />
              <span>Free Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;