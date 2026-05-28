import { ProposalData } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  ExternalLink, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Calendar, 
  Edit3, 
  CreditCard, 
  Percent, 
  Check, 
  Globe,
  Briefcase,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Search,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ArrowUpDown,
  Settings,
  Rocket,
  Scale,
  MessageSquare,
  StickyNote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProposalPreviewProps {
  data: ProposalData;
  onUpdateData: (updates: Partial<ProposalData>) => void;
}

const ProposalPreview = ({ data, onUpdateData }: ProposalPreviewProps) => {
  const navigate = useNavigate();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: value < 10 ? 2 : 0,
      maximumFractionDigits: value < 10 ? 2 : 0,
    }).format(value);
  };

  const calculateBudget = () => {
    const conversions = Math.ceil(data.targetRevenue / data.aov);
    const leads = Math.ceil(conversions / (data.conversionRate / 100));
    // Budget is derived from ratio, CPL is calculated to fit
    const budget = Math.round(data.targetRevenue * (data.budgetRatio / 100));
    // Keep 2 decimal places for CPL to avoid showing 0 for small values
    const estimatedCPL = leads > 0 ? Math.round((budget / leads) * 100) / 100 : 0;
    return { conversions, leads, budget, estimatedCPL };
  };

  const calculated = calculateBudget();
  const completionPercentage = calculateCompletionPercentage(data);

  const handleGenerateProposal = () => {
    // Store data in sessionStorage for the proposal page
    sessionStorage.setItem('proposalData', JSON.stringify({
      ...data,
      conversionsNeeded: calculated.conversions,
      leadsNeeded: calculated.leads,
      marketingBudget: calculated.budget,
      estimatedCPL: calculated.estimatedCPL,
    }));
    navigate('/proposal');
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">Live Preview</h2>
            <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
          </div>
        </div>
        <Button 
          variant="accent" 
          size="sm" 
          onClick={handleGenerateProposal}
          disabled={completionPercentage < 30}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Generate Proposal
        </Button>
      </div>

      {/* Progress bar */}
      <div className="border-b border-border px-4 py-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full accent-gradient transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Client Info - Editable */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Client Information</h3>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Edit3 className="h-3 w-3" /> Editable
              </span>
            </div>
            <div className="grid gap-3 text-sm">
              <EditableInfoRow 
                label="Client Name" 
                value={data.clientName} 
                onChange={(val) => onUpdateData({ clientName: val })}
              />
              <EditableInfoRow 
                label="Business Type" 
                value={data.businessType} 
                onChange={(val) => onUpdateData({ businessType: val })}
              />
              <EditableInfoRow 
                label="Product/Service" 
                value={data.productService} 
                onChange={(val) => onUpdateData({ productService: val })}
              />
              <EditableInfoRow 
                label="Target Location" 
                value={data.targetLocation} 
                onChange={(val) => onUpdateData({ targetLocation: val })}
              />
            </div>
          </section>

          {/* ICP & Positioning */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">Positioning</h3>
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Ideal Customer (ICP)" value={data.icp} />
              <InfoRow label="Primary Offer" value={data.primaryOffer} />
              <InfoRow label="Core Promise" value={data.corePromise} />
              {data.differentiators.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Differentiators:</span>
                  <ul className="mt-1 list-inside list-disc text-foreground">
                    {data.differentiators.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Budget Calculator - Editable */}
          <section className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Budget Calculation</h3>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Edit3 className="h-3 w-3" /> Click to edit
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <EditableMetricCard
                label="Target Revenue"
                value={data.targetRevenue}
                prefix="RM"
                onChange={(val) => onUpdateData({ targetRevenue: val })}
              />
              <EditableMetricCard
                label="Average Order Value"
                value={data.aov}
                prefix="RM"
                onChange={(val) => onUpdateData({ aov: val })}
              />
              <div className="rounded-lg bg-card p-3 shadow-soft">
                <span className="text-xs text-muted-foreground">Conversions Needed</span>
                <p className="font-display text-xl font-bold text-foreground">
                  {calculated.conversions.toLocaleString()}
                </p>
                <span className="text-xs text-muted-foreground">auto-calculated</span>
              </div>
              <div className="rounded-lg bg-card p-3 shadow-soft">
                <span className="text-xs text-muted-foreground">Leads Needed</span>
                <p className="font-display text-xl font-bold text-foreground">
                  {calculated.leads.toLocaleString()}
                </p>
                <span className="text-xs text-muted-foreground">auto-calculated</span>
              </div>
              <EditableMetricCard
                label="Conversion Rate"
                value={data.conversionRate}
                suffix="%"
                onChange={(val) => onUpdateData({ conversionRate: val })}
                step={0.5}
                min={0.5}
                max={20}
              />
              <EditableMetricCard
                label="Budget Ratio"
                value={data.budgetRatio}
                suffix="% of revenue"
                onChange={(val) => onUpdateData({ budgetRatio: val })}
                step={1}
                min={10}
                max={30}
              />
            </div>
            
            {/* Budget result */}
            <div className="mt-4 rounded-xl accent-gradient p-4 text-center shadow-glow">
              <span className="text-sm text-accent-foreground/80">
                Marketing Budget ({data.budgetRatio}% of revenue)
              </span>
              <p className="font-display text-3xl font-bold text-accent-foreground">
                {formatCurrency(calculated.budget)}
              </p>
            </div>
            
            {/* Estimated CPL indicator */}
            <div className="mt-3 rounded-lg bg-card border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Estimated Cost Per Lead</span>
                  <p className="font-display text-lg font-bold text-foreground">
                    {formatCurrency(calculated.estimatedCPL)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">To stay within budget</span>
                  {calculated.estimatedCPL < 10 && (
                    <p className="text-xs text-amber-500 mt-1">
                      ⚠️ Very low CPL target
                    </p>
                  )}
                  {calculated.estimatedCPL >= 10 && calculated.estimatedCPL <= 100 && (
                    <p className="text-xs text-green-500 mt-1">
                      ✓ Realistic CPL range
                    </p>
                  )}
                  {calculated.estimatedCPL > 100 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium market CPL
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Package Selection */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">Package Selection</h3>
            </div>
            <div className="grid gap-2">
              <PackageOption 
                selected={data.selectedPackage === 'google-seo'}
                onClick={() => onUpdateData({ selectedPackage: 'google-seo', customLineItems: [] })}
                title="Google Ads + SEO"
                price="RM 2,400/month"
              />
              <PackageOption 
                selected={data.selectedPackage === 'social'}
                onClick={() => onUpdateData({ selectedPackage: 'social', customLineItems: [] })}
                title="Social Media Paid Ads"
                price="RM 2,100/month"
              />
              <PackageOption 
                selected={data.selectedPackage === 'both'}
                onClick={() => onUpdateData({ selectedPackage: 'both', customLineItems: [] })}
                title="Complete Package (Both)"
                price="RM 4,500/month"
              />
              <PackageOption 
                selected={data.selectedPackage === 'custom'}
                onClick={() => onUpdateData({ 
                  selectedPackage: 'custom', 
                  customLineItems: data.customLineItems && data.customLineItems.length > 0 
                    ? data.customLineItems 
                    : [{ id: `item-${Date.now()}`, description: 'Custom Service', monthlyAmount: 0 }]
                })}
                title="Custom Package"
                price={data.customLineItems && data.customLineItems.length > 0
                  ? `${formatCurrency(data.customLineItems.reduce((s, i) => s + (i.monthlyAmount || 0), 0))}/month`
                  : 'AI-defined items'}
              />
            </div>

            {/* Custom Line Items Editor */}
            {data.selectedPackage === 'custom' && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Line Items</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-accent hover:text-accent"
                    onClick={() => {
                      const newItems = [
                        ...(data.customLineItems || []),
                        { id: `item-${Date.now()}`, description: '', monthlyAmount: 0 },
                      ];
                      onUpdateData({ customLineItems: newItems });
                    }}
                  >
                    + Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {(data.customLineItems || []).map((item, idx) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...(data.customLineItems || [])];
                          updated[idx] = { ...item, description: e.target.value };
                          onUpdateData({ customLineItems: updated });
                        }}
                        placeholder="Service description"
                        className="flex-1 h-8 text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">RM</span>
                        <Input
                          type="number"
                          value={item.monthlyAmount || ''}
                          onChange={(e) => {
                            const updated = [...(data.customLineItems || [])];
                            updated[idx] = { ...item, monthlyAmount: parseFloat(e.target.value) || 0 };
                            onUpdateData({ customLineItems: updated });
                          }}
                          placeholder="0"
                          className="w-24 h-8 text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const updated = (data.customLineItems || []).filter((_, i) => i !== idx);
                          onUpdateData({ customLineItems: updated });
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {(!data.customLineItems || data.customLineItems.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">No items yet. Add one or ask the AI to propose a custom package.</p>
                  )}
                </div>
                {data.customLineItems && data.customLineItems.length > 0 && (
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                    <span className="text-xs font-medium text-muted-foreground">Subtotal (Management Fee)</span>
                    <span className="font-display text-sm font-bold text-accent">
                      {formatCurrency(data.customLineItems.reduce((s, i) => s + (i.monthlyAmount || 0), 0))}/month
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Selected Platforms */}
            {data.selectedPlatforms && data.selectedPlatforms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Platforms</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.selectedPlatforms.map((platform, i) => (
                    <span 
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        i < 2 ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {platform} {i >= 2 && '(+RM300)'}
                    </span>
                  ))}
                </div>
                {data.selectedPlatforms.length > 2 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Extra platforms: +{formatCurrency((data.selectedPlatforms.length - 2) * 300)}/month
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Payment Schedule */}
          {data.paymentSchedule && data.paymentSchedule.length > 0 && (
            <section className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <h3 className="font-display font-semibold text-foreground">Payment Schedule</h3>
                </div>
                {data.discountPercentage > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    <Percent className="h-3 w-3" />
                    {data.discountPercentage}% discount
                  </span>
                )}
              </div>

              {data.discountReason && (
                <p className="text-xs text-muted-foreground mb-3 italic">
                  {data.discountReason}
                </p>
              )}

              {/* Monthly Breakdown Summary */}
              {data.monthlyBreakdown && (
                <div className="mb-4 p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Monthly Breakdown</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Management Fee:</span>
                      <span className="font-medium text-foreground">{formatCurrency(data.monthlyBreakdown.managementFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ad Budget:</span>
                      <span className="font-medium text-foreground">{formatCurrency(data.monthlyBreakdown.adBudget)}</span>
                    </div>
                    {data.monthlyBreakdown.extraPlatforms > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Extra Platforms:</span>
                        <span className="font-medium text-foreground">{formatCurrency(data.monthlyBreakdown.extraPlatforms)}</span>
                      </div>
                    )}
                    <div className="flex justify-between col-span-2 pt-2 border-t border-border">
                      <span className="font-medium text-foreground">Total/Month:</span>
                      <span className="font-bold text-accent">{formatCurrency(data.monthlyBreakdown.totalMonthly)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contract Duration */}
              {data.contractMonths && (
                <p className="text-xs text-muted-foreground mb-3">
                  {data.contractMonths}-month contract starting {data.startDate ? new Date(data.startDate).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' }) : 'TBD'}
                </p>
              )}

              {/* Payment Timeline - Show first 3 and last payment */}
              <div className="space-y-2">
                {data.paymentSchedule.slice(0, 3).map((payment, index) => (
                  <PaymentRow 
                    key={payment.id} 
                    payment={payment} 
                    index={index} 
                    formatCurrency={formatCurrency} 
                  />
                ))}
                
                {data.paymentSchedule.length > 4 && (
                  <div className="text-center py-2 text-xs text-muted-foreground">
                    ... {data.paymentSchedule.length - 4} more payments ...
                  </div>
                )}
                
                {data.paymentSchedule.length > 3 && (
                  <PaymentRow 
                    payment={data.paymentSchedule[data.paymentSchedule.length - 1]} 
                    index={data.paymentSchedule.length - 1} 
                    formatCurrency={formatCurrency} 
                  />
                )}
              </div>

              {/* Total */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Contract Value ({data.contractMonths || data.paymentSchedule.length} months)</span>
                  <span className="font-display text-xl font-bold text-accent">
                    {formatCurrency(data.totalContractValue || data.paymentSchedule.reduce((sum, p) => sum + p.amount, 0))}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* KPI & Timeline */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">KPI & Timeline</h3>
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="KPI Type" value={data.kpiType === 'leads' ? 'Leads' : 'E-commerce Sales'} />
              <InfoRow label="KPI Target" value={data.kpiTarget} />
              <InfoRow label="Start Date" value={data.startDate} />
              <InfoRow label="CTA Method" value={data.cta.toUpperCase()} />
            </div>
          </section>

          {/* Business Details */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">Business Details</h3>
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Best Sellers" value={data.bestSellers} />
              <InfoRow label="Margin" value={data.margin} />
              <InfoRow label="Seasonality" value={data.seasonality} />
              <InfoRow label="Company Size" value={data.companySize} />
            </div>
          </section>

          {/* Target Persona */}
          {(data.persona || data.painPoints) && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Target Persona</h3>
              </div>
              <div className="grid gap-3 text-sm">
                <InfoRow label="Persona" value={data.persona} />
                <InfoRow label="Pain Points" value={data.painPoints} />
              </div>
            </section>
          )}

          {/* Sales Context */}
          {(data.currentChannels || data.pastCampaigns || data.competitors.length > 0) && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Sales Context</h3>
              </div>
              <div className="grid gap-3 text-sm">
                <InfoRow label="Current Channels" value={data.currentChannels} />
                <InfoRow label="Past Campaigns" value={data.pastCampaigns} />
                {data.competitors.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Competitors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.competitors.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-secondary text-xs text-foreground">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Push-Pull Framework (collapsed summary) */}
          <section className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">Push-Pull Framework</h3>
            </div>
            <div className="grid gap-2 text-xs">
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="font-medium text-green-500">PUSH:</span>
                <span className="ml-2 text-muted-foreground">Social ads, display, video - create demand</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="font-medium text-blue-500">PULL:</span>
                <span className="ml-2 text-muted-foreground">Search ads, SEO - capture demand</span>
              </div>
            </div>
          </section>

          {/* Strategic Process */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-accent" />
              <h3 className="font-display font-semibold text-foreground">Implementation Phases</h3>
            </div>
            <div className="grid gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <Rocket className="h-3 w-3 text-accent" />
                <span className="text-foreground"><strong>Week 1-2:</strong> Foundation & Setup</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <BarChart3 className="h-3 w-3 text-accent" />
                <span className="text-foreground"><strong>Week 3-4:</strong> Launch & Learn</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <Scale className="h-3 w-3 text-accent" />
                <span className="text-foreground"><strong>Month 2-3+:</strong> Optimize & Scale</span>
              </div>
            </div>
          </section>

          {/* Market Research */}
          {data.marketResearch && (
            <section className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Market Research</h3>
              </div>
              <div className="space-y-3 text-sm">
                {data.marketResearch.industryOverview && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <span className="text-xs font-medium text-muted-foreground">Industry Overview</span>
                    <p className="text-foreground mt-1">{data.marketResearch.industryOverview}</p>
                  </div>
                )}
                {data.marketResearch.marketSize && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <span className="text-xs font-medium text-muted-foreground">Market Size</span>
                    <p className="text-foreground mt-1">{data.marketResearch.marketSize}</p>
                  </div>
                )}
                {data.marketResearch.trends && data.marketResearch.trends.length > 0 && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <span className="text-xs font-medium text-muted-foreground">Key Trends</span>
                    <ul className="mt-1 space-y-1">
                      {data.marketResearch.trends.slice(0, 3).map((trend, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <TrendingUp className="h-3 w-3 text-accent mt-0.5" />
                          <span className="text-xs">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.marketResearch.opportunities && data.marketResearch.opportunities.length > 0 && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <span className="text-xs font-medium text-green-500">Opportunities</span>
                    <ul className="mt-1 space-y-1">
                      {data.marketResearch.opportunities.slice(0, 3).map((opp, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground text-xs">
                          <Sparkles className="h-3 w-3 text-green-500 mt-0.5" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.marketResearch.threats && data.marketResearch.threats.length > 0 && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <span className="text-xs font-medium text-orange-500">Threats</span>
                    <ul className="mt-1 space-y-1">
                      {data.marketResearch.threats.slice(0, 3).map((threat, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground text-xs">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5" />
                          <span>{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.marketResearch.recommendations && data.marketResearch.recommendations.length > 0 && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                    <span className="text-xs font-medium text-accent">Recommendations</span>
                    <ul className="mt-1 space-y-1">
                      {data.marketResearch.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground text-xs">
                          <Lightbulb className="h-3 w-3 text-accent mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Notes */}
          {(data.notes || data.assets) && (
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-accent" />
                <h3 className="font-display font-semibold text-foreground">Notes & Assets</h3>
              </div>
              <div className="grid gap-3 text-sm">
                {data.assets && <InfoRow label="Assets" value={data.assets} />}
                {data.notes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="text-foreground mt-1 whitespace-pre-wrap text-xs bg-secondary/50 p-2 rounded-lg">{data.notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value || '—'}</span>
  </div>
);

const EditableInfoRow = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex justify-between gap-4 items-center">
      <span className="text-muted-foreground">{label}</span>
      {isEditing ? (
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-40 text-right text-sm"
          autoFocus
        />
      ) : (
        <button 
          onClick={() => {
            setTempValue(value);
            setIsEditing(true);
          }}
          className="font-medium text-foreground hover:text-accent transition-colors text-right"
        >
          {value || '—'}
        </button>
      )}
    </div>
  );
};

const EditableMetricCard = ({
  label,
  value,
  prefix = '',
  suffix = '',
  onChange,
  step = 1,
  min = 0,
  max = 10000000,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const formatDisplay = (val: number) => {
    if (prefix === 'RM') {
      return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
      }).format(val);
    }
    return `${val}${suffix}`;
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numVal = parseFloat(tempValue);
    if (!isNaN(numVal) && numVal >= min && numVal <= max && numVal !== value) {
      onChange(numVal);
    } else {
      setTempValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-lg bg-card p-3 shadow-soft">
      <span className="text-xs text-muted-foreground">{label}</span>
      {isEditing ? (
        <div className="flex items-center gap-1 mt-1">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            step={step}
            min={min}
            max={max}
            className="h-8 w-full text-lg font-bold"
            autoFocus
          />
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      ) : (
        <button 
          onClick={() => {
            setTempValue(value.toString());
            setIsEditing(true);
          }}
          className="w-full text-left font-display text-xl font-bold text-foreground hover:text-accent transition-colors"
        >
          {formatDisplay(value)}
        </button>
      )}
    </div>
  );
};

const PaymentRow = ({ 
  payment, 
  index, 
  formatCurrency 
}: { 
  payment: { id: string; description: string; amount: number; dueDate: string; isPaid?: boolean; breakdown?: { managementFee?: number; adBudget?: number; setupFee?: number; extraPlatforms?: number } };
  index: number;
  formatCurrency: (value: number) => string;
}) => (
  <div 
    className={`flex items-center justify-between p-3 rounded-lg border ${
      payment.isPaid 
        ? 'bg-green-500/5 border-green-500/30' 
        : 'bg-card border-border'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        payment.isPaid 
          ? 'bg-green-500 text-white' 
          : 'bg-accent/20 text-accent'
      }`}>
        {payment.isPaid ? <Check className="h-3 w-3" /> : index + 1}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{payment.description}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(payment.dueDate).toLocaleDateString('en-MY', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </p>
          {payment.breakdown && (
            <p className="text-xs text-muted-foreground">
              (Fee: {formatCurrency(payment.breakdown.managementFee || 0)} + Ad: {formatCurrency(payment.breakdown.adBudget || 0)})
            </p>
          )}
        </div>
      </div>
    </div>
    <span className="font-display font-bold text-foreground">
      {formatCurrency(payment.amount)}
    </span>
  </div>
);

const PackageOption = ({ 
  selected, 
  onClick, 
  title, 
  price 
}: { 
  selected: boolean; 
  onClick: () => void; 
  title: string; 
  price: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
      selected 
        ? 'border-accent bg-accent/10 shadow-glow' 
        : 'border-border hover:border-accent/50'
    }`}
  >
    <span className={`font-medium ${selected ? 'text-accent' : 'text-foreground'}`}>{title}</span>
    <span className={`text-sm ${selected ? 'text-accent' : 'text-muted-foreground'}`}>{price}</span>
  </button>
);

function calculateCompletionPercentage(data: ProposalData): number {
  const fields = [
    data.clientName,
    data.businessType,
    data.productService,
    data.icp,
    data.targetRevenue > 0,
    data.aov > 0,
    data.primaryOffer,
    data.selectedPackage,
    data.kpiType,
    data.cta,
  ];
  
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default ProposalPreview;
