import { Calendar, CreditCard, Check, Percent } from 'lucide-react';
import { ProposalData, PaymentInstallment } from '@/types/proposal';

interface PaymentScheduleProps {
  data: ProposalData;
  formatCurrency: (value: number) => string;
  formatDate: (dateStr: string) => string;
}

export const PaymentSchedule = ({ data, formatCurrency, formatDate }: PaymentScheduleProps) => {
  const hasPaymentSchedule = data.paymentSchedule && data.paymentSchedule.length > 0;
  const hasDiscount = data.discountPercentage > 0;
  
  // Calculate totals
  const subtotal = data.paymentSchedule?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const discountAmount = subtotal * (data.discountPercentage / 100);
  const totalAfterDiscount = subtotal - discountAmount;

  if (!hasPaymentSchedule) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
            <CreditCard className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">Payment Schedule</h3>
            <p className="text-sm text-muted-foreground mt-1">Customised payment plan for your engagement</p>
          </div>
        </div>
      </div>

      {/* Discount Banner */}
      {hasDiscount && (
        <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4 flex items-center gap-4">
          <div className="rounded-xl bg-green-500/20 p-2">
            <Percent className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-green-400">
              {data.discountPercentage}% Discount Applied
            </p>
            {data.discountReason && (
              <p className="text-sm text-green-400/80">{data.discountReason}</p>
            )}
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">You save</p>
            <p className="font-display font-bold text-green-400">{formatCurrency(discountAmount)}</p>
          </div>
        </div>
      )}

      {/* Custom Package Line Items */}
      {data.selectedPackage === 'custom' && data.customLineItems && data.customLineItems.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-6">
          <h4 className="font-display font-bold text-foreground text-lg mb-4">Package Inclusions</h4>
          <div className="space-y-2">
            {data.customLineItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{item.description}</span>
                <span className="font-display font-semibold text-foreground">{formatCurrency(item.monthlyAmount)}/mo</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t-2 border-accent/30">
              <span className="font-semibold text-foreground">Subtotal (Management Fee)</span>
              <span className="font-display font-bold text-accent text-lg">
                {formatCurrency(data.customLineItems.reduce((s, i) => s + (i.monthlyAmount || 0), 0))}/mo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Summary */}
      {data.monthlyBreakdown && (
        <div className="rounded-2xl bg-accent/5 border border-accent/20 p-6">
          <h4 className="font-display font-bold text-foreground text-lg mb-4">Monthly Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Management Fee</p>
              <p className="font-display font-bold text-foreground text-xl">{formatCurrency(data.monthlyBreakdown.managementFee)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ad Budget</p>
              <p className="font-display font-bold text-foreground text-xl">{formatCurrency(data.monthlyBreakdown.adBudget)}</p>
            </div>
            {data.monthlyBreakdown.extraPlatforms > 0 && (
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Extra Platforms</p>
                <p className="font-display font-bold text-foreground text-xl">{formatCurrency(data.monthlyBreakdown.extraPlatforms)}</p>
              </div>
            )}
            <div className="text-center p-4 rounded-xl accent-gradient shadow-glow">
              <p className="text-xs text-accent-foreground/80 uppercase tracking-wider mb-1">Total Monthly</p>
              <p className="font-display font-bold text-accent-foreground text-xl">{formatCurrency(data.monthlyBreakdown.totalMonthly)}</p>
            </div>
          </div>
          {data.contractMonths && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              {data.contractMonths}-month contract
            </p>
          )}
        </div>
      )}

      {/* Payment Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        
        <div className="space-y-4">
          {data.paymentSchedule.map((payment, index) => (
            <div key={payment.id} className="relative pl-16">
              {/* Timeline dot */}
              <div className={`absolute left-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                payment.isPaid 
                  ? 'bg-green-500 border-green-500' 
                  : 'bg-card border-accent'
              }`}>
                {payment.isPaid && <Check className="h-3 w-3 text-white" />}
              </div>
              
              {/* Payment Card */}
              <div className={`rounded-2xl border p-6 ${
                payment.isPaid 
                  ? 'bg-green-500/5 border-green-500/30' 
                  : 'bg-card border-border'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        Payment {index + 1}
                      </span>
                      {payment.isPaid && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                          Paid
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-foreground text-lg">
                      {payment.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Due: {formatDate(payment.dueDate)}</span>
                    </div>
                    {/* Payment breakdown details */}
                    {payment.breakdown && (
                      <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        {payment.breakdown.managementFee !== undefined && payment.breakdown.managementFee > 0 && (
                          <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            Fee: {formatCurrency(payment.breakdown.managementFee)}
                          </span>
                        )}
                        {payment.breakdown.adBudget !== undefined && payment.breakdown.adBudget > 0 && (
                          <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            Ad: {formatCurrency(payment.breakdown.adBudget)}
                          </span>
                        )}
                        {payment.breakdown.extraPlatforms !== undefined && payment.breakdown.extraPlatforms > 0 && (
                          <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            Platforms: {formatCurrency(payment.breakdown.extraPlatforms)}
                          </span>
                        )}
                        {payment.breakdown.setupFee !== undefined && payment.breakdown.setupFee > 0 && (
                          <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
                            Setup: {formatCurrency(payment.breakdown.setupFee)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-foreground">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div className="rounded-2xl bg-secondary/50 border border-border p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between text-green-400">
              <span>Discount ({data.discountPercentage}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-display font-bold text-foreground text-lg">Total Contract Value</span>
            <span className="font-display font-bold text-foreground text-2xl">
              {formatCurrency(totalAfterDiscount)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
