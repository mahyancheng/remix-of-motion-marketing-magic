import { 
  Search, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Lightbulb,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react';
import { ProposalData } from '@/types/proposal';

interface MarketResearchSectionProps {
  data: ProposalData;
}

export const MarketResearchSection = ({ data }: MarketResearchSectionProps) => {
  const research = data.marketResearch;
  
  if (!research) {
    return null;
  }

  const sections = [
    {
      title: 'Industry Overview',
      icon: BarChart3,
      content: research.industryOverview,
      colorClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Market Size & Potential',
      icon: Target,
      content: research.marketSize,
      colorClass: 'bg-green-500/10 border-green-500/30 text-green-400',
    },
  ];

  return (
    <section className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
            <Search className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Market Research</h3>
            <p className="text-sm text-muted-foreground mt-1">Deep-dive analysis of your market and competitive landscape</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className={`rounded-2xl border p-6 ${section.colorClass}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-current/10 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-foreground">{section.title}</h4>
              </div>
              <p className="text-foreground/90 leading-relaxed">{section.content}</p>
            </div>
          );
        })}
      </div>

      {/* Trends */}
      {research.trends && research.trends.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-accent/10 p-2">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-display font-bold text-foreground">Market Trends</h4>
          </div>
          <ul className="space-y-3">
            {research.trends.map((trend, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {index + 1}
                </span>
                <span className="text-foreground/90">{trend}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Competitor Insights */}
      {research.competitorInsights && research.competitorInsights.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-orange-500/10 p-2">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <h4 className="font-display font-bold text-foreground">Competitor Insights</h4>
          </div>
          <ul className="space-y-3">
            {research.competitorInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <span className="text-foreground/90">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Opportunities & Threats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Opportunities */}
        {research.opportunities && research.opportunities.length > 0 && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-green-500/10 p-2">
                <Sparkles className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="font-display font-bold text-foreground">Opportunities</h4>
            </div>
            <ul className="space-y-2">
              {research.opportunities.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground/90">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Threats */}
        {research.threats && research.threats.length > 0 && (
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-orange-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <h4 className="font-display font-bold text-foreground">Threats & Challenges</h4>
            </div>
            <ul className="space-y-2">
              {research.threats.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground/90">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {research.recommendations && research.recommendations.length > 0 && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-accent/10 p-2">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-display font-bold text-foreground">Strategic Recommendations</h4>
          </div>
          <ul className="space-y-3">
            {research.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full accent-gradient text-xs font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <span className="text-foreground/90">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
