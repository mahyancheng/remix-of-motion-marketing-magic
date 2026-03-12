import { Settings, Rocket, TrendingUp, CheckCircle } from "lucide-react";

const phases = [
  {
    icon: Settings,
    phase: "Phase 1",
    title: "Foundation",
    duration: "Week 1-2",
    items: [
      "Tracking & analytics setup",
      "Landing page/website creation",
      "Creative + ad copy development",
      "Account structure planning",
    ],
  },
  {
    icon: Rocket,
    phase: "Phase 2",
    title: "Launch & Learning",
    duration: "Week 3-4",
    items: [
      "Testing keywords/audiences",
      "Multiple ad variations",
      "Early lead quality checks",
      "Weekly optimisations",
    ],
  },
  {
    icon: TrendingUp,
    phase: "Phase 3",
    title: "Optimise & Scale",
    duration: "Month 2-3+",
    items: [
      "Lower CPL over time",
      "Scale winning campaigns",
      "Add retargeting layers",
      "SEO content execution",
    ],
  },
];

const DeliveryModel = () => {
  return (
    <section id="delivery" className="bg-secondary/30 py-24">
      <div className="container px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Rocket className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">How We Work</span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Our 3-Phase Delivery Model
          </h2>
          <p className="text-lg text-muted-foreground">
            A structured approach that ensures we build strong foundations before
            scaling for maximum ROI.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent/50 to-accent/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {phases.map((phase) => (
              <div key={phase.title} className="relative rounded-2xl border border-border bg-card p-8 shadow-card">
                <div className="absolute -top-4 left-8 lg:left-1/2 lg:-translate-x-1/2">
                  <div className="flex h-8 items-center gap-2 rounded-full accent-gradient px-4 text-sm font-bold text-accent-foreground shadow-glow">
                    <phase.icon className="h-4 w-4" />
                    {phase.phase}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 text-sm font-medium text-accent">{phase.duration}</div>
                  <h3 className="mb-4 font-display text-2xl font-bold text-foreground">{phase.title}</h3>
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">SEO Timeline:</span>{" "}
            Month 1 foundation → Month 2-3 early movement → Month 4-6 stronger
            rankings → Month 6-12 compounding growth (varies by competition)
          </p>
        </div>
      </div>
    </section>
  );
};

export default DeliveryModel;