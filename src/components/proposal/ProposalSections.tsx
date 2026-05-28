import { ProposalData } from '@/types/proposal';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  FileText, 
  CreditCard,
  Award,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

// Section Title Component - Enhanced
export const SectionTitle = ({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
        {number}
      </span>
      <div>
        <h3 className="font-display text-2xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// Enhanced Visual Info Card
export const VisualInfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  highlight = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  highlight?: boolean;
}) => (
  <div className={`rounded-2xl border p-6 transition-all ${highlight ? 'border-accent bg-accent/10 card-glow' : 'border-border bg-card'}`}>
    <div className="flex items-start gap-4">
      <div className={`rounded-xl p-3 ${highlight ? 'accent-gradient' : 'bg-secondary'}`}>
        <Icon className={`h-6 w-6 ${highlight ? 'text-accent-foreground' : 'text-accent'}`} />
      </div>
      <div className="flex-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <p className={`mt-1 text-lg font-bold ${highlight ? 'text-accent' : 'text-foreground'}`}>{value}</p>
      </div>
    </div>
  </div>
);

// Metric Card with visual indicator
export const MetricCard = ({ 
  label, 
  value, 
  subValue,
  icon: Icon,
  progress 
}: { 
  label: string; 
  value: string;
  subValue?: string;
  icon: React.ElementType;
  progress?: number;
}) => (
  <div className="rounded-2xl border border-border bg-card p-6 card-glow">
    <div className="flex items-center justify-between mb-4">
      <div className="rounded-xl bg-accent/10 p-3">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      {progress !== undefined && (
        <span className="text-xs font-semibold text-accent">{progress}%</span>
      )}
    </div>
    <div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <span className="text-sm text-muted-foreground">{label}</span>
      {subValue && <p className="text-xs text-accent mt-1">{subValue}</p>}
    </div>
    {progress !== undefined && (
      <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
        <div 
          className="h-full rounded-full accent-gradient transition-all duration-500" 
          style={{ width: `${Math.min(progress, 100)}%` }} 
        />
      </div>
    )}
  </div>
);

// Malaysia Map SVG Background Component
export const MalaysiaMapBackground = () => (
  <svg
    viewBox="0 0 800 400"
    className="absolute inset-0 w-full h-full opacity-10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    {/* Simplified Malaysia outline - Peninsular */}
    <path
      d="M180 100 L220 80 L280 90 L320 120 L340 180 L320 240 L280 280 L240 300 L200 280 L160 240 L140 180 L160 140 Z"
      className="fill-accent/20 stroke-accent/40"
    />
    {/* Borneo (Sabah & Sarawak) */}
    <path
      d="M450 120 L520 100 L600 110 L680 140 L700 200 L680 260 L620 280 L540 270 L480 240 L450 180 Z"
      className="fill-accent/20 stroke-accent/40"
    />
    {/* City markers */}
    <circle cx="220" cy="160" r="6" className="fill-accent" />
    <circle cx="260" cy="220" r="4" className="fill-accent/60" />
    <circle cx="540" cy="180" r="4" className="fill-accent/60" />
    <circle cx="620" cy="160" r="4" className="fill-accent/60" />
  </svg>
);

// Target Market Section with Map
interface TargetMarketProps {
  location: string;
  icp: string;
}

export const TargetMarketVisual = ({ location, icp }: TargetMarketProps) => (
  <div className="relative rounded-2xl border border-border bg-card overflow-hidden p-8 min-h-[280px]">
    <MalaysiaMapBackground />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl accent-gradient p-3">
          <MapPin className="h-6 w-6 text-accent-foreground" />
        </div>
        <h4 className="font-display text-xl font-bold text-foreground">Target Market</h4>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-background/80 backdrop-blur-sm border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Location</span>
          </div>
          <p className="text-xl font-bold text-foreground">{location || '—'}</p>
        </div>
        <div className="rounded-xl bg-background/80 backdrop-blur-sm border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Ideal Customer</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{icp || '—'}</p>
        </div>
      </div>
    </div>
  </div>
);

// Executive Summary Section - Enhanced
interface ExecutiveSummaryProps {
  data: ProposalData;
  formatDate: (dateStr: string) => string;
}

export const ExecutiveSummary = ({ data, formatDate }: ExecutiveSummaryProps) => {
  const getCTAIcon = () => {
    switch (data.cta) {
      case 'whatsapp': return MessageSquare;
      case 'call': return Phone;
      case 'form': return FileText;
      case 'checkout': return CreditCard;
      default: return Phone;
    }
  };

  return (
    <section className="space-y-8">
      <SectionTitle 
        number="1" 
        title="Executive Summary" 
        subtitle="Your campaign objectives at a glance"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <VisualInfoCard 
          icon={Target}
          label="Primary Goal"
          value={data.kpiType === 'leads' ? 'Lead Generation' : 'E-commerce Sales'}
          highlight
        />
        <VisualInfoCard 
          icon={TrendingUp}
          label="KPI Target"
          value={data.kpiTarget || 'To be defined'}
        />
      </div>

      {/* Target Market with Map */}
      <TargetMarketVisual location={data.targetLocation} icp={data.icp} />

      <div className="grid gap-6 md:grid-cols-2">
        <VisualInfoCard 
          icon={Calendar}
          label="Proposed Start Date"
          value={data.startDate ? formatDate(data.startDate) : 'To be confirmed'}
        />
        <VisualInfoCard 
          icon={getCTAIcon()}
          label="Primary Call-to-Action"
          value={data.cta.charAt(0).toUpperCase() + data.cta.slice(1)}
        />
      </div>
    </section>
  );
};

// Business Context Section - Enhanced
interface BusinessContextProps {
  data: ProposalData;
  formatCurrency: (value: number) => string;
}

export const BusinessContext = ({ data, formatCurrency }: BusinessContextProps) => (
  <section className="space-y-8">
    <SectionTitle 
      number="2" 
      title="Business Context" 
      subtitle="Understanding your business landscape"
    />
    
    <div className="grid gap-6 md:grid-cols-2">
      <VisualInfoCard 
        icon={ShoppingCart}
        label="Product/Service"
        value={data.productService || '—'}
      />
      <VisualInfoCard 
        icon={DollarSign}
        label="Average Order Value"
        value={data.aov ? formatCurrency(data.aov) : '—'}
        highlight
      />
    </div>

    {data.differentiators.length > 0 && (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-accent/10 p-3">
            <Award className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-display font-bold text-foreground">Unique Differentiators</h4>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {data.differentiators.map((d, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{d}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </section>
);

// Strategy & Positioning Section - Enhanced
interface StrategyPositioningProps {
  data: ProposalData;
}

export const StrategyPositioning = ({ data }: StrategyPositioningProps) => (
  <section className="space-y-8">
    <SectionTitle 
      number="3" 
      title="Strategy & Positioning" 
      subtitle="Your market differentiation approach"
    />
    
    {data.positioningOneLiner && (
      <div className="rounded-2xl border-2 border-accent bg-accent/5 p-8 card-glow">
        <div className="flex items-start gap-4">
          <div className="rounded-xl accent-gradient p-3">
            <Lightbulb className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <span className="text-sm font-medium text-accent">Positioning Statement</span>
            <p className="mt-2 text-xl font-bold text-foreground">{data.positioningOneLiner}</p>
          </div>
        </div>
      </div>
    )}
    
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <span className="text-sm text-muted-foreground">Primary Offer</span>
        <p className="mt-2 text-lg font-bold text-foreground">{data.primaryOffer || '—'}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <span className="text-sm text-muted-foreground">Core Promise</span>
        <p className="mt-2 text-lg font-bold text-foreground">{data.corePromise || '—'}</p>
      </div>
    </div>

    {data.messageAngles.length > 0 && (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h4 className="font-display font-bold text-foreground mb-4">Message Angles</h4>
        <div className="flex flex-wrap gap-3">
          {data.messageAngles.map((angle, i) => (
            <span key={i} className="rounded-full bg-accent/10 border border-accent/30 px-4 py-2 text-sm font-medium text-foreground">
              {angle}
            </span>
          ))}
        </div>
      </div>
    )}
  </section>
);

// Budget Section - Enhanced with Visual Flow
interface BudgetRecommendationProps {
  data: ProposalData;
  formatCurrency: (value: number) => string;
}

export const BudgetRecommendation = ({ data, formatCurrency }: BudgetRecommendationProps) => {
  const budgetPercentage = data.budgetRatio;
  
  return (
    <section className="space-y-8">
      <SectionTitle 
        number="5" 
        title="Budget Recommendation" 
        subtitle="Data-driven investment allocation"
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard 
          icon={TrendingUp}
          label="Target Revenue"
          value={formatCurrency(data.targetRevenue)}
          subValue="Monthly goal"
        />
        <MetricCard 
          icon={Users}
          label="Leads Needed"
          value={(data.leadsNeeded ?? 0).toLocaleString()}
          subValue={`At ${data.conversionRate}% conversion`}
        />
        <MetricCard 
          icon={DollarSign}
          label="Marketing Budget"
          value={formatCurrency(data.marketingBudget)}
          subValue={`${budgetPercentage}% of revenue`}
          progress={budgetPercentage}
        />
      </div>

      {/* Visual Budget Flow */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h4 className="font-display font-bold text-foreground mb-6 text-center">Budget Calculation Flow</h4>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-center">
            <div className="rounded-xl bg-secondary p-4 mb-2">
              <p className="font-display text-xl font-bold text-foreground">{formatCurrency(data.targetRevenue)}</p>
            </div>
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <span className="text-2xl text-muted-foreground">÷</span>
          <div className="text-center">
            <div className="rounded-xl bg-secondary p-4 mb-2">
              <p className="font-display text-xl font-bold text-foreground">{formatCurrency(data.aov)}</p>
            </div>
            <span className="text-xs text-muted-foreground">AOV</span>
          </div>
          <span className="text-2xl text-muted-foreground">=</span>
          <div className="text-center">
            <div className="rounded-xl bg-accent/20 p-4 mb-2">
              <p className="font-display text-xl font-bold text-accent">{data.conversionsNeeded}</p>
            </div>
            <span className="text-xs text-muted-foreground">Conversions</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="text-center">
            <div className="rounded-xl bg-accent/20 p-4 mb-2">
              <p className="font-display text-xl font-bold text-accent">{data.leadsNeeded ?? 0}</p>
            </div>
            <span className="text-xs text-muted-foreground">Leads</span>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-secondary/50 p-4 text-center">
          <span className="text-muted-foreground">Estimated CPL: </span>
          <span className="font-bold text-accent">{formatCurrency(data.estimatedCPL)}</span>
        </div>
      </div>
    </section>
  );
};

// Timeline Phase Component - Enhanced
export const TimelinePhase = ({ 
  phase, 
  title, 
  duration, 
  items,
  icon: Icon
}: { 
  phase: string; 
  title: string; 
  duration: string; 
  items: string[];
  icon: React.ElementType;
}) => (
  <div className="rounded-2xl border border-border bg-card p-6 card-glow relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 accent-gradient opacity-10 rounded-bl-full" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span className="rounded-full accent-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground">
          Phase {phase}
        </span>
        <span className="text-sm text-muted-foreground">{duration}</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-secondary p-2">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <h4 className="font-display text-lg font-bold text-foreground">{title}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="h-2 w-2 rounded-full bg-accent flex-shrink-0" />
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Implementation Timeline Section
import { Settings, Rocket, TrendingUp as Scale } from 'lucide-react';

export const ImplementationTimeline = () => (
  <section className="space-y-8">
    <SectionTitle 
      number="6" 
      title="Implementation Timeline" 
      subtitle="Your journey to marketing success"
    />
    <div className="grid gap-6 md:grid-cols-3">
      <TimelinePhase 
        phase="1" 
        title="Foundation" 
        duration="Week 1-2" 
        items={['Tracking & analytics setup', 'Website/landing page audit', 'Creative development', 'Account configuration']} 
        icon={Settings}
      />
      <TimelinePhase 
        phase="2" 
        title="Launch & Learn" 
        duration="Week 3-4" 
        items={['A/B testing campaigns', 'Keyword optimization', 'Weekly performance review', 'Quality score checks']} 
        icon={Rocket}
      />
      <TimelinePhase 
        phase="3" 
        title="Optimise & Scale" 
        duration="Month 2-3+" 
        items={['Scale winning campaigns', 'Reduce CPL continuously', 'Retargeting expansion', 'SEO content rollout']} 
        icon={Scale}
      />
    </div>
  </section>
);

// Recommended Package Section - Enhanced
interface RecommendedPackageProps {
  packageInfo: { name: string; price: number; budget: number };
  formatCurrency: (value: number) => string;
}

export const RecommendedPackage = ({ packageInfo, formatCurrency }: RecommendedPackageProps) => (
  <section className="space-y-8">
    <SectionTitle 
      number="4" 
      title="Recommended Package" 
      subtitle="Tailored solution for your needs"
    />
    <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/10 to-transparent p-8 card-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 accent-gradient opacity-20 rounded-bl-full" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent mb-3">
              RECOMMENDED
            </span>
            <h4 className="font-display text-2xl font-bold text-foreground">{packageInfo.name}</h4>
            <p className="text-muted-foreground mt-1">12-month partnership with monthly payments</p>
          </div>
          <div className="text-right">
            <span className="font-display text-4xl font-bold text-accent">
              {formatCurrency(packageInfo.price)}
            </span>
            <span className="text-muted-foreground text-lg">/month</span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border p-4">
            <span className="text-sm text-muted-foreground">Management Fee</span>
            <p className="font-display text-xl font-bold text-foreground">{formatCurrency(packageInfo.price)}/mo</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border p-4">
            <span className="text-sm text-muted-foreground">Suggested Ad Budget</span>
            <p className="font-display text-xl font-bold text-accent">{formatCurrency(packageInfo.budget)}/mo</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// KPI & Reporting Section - Enhanced
interface KPIReportingProps {
  data: ProposalData;
}

export const KPIReporting = ({ data }: KPIReportingProps) => (
  <section className="space-y-8">
    <SectionTitle 
      number="7" 
      title="KPI & Reporting" 
      subtitle="How we measure and communicate success"
    />
    <div className="grid gap-6 md:grid-cols-2">
      <VisualInfoCard 
        icon={Target}
        label="Primary KPI"
        value={data.kpiType === 'leads' ? 'Lead Generation' : 'E-commerce Sales'}
        highlight
      />
      <VisualInfoCard 
        icon={Calendar}
        label="Reporting Cadence"
        value="Monthly + Weekly Updates"
      />
    </div>
    <div className="rounded-2xl border border-border bg-card p-6">
      <h4 className="font-display font-bold text-foreground mb-4">Secondary Metrics We Track</h4>
      <div className="grid gap-3 md:grid-cols-4">
        {['CPL/CPA', 'Conversion Rate', 'Lead Quality', 'ROAS'].map((metric) => (
          <div key={metric} className="rounded-xl bg-secondary/50 p-4 text-center">
            <span className="text-sm font-medium text-foreground">{metric}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Footer Section - Enhanced
interface ProposalFooterProps {
  formatDate: (dateStr: string) => string;
  date: string;
}

export const ProposalFooter = ({ formatDate, date }: ProposalFooterProps) => (
  <footer className="border-t border-border pt-8 mt-12">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p className="font-display text-lg font-bold text-accent">Leadzap Marketing</p>
        <p className="text-muted-foreground">KPI Focus: Leads & E-commerce Sales</p>
      </div>
      <div className="text-center md:text-right">
        <p className="text-muted-foreground">www.leadzapmarketing.com.my</p>
        <p className="text-sm text-muted-foreground">Prepared on {formatDate(date)}</p>
      </div>
    </div>
  </footer>
);
