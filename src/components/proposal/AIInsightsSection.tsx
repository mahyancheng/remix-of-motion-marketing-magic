import { useState } from 'react';
import { 
  MessageSquare, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'observation' | 'warning' | 'opportunity';
  title: string;
  content: string;
  imageUrl?: string;
}

interface AIInsightsSectionProps {
  insights: AIInsight[];
  manualNotes?: string;
  onNotesChange?: (notes: string) => void;
  isEditable?: boolean;
}

const getInsightIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'suggestion': return Lightbulb;
    case 'observation': return MessageSquare;
    case 'warning': return AlertCircle;
    case 'opportunity': return TrendingUp;
    default: return Lightbulb;
  }
};

const getInsightColor = (type: AIInsight['type']) => {
  switch (type) {
    case 'suggestion': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    case 'observation': return 'bg-accent/10 border-accent/30 text-accent';
    case 'warning': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    case 'opportunity': return 'bg-green-500/10 border-green-500/30 text-green-400';
    default: return 'bg-accent/10 border-accent/30 text-accent';
  }
};

const InsightCard = ({ insight }: { insight: AIInsight }) => {
  const Icon = getInsightIcon(insight.type);
  const colorClass = getInsightColor(insight.type);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`rounded-2xl border p-6 ${colorClass}`}>
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-current/10 p-2">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
              {insight.type}
            </span>
            <h4 className="font-display font-bold text-foreground mt-1">{insight.title}</h4>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pl-14 space-y-4">
          <p className="text-foreground/90 leading-relaxed">{insight.content}</p>
          {insight.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img 
                src={insight.imageUrl} 
                alt={insight.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AIInsightsSection = ({ 
  insights, 
  manualNotes = '', 
  onNotesChange,
  isEditable = false 
}: AIInsightsSectionProps) => {
  return (
    <section className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Insights & Recommendations</h3>
            <p className="text-sm text-muted-foreground mt-1">Personalized analysis from our discovery conversation</p>
          </div>
        </div>
      </div>

      {/* AI Generated Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Manual Notes Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-secondary p-2">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <h4 className="font-display font-bold text-foreground">Additional Notes</h4>
        </div>
        
        {isEditable ? (
          <textarea
            value={manualNotes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Add any additional observations, suggestions, or custom notes here..."
            className="w-full min-h-[150px] rounded-xl bg-secondary/50 border border-border p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
        ) : (
          <div className="rounded-xl bg-secondary/50 p-4 min-h-[80px]">
            {manualNotes ? (
              <p className="text-foreground whitespace-pre-wrap">{manualNotes}</p>
            ) : (
              <p className="text-muted-foreground italic">No additional notes</p>
            )}
          </div>
        )}
      </div>

      {/* Placeholder for future image/diagram uploads */}
      <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-xl bg-secondary p-4 mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="font-display font-semibold text-foreground mb-2">Visual Attachments</h4>
          <p className="text-sm text-muted-foreground max-w-md">
            Charts, competitor analysis screenshots, mockups, or any visual content 
            can be added here to support the proposal.
          </p>
        </div>
      </div>
    </section>
  );
};

// Default insights for demo/fallback
export const defaultAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High Growth Potential in Target Market',
    content: 'Based on your target location and ideal customer profile, there\'s significant untapped potential for lead generation through search marketing. Competitors in this space have an average CPL of RM 45-80, which aligns well with your budget allocation.'
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Recommended Channel Mix',
    content: 'Given your primary CTA and target audience, we recommend a 60/40 split between Google Ads (Search + Display) and Meta Ads (Facebook/Instagram). This allows for intent-capture and brand awareness simultaneously.'
  },
  {
    id: '3',
    type: 'observation',
    title: 'Competitive Landscape',
    content: 'Your differentiators provide strong positioning angles. We\'ll leverage these in ad copy and landing page messaging to stand out from competitors and improve conversion rates.'
  }
];
