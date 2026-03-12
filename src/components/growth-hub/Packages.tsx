import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Crown } from "lucide-react";

const packages = [
  {
    name: "Google Ads + SEO",
    price: "2,400",
    currency: "RM",
    period: "/month",
    description: "Complete search marketing solution for leads and e-commerce",
    suggestedBudget: "RM 2,000/month (Google)",
    featured: true,
    features: [
      "Website creation + creative",
      "Google Ads (Search & Shopping)",
      "SEO management & optimisation",
      "Tracking & analytics setup",
      "Weekly campaign optimisation",
      "Monthly performance reports",
      "Strategy & positioning direction",
    ],
  },
  {
    name: "Social Media Paid Ads",
    price: "2,100",
    currency: "RM",
    period: "/month",
    description: "Content creation & paid ads for social platforms",
    suggestedBudget: "RM 2,000/month per platform",
    featured: false,
    features: [
      "Content creation & management",
      "Graphic design for ads & posts",
      "Photo/video production (planned)",
      "Ads strategy & implementation",
      "Retargeting setup",
      "Monthly performance reports",
      "+RM 300/month per extra platform",
    ],
  },
];

const Packages = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="packages" className="bg-background py-24">
      <div className="container px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Crown className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Packages</span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Packages sold annually with monthly instalments. Ad budgets are paid
            directly to platforms and are separate from management fees.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative overflow-hidden rounded-2xl border ${
                pkg.featured ? "border-accent shadow-glow" : "border-border shadow-card"
              } bg-card p-8 transition-all duration-300 hover:-translate-y-1`}
            >
              {pkg.featured && (
                <div className="absolute right-4 top-4">
                  <div className="rounded-full accent-gradient px-3 py-1 text-xs font-bold text-accent-foreground">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
                <p className="text-muted-foreground">{pkg.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">{pkg.currency}</span>
                  <span className="font-display text-5xl font-bold text-foreground">{pkg.price}</span>
                  <span className="text-muted-foreground">{pkg.period}</span>
                </div>
                <div className="mt-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                  Suggested ad budget: {pkg.suggestedBudget}
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.featured ? "accent" : "outline"}
                size="lg"
                className="w-full"
                onClick={scrollToCalculator}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Typical benchmark:</span>{" "}
            Website conversion rate is often 2-3% (varies by industry). We use 2.5%
            for planning safety.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Packages;