import { Target, BarChart3, Zap, RefreshCw } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Target,
    title: 'Multi-Channel Approach',
    description: 'Integrate SEO, Paid Ads, and Social Media for comprehensive market coverage.',
  },
  {
    number: 2,
    icon: BarChart3,
    title: 'Data Collection & Analysis',
    description: 'Gather comprehensive data from all channels to optimize performance and identify opportunities.',
  },
  {
    number: 3,
    icon: Zap,
    title: 'Traffic & Lead Generation',
    description: 'Convert optimized campaigns into qualified traffic and high-quality leads through CRM integration.',
  },
  {
    number: 4,
    icon: RefreshCw,
    title: 'Continuous Optimization',
    description: 'Maintain feedback loop to client, ensuring ongoing improvement and measurable results.',
  },
];

export const StrategicProcess = () => (
  <section className="space-y-6">
    <div className="text-center mb-8">
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        Our Strategic Marketing Process
      </h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Our systematic approach ensures every campaign is data-driven, results-focused, 
        and continuously optimized for maximum impact.
      </p>
    </div>

    {/* Process Flow Visualization */}
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Digital Marketing</span>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            {['SEO', 'Paid Ads', 'Social Media'].map((channel) => (
              <span key={channel} className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                {channel}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-px w-8 bg-border hidden md:block" />
          <span className="text-xs">Traffic</span>
          <div className="h-px w-4 bg-border" />
          <span className="text-xs">Leads</span>
          <div className="h-px w-4 bg-border" />
          <span className="text-xs">Distribution</span>
          <div className="h-px w-8 bg-border hidden md:block" />
        </div>
        <div className="flex gap-2">
          {['Website', 'CRM', 'Sales Team'].map((step) => (
            <span key={step} className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {step}
            </span>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground italic">
        Data collected to be analyzed and optimize ads → Reach back to client
      </div>
    </div>

    {/* Steps Grid */}
    <div className="grid gap-4 md:grid-cols-2">
      {steps.map((step) => (
        <div key={step.number} className="rounded-xl border border-border bg-card p-5 card-glow transition-all hover:border-accent/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg accent-gradient font-display font-bold text-accent-foreground">
                {step.number}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <step.icon className="h-4 w-4 text-accent" />
                <h4 className="font-display font-bold text-accent">{step.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
