import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Target, DollarSign, ArrowRight } from "lucide-react";

const BudgetCalculator = () => {
  const [targetRevenue, setTargetRevenue] = useState(100000);
  const [averageOrderValue, setAverageOrderValue] = useState(500);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [budgetRatio, setBudgetRatio] = useState(20);

  const [results, setResults] = useState({
    conversionsNeeded: 0,
    leadsNeeded: 0,
    marketingBudget: 0,
    estimatedCPL: 0,
  });

  useEffect(() => {
    const conversionsNeeded = Math.ceil(targetRevenue / averageOrderValue);
    const leadsNeeded = Math.ceil(conversionsNeeded / (conversionRate / 100));
    const marketingBudget = Math.round(targetRevenue * (budgetRatio / 100));
    const estimatedCPL = leadsNeeded > 0 ? Math.round(marketingBudget / leadsNeeded) : 0;

    setResults({ conversionsNeeded, leadsNeeded, marketingBudget, estimatedCPL });
  }, [targetRevenue, averageOrderValue, conversionRate, budgetRatio]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="calculator" className="bg-primary py-24">
      <div className="container px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
            <Calculator className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Budget Calculator</span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Find Your Optimal Budget
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Use this calculator to estimate your marketing budget based on your
            revenue goals. Marketing budget is typically 15-25% of target revenue.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur md:p-8">
              <h3 className="mb-6 font-display text-xl font-bold text-primary-foreground">
                Your Business Goals
              </h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-primary-foreground/80">Target Monthly Revenue</Label>
                    <span className="font-bold text-accent">{formatCurrency(targetRevenue)}</span>
                  </div>
                  <Slider value={[targetRevenue]} onValueChange={(v) => setTargetRevenue(v[0])} min={10000} max={1000000} step={10000} className="w-full" />
                  <div className="flex justify-between text-xs text-primary-foreground/50">
                    <span>RM 10K</span><span>RM 1M</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-primary-foreground/80">Average Order/Contract Value</Label>
                    <span className="font-bold text-accent">{formatCurrency(averageOrderValue)}</span>
                  </div>
                  <Slider value={[averageOrderValue]} onValueChange={(v) => setAverageOrderValue(v[0])} min={50} max={10000} step={50} className="w-full" />
                  <div className="flex justify-between text-xs text-primary-foreground/50">
                    <span>RM 50</span><span>RM 10K</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-primary-foreground/80">Conversion Rate</Label>
                    <span className="font-bold text-accent">{conversionRate}%</span>
                  </div>
                  <Slider value={[conversionRate]} onValueChange={(v) => setConversionRate(v[0])} min={1} max={10} step={0.5} className="w-full" />
                  <div className="flex justify-between text-xs text-primary-foreground/50">
                    <span>1%</span><span>Typical: 2-3%</span><span>10%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-primary-foreground/80">Marketing Budget Ratio</Label>
                    <span className="font-bold text-accent">{budgetRatio}%</span>
                  </div>
                  <Slider value={[budgetRatio]} onValueChange={(v) => setBudgetRatio(v[0])} min={15} max={25} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-primary-foreground/50">
                    <span>15% (Normal)</span><span>25% (Competitive)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                  <div className="mb-2 flex items-center gap-2 text-primary-foreground/60">
                    <Target className="h-4 w-4" /><span className="text-sm">Conversions Needed</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-primary-foreground">{results.conversionsNeeded.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-primary-foreground/50">Sales/orders per month</div>
                </div>

                <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                  <div className="mb-2 flex items-center gap-2 text-primary-foreground/60">
                    <TrendingUp className="h-4 w-4" /><span className="text-sm">Leads Needed</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-primary-foreground">{results.leadsNeeded.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-primary-foreground/50">Enquiries per month</div>
                </div>
              </div>

              <div className="rounded-2xl accent-gradient p-6 shadow-glow md:p-8">
                <div className="mb-2 flex items-center gap-2 text-accent-foreground/80">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Marketing Budget ({budgetRatio}% of revenue)</span>
                </div>
                <div className="mb-2 font-display text-4xl font-bold text-accent-foreground md:text-5xl">
                  {formatCurrency(results.marketingBudget)}
                </div>
                <div className="text-accent-foreground/70">
                  Estimated CPL: {formatCurrency(results.estimatedCPL)} per lead
                </div>
              </div>

              <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                <h4 className="mb-3 font-semibold text-primary-foreground">How it's calculated:</h4>
                <div className="space-y-2 text-sm text-primary-foreground/70">
                  <p><span className="text-primary-foreground">Conversions:</span> {formatCurrency(targetRevenue)} ÷ {formatCurrency(averageOrderValue)} = {results.conversionsNeeded}</p>
                  <p><span className="text-primary-foreground">Leads:</span> {results.conversionsNeeded} ÷ {conversionRate}% = {results.leadsNeeded}</p>
                  <p><span className="text-primary-foreground">Budget:</span> {formatCurrency(targetRevenue)} × {budgetRatio}% = {formatCurrency(results.marketingBudget)}</p>
                  <p><span className="text-primary-foreground">Estimated CPL:</span> {formatCurrency(results.marketingBudget)} ÷ {results.leadsNeeded} = {formatCurrency(results.estimatedCPL)}</p>
                </div>
              </div>

              <Cover variant="button">
                <Button variant="hero" size="xl" className="w-full">
                  Get Your Custom Proposal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Cover>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetCalculator;