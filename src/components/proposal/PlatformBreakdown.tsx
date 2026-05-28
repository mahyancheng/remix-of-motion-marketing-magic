import { Globe, Facebook, Instagram, Linkedin, Video, Plus } from 'lucide-react';
import { ProposalData } from '@/types/proposal';

interface PlatformBreakdownProps {
  data: ProposalData;
  formatCurrency: (value: number) => string;
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'LinkedIn': Linkedin,
  'TikTok': Video,
};

const platformColors: Record<string, string> = {
  'Facebook': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  'Instagram': 'bg-pink-500/10 border-pink-500/30 text-pink-400',
  'LinkedIn': 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  'TikTok': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
};

export const PlatformBreakdown = ({ data, formatCurrency }: PlatformBreakdownProps) => {
  const hasSocialPackage = data.selectedPackage === 'social' || data.selectedPackage === 'both';
  
  if (!hasSocialPackage || !data.selectedPlatforms || data.selectedPlatforms.length === 0) {
    return null;
  }

  const basePlatformCount = 1; // First platform is included
  const extraPlatformCount = Math.max(0, data.selectedPlatforms.length - basePlatformCount);
  const extraPlatformCost = extraPlatformCount * 300;
  const baseAdBudget = 2000;
  const totalAdBudget = baseAdBudget * data.selectedPlatforms.length;

  return (
    <section className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
            <Globe className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Platform Strategy</h3>
            <p className="text-sm text-muted-foreground mt-1">Social media platforms included in your campaign</p>
          </div>
        </div>
      </div>

      {/* Platform Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.selectedPlatforms.map((platform, index) => {
          const Icon = platformIcons[platform] || Globe;
          const colorClass = platformColors[platform] || 'bg-accent/10 border-accent/30 text-accent';
          const isExtra = index >= basePlatformCount;
          
          return (
            <div key={platform} className={`rounded-2xl border p-6 ${colorClass}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-current/10 p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground text-lg">{platform}</h4>
                    <p className="text-sm opacity-80">
                      {isExtra ? 'Additional Platform' : 'Primary Platform'}
                    </p>
                  </div>
                </div>
                {isExtra && (
                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-current/10 px-2 py-1 rounded-full">
                    <Plus className="h-3 w-3" />
                    RM 300
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-current/20">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Recommended Ad Budget</span>
                  <span className="font-semibold text-foreground">{formatCurrency(baseAdBudget)}/month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Summary */}
      <div className="rounded-2xl bg-secondary/50 border border-border p-6">
        <h4 className="font-display font-semibold text-foreground mb-4">Platform Cost Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Primary Platform (included)</span>
            <span>RM 0</span>
          </div>
          {extraPlatformCount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Extra Platforms ({extraPlatformCount} × RM 300)</span>
              <span>{formatCurrency(extraPlatformCost)}</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Additional Monthly Fee</span>
            <span className="font-display font-bold text-foreground">{formatCurrency(extraPlatformCost)}/month</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Recommended Ad Budget</span>
            <span className="font-display font-bold text-accent">{formatCurrency(totalAdBudget)}/month</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Ad budget is separate from management fees and paid directly to platforms
          </p>
        </div>
      </div>
    </section>
  );
};
