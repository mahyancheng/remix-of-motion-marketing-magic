import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ClipboardList, Briefcase, Phone, Trophy } from 'lucide-react';
import type { UpcomingItem } from '@/GrowtLib/dashboardAggregates';
import { TONE_DOT } from '@/GrowtLib/statusColors';

interface Props {
  items: UpcomingItem[];
}

const ICON: Record<UpcomingItem['kind'], typeof ClipboardList> = {
  task: ClipboardList,
  workOrder: Briefcase,
  activity: Phone,
  deal: Trophy,
};

const KIND_DOT: Record<UpcomingItem['kind'], string> = {
  task: TONE_DOT.waiting,
  workOrder: TONE_DOT.progress,
  activity: 'bg-blue-400',
  deal: TONE_DOT.done,
};

function dayLabel(daysAway: number, date: string): string {
  if (daysAway === 0) return 'Today';
  if (daysAway === 1) return 'Tomorrow';
  if (daysAway <= 7) return new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function UpcomingTimeline({ items }: Props) {
  // Group by day
  const groups = new Map<number, UpcomingItem[]>();
  items.forEach(i => {
    if (!groups.has(i.daysAway)) groups.set(i.daysAway, []);
    groups.get(i.daysAway)!.push(i);
  });

  return (
    <Card className="p-4 border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          Upcoming · 14 days
        </h3>
        <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
      </div>

      <div className="space-y-3 overflow-auto flex-1 max-h-[420px] pr-1">
        {[...groups.entries()].sort((a, b) => a[0] - b[0]).map(([days, dayItems]) => (
          <div key={days}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 sticky top-0 bg-card py-1">
              {dayLabel(days, dayItems[0].date)}
            </div>
            <div className="space-y-1">
              {dayItems.map(item => {
                const Icon = ICON[item.kind];
                return (
                  <div key={`${item.kind}-${item.id}`} className="flex items-start gap-2 px-2 py-1.5 rounded-md bg-secondary/30">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${KIND_DOT[item.kind]}`} />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground truncate">{item.title}</div>
                      {item.subtitle && <div className="text-[10px] text-muted-foreground truncate">{item.subtitle}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Nothing scheduled in the next 14 days.
          </div>
        )}
      </div>
    </Card>
  );
}
