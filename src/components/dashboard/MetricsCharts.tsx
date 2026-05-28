import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PROVIDERS, type MetricEntry } from '@/GrowHubHooks/useClients';
import { TrendingUp, CalendarIcon } from 'lucide-react';
import { format, subDays, parseISO, startOfMonth, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  metrics: MetricEntry[];
  range?: { from: Date; to: Date };
  onRangeChange?: (r: { from: Date; to: Date }) => void;
}

const CHART_COLORS = [
  'hsl(var(--accent))',
  'hsl(199 89% 60%)',
  'hsl(142 71% 55%)',
  'hsl(280 75% 65%)',
  'hsl(24 95% 60%)',
];

function compactNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return Math.round(n).toLocaleString();
}

export default function MetricsCharts({ metrics, range: rangeProp, onRangeChange }: Props) {
  const [internalRange, setInternalRange] = useState<{ from: Date; to: Date }>(() => ({
    from: subDays(new Date(), 30),
    to: new Date(),
  }));
  const range = rangeProp ?? internalRange;
  const setRange = (r: { from: Date; to: Date }) => { onRangeChange ? onRangeChange(r) : setInternalRange(r); };
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  // Group by provider → metric_label, dedupe by date (one point per date per label)
  const grouped = useMemo(() => {
    const fromStr = format(range.from, 'yyyy-MM-dd');
    const toStr = format(range.to, 'yyyy-MM-dd');
    const byProvider: Record<string, Record<string, Map<string, number>>> = {};
    for (const m of metrics) {
      if (m.metric_value === null || m.metric_value === undefined) continue;
      const date = m.period_end || m.created_at.slice(0, 10);
      if (date < fromStr || date > toStr) continue;
      const provMap = (byProvider[m.provider] ||= {});
      const labelMap = (provMap[m.metric_label] ||= new Map());
      // If multiple entries for same label+date, keep the latest (last-write wins via map)
      labelMap.set(date, Number(m.metric_value));
    }
    return byProvider;
  }, [metrics, range]);

  if (Object.keys(grouped).length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base">Performance</CardTitle>
          <DateRangeButton range={range} onChange={setRange} />
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No metrics in this date range.</p>
        </CardContent>
      </Card>
    );
  }

  const providerEntries = Object.entries(grouped);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Performance</h3>
        <DateRangeButton range={range} onChange={setRange} />
      </div>

      <div className={cn('grid gap-4', providerEntries.length > 1 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1')}>
        {providerEntries.map(([provider, series]) => {
          const providerLabel = PROVIDERS.find((p) => p.value === provider)?.label || provider;
          const labels = Object.keys(series);
          const isAverageMetric = (label: string) => /ctr|position|rate|avg|%/i.test(label);

          // Unified date axis
          const dateSet = new Set<string>();
          for (const label of labels) for (const d of series[label].keys()) dateSet.add(d);
          const dates = Array.from(dateSet).sort();
          const longRange = dates.length > 180;

          const displaySeries: Record<string, Map<string, number>> = longRange
            ? Object.fromEntries(
                labels.map((label) => {
                  const monthGroups = new Map<string, number[]>();
                  for (const [date, value] of series[label].entries()) {
                    const monthKey = `${date.slice(0, 7)}-01`;
                    const values = monthGroups.get(monthKey) ?? [];
                    values.push(value);
                    monthGroups.set(monthKey, values);
                  }

                  const aggregated = new Map<string, number>();
                  for (const [monthKey, values] of monthGroups.entries()) {
                    const total = values.reduce((sum, value) => sum + value, 0);
                    const nextValue = isAverageMetric(label) ? total / values.length : total;
                    aggregated.set(monthKey, Number(nextValue.toFixed(2)));
                  }

                  return [label, aggregated];
                })
              )
            : series;

          const displayDateSet = new Set<string>();
          for (const label of labels) for (const d of displaySeries[label].keys()) displayDateSet.add(d);
          const displayDates = Array.from(displayDateSet).sort();

          const rangeMonthKeys = (() => {
            if (!longRange) return displayDates;
            const keys: string[] = [];
            let cursor = startOfMonth(range.from);
            const end = startOfMonth(range.to);
            while (cursor <= end) {
              keys.push(format(cursor, 'yyyy-MM-01'));
              cursor = addMonths(cursor, 1);
            }
            return keys;
          })();

          const chartData = (longRange ? rangeMonthKeys : displayDates).map((date) => {
            const point: Record<string, string | number | null> = {
              date,
              x: longRange ? format(parseISO(date), "MMM ''yy") : date,
              tooltipLabel: longRange ? format(parseISO(date), 'MMM yyyy') : date,
            };
            for (const label of labels) {
              const v = displaySeries[label].get(date);
              point[label] = v ?? null;
            }
            return point;
          });

          const visibleLabels = labels.filter((l) => !hidden[`${provider}::${l}`]);
          const useBar = chartData.length === 1;

          return (
            <Card key={provider}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{providerLabel}</CardTitle>
                  <Badge variant="outline">{labels.length} {labels.length === 1 ? 'metric' : 'metrics'}</Badge>
                </div>
                {/* KPI tiles + legend toggles (like GSC) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                  {labels.map((label, i) => {
                    const key = `${provider}::${label}`;
                    const checked = !hidden[key];
                    const color = CHART_COLORS[i % CHART_COLORS.length];
                    const values = Array.from(displaySeries[label].values());
                    const isAvg = /ctr|position|rate|avg|%/i.test(label);
                    const isPct = /%/.test(label) || /ctr/i.test(label);
                    let display = '—';
                    if (values.length) {
                      const agg = isAvg
                        ? values.reduce((a, b) => a + b, 0) / values.length
                        : values.reduce((a, b) => a + b, 0);
                      display = isAvg
                        ? agg.toLocaleString(undefined, { maximumFractionDigits: isPct ? 2 : 1 }) + (isPct && !/%/.test(label) ? '%' : '')
                        : compactNumber(agg);
                    }
                    const totalLabel = isAvg ? (isPct ? 'Average' : 'Average') : 'Total';
                    return (
                      <label key={label} className="flex flex-col gap-1 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => setHidden((h) => ({ ...h, [key]: !v }))}
                            style={checked ? { background: color, borderColor: color } as any : undefined}
                          />
                          <span className={cn('text-xs text-muted-foreground truncate', !checked && 'line-through')}>
                            {totalLabel} {label}
                          </span>
                        </div>
                        <div className={cn('text-2xl font-semibold tabular-nums', !checked && 'opacity-40')}>{display}</div>
                      </label>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {(() => {
                    const crossesYear = displayDates.length > 0 && displayDates[0].slice(0, 4) !== displayDates[displayDates.length - 1].slice(0, 4);
                    const tickFmt = (d: string) => {
                      try {
                        return format(parseISO(d), crossesYear ? "MMM d ''yy" : 'MMM d');
                      } catch {
                        return d;
                      }
                    };
                    const labelFmt = (_: string, payload?: Array<{ payload?: { tooltipLabel?: string; date?: string } }>) => {
                      const first = payload?.[0]?.payload;
                      if (first?.tooltipLabel) return first.tooltipLabel;
                      if (first?.date) {
                        try { return format(parseISO(first.date), 'EEE, MMM d, yyyy'); } catch { return first.date; }
                      }
                      return '';
                    };
                    const axisTicks = longRange
                      ? chartData.map((point) => point.x as string).filter((_, index, arr) => index === 0 || index === arr.length - 1 || index % 2 === 0)
                      : (() => {
                          const monthTicks = Array.from(new Map(displayDates.map((date) => [date.slice(0, 7), date])).values());
                          const step = monthTicks.length > 8 ? 2 : 1;
                          const ticks = monthTicks.filter((_, index) => index % step === 0);
                          if (displayDates[0] && ticks[0] !== displayDates[0]) ticks.unshift(displayDates[0]);
                          if (displayDates[displayDates.length - 1] && ticks[ticks.length - 1] !== displayDates[displayDates.length - 1]) ticks.push(displayDates[displayDates.length - 1]);
                          return ticks;
                        })();
                    const xAxisKey = longRange ? 'x' : 'date';
                    return (
                  <ResponsiveContainer width="100%" height="100%">
                    {useBar ? (
                      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                        <XAxis dataKey={xAxisKey} ticks={axisTicks} interval={0} tickMargin={8} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeOpacity: 0.4 }} tickFormatter={longRange ? undefined : tickFmt} minTickGap={24} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip labelFormatter={labelFmt} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 12 }} />
                        {visibleLabels.map((label) => {
                          const i = labels.indexOf(label);
                          return <Bar key={label} dataKey={label} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />;
                        })}
                      </BarChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.35} vertical={false} />
                        <XAxis dataKey={xAxisKey} ticks={axisTicks} interval={0} tickMargin={8} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--border))', strokeOpacity: 0.4 }} tickFormatter={longRange ? undefined : tickFmt} minTickGap={24} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} padding={{ top: 12, bottom: 4 }} />
                        <Tooltip labelFormatter={labelFmt} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 12 }} />
                        {visibleLabels.map((label) => {
                          const i = labels.indexOf(label);
                          return (
                            <Line
                              key={label}
                              type="monotone"
                              dataKey={label}
                              stroke={CHART_COLORS[i % CHART_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 2 }}
                              activeDot={{ r: 4 }}
                              connectNulls
                            />
                          );
                        })}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DateRangeButton({ range, onChange }: { range: { from: Date; to: Date }; onChange: (r: { from: Date; to: Date }) => void }) {
  const presets = [
    { label: '7d', days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: '6m', days: 180 },
    { label: '1y', days: 365 },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <CalendarIcon className="h-3.5 w-3.5" />
          {format(range.from, 'MMM d')} – {format(range.to, 'MMM d, yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="flex gap-1 mb-3 flex-wrap">
          {presets.map((p) => (
            <Button
              key={p.label}
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => onChange({ from: subDays(new Date(), p.days), to: new Date() })}
            >
              Last {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          defaultMonth={range.from}
          selected={range}
          onSelect={(r: any) => {
            if (!r) return;
            const from = r.from ?? range.from;
            const to = r.to ?? r.from ?? range.to;
            onChange({ from, to });
          }}
          numberOfMonths={2}
          className={cn('p-0 pointer-events-auto')}
        />
      </PopoverContent>
    </Popover>
  );
}
