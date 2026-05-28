import { Zap, TrendingUp, Share2, Search, BarChart3, Users } from 'lucide-react';

export const PushPullFramework = () => (
  <section className="space-y-6">
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-accent mb-4">
        <Zap className="h-4 w-4" />
        <span className="text-sm font-semibold">Our Proprietary Framework</span>
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        Push-Pull Marketing Framework
      </h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Our proprietary framework creates a connected ecosystem where push data feeds into pull marketing 
        (e.g., retargeting), while pull data is used to improve push campaigns.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {/* PUSH Strategy */}
      <div className="relative rounded-2xl border border-border bg-card p-6 card-glow">
        <div className="absolute -top-3 left-6">
          <span className="rounded-full accent-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground">
            PUSH
          </span>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Share2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Active Promotion</h4>
              <p className="text-sm text-muted-foreground">
                Strategically push your brand through paid advertising campaigns
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Facebook, Instagram & TikTok advertising
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Influencer marketing campaigns
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Retargeting with pull data insights
            </li>
          </ul>
          <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground italic">
            Push data feeds into pull marketing for enhanced retargeting
          </div>
        </div>
      </div>

      {/* PULL Strategy */}
      <div className="relative rounded-2xl border border-border bg-card p-6 card-glow">
        <div className="absolute -top-3 left-6">
          <span className="rounded-full accent-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground">
            PULL
          </span>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Organic Discovery</h4>
              <p className="text-sm text-muted-foreground">
                Naturally attract users through search engines and organic channels
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              SEO audit Malaysia & local optimization
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Content marketing & authority building
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Data feeds into push advertising
            </li>
          </ul>
          <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground italic">
            Pull data improves push campaigns with targeted audiences
          </div>
        </div>
      </div>
    </div>

    {/* Connection Arrow */}
    <div className="flex justify-center">
      <div className="flex items-center gap-2 rounded-full bg-secondary px-6 py-2">
        <TrendingUp className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-foreground">Data-Driven Synergy</span>
        <TrendingUp className="h-4 w-4 text-accent rotate-180" />
      </div>
    </div>
  </section>
);
