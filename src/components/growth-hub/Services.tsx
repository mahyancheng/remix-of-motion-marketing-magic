import { Search, BarChart3, Share2, Globe, Target, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Google Ads",
    description:
      "Performance-driven campaigns capturing demand from people ready to buy. Search & Shopping ads optimised for sales and leads.",
    features: ["Keyword research & strategy", "Conversion tracking", "Weekly optimisation", "ROI focused"],
  },
  {
    icon: Globe,
    title: "SEO Management",
    description:
      "Build long-term organic traffic with optimised website structure, content, and visibility for high-intent keywords.",
    features: ["Technical SEO audit", "On-page optimisation", "Content strategy", "Monthly rankings report"],
  },
  {
    icon: Share2,
    title: "Social Media Ads",
    description:
      "Reach your ideal customers on Facebook, Instagram, TikTok & more with creative-led performance campaigns.",
    features: ["Content creation", "Ad creative production", "Retargeting setup", "Multi-platform management"],
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-background py-24">
      <div className="container px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Services</span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            One-Stop Digital Marketing
          </h2>
          <p className="text-lg text-muted-foreground">
            We handle website/landing pages, creatives, ads setup, tracking, and
            optimisation under one plan. No need for multiple vendors.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="h-7 w-7" />
              </div>

              <h3 className="mb-3 font-display text-xl font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mb-6 text-muted-foreground">{service.description}</p>

              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary p-8 text-center md:p-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              KPI Focus: Leads & E-commerce Sales
            </h3>
            <p className="text-primary-foreground/70">
              Everything we do is measured against leads (calls/WhatsApp/forms) or
              e-commerce purchases, plus cost per lead / cost per purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;