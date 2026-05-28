import { useState, useMemo } from 'react';
import { useWorkOrders } from '@/GrowHubHooks/useWorkOrders';
import { useCRM } from '@/GrowHubHooks/useCRM';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ClipboardList, Users, AlertTriangle, Clock } from 'lucide-react';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPanel() {
  const { workOrders, issues } = useWorkOrders();
  const { activities, deals } = useCRM();
  const [current, setCurrent] = useState(new Date());

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const events = useMemo(() => {
    const map: Record<string, { type: string; label: string; color: string }[]> = {};
    const addEvent = (dateStr: string | null, type: string, label: string, color: string) => {
      if (!dateStr) return;
      const d = dateStr.split('T')[0];
      if (!map[d]) map[d] = [];
      map[d].push({ type, label, color });
    };

    workOrders.forEach(wo => {
      addEvent(wo.due_date, 'wo', wo.title, 'bg-accent/60');
    });
    issues.forEach(i => {
      addEvent(i.created_at, 'issue', i.title, 'bg-destructive/60');
    });
    activities.forEach(a => {
      addEvent(a.scheduled_at, 'activity', a.title, 'bg-blue-500/60');
    });
    deals.forEach(d => {
      addEvent(d.expected_close_date, 'deal', d.title, 'bg-green-500/60');
    });
    return map;
  }, [workOrders, issues, activities, deals]);

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium min-w-[140px] text-center">{MONTHS[month]} {year}</span>
          <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-accent/60" /> Work Orders</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-destructive/60" /> Issues</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/60" /> Activities</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-500/60" /> Deals</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-secondary/50 p-2 text-xs font-medium text-muted-foreground text-center">{d}</div>
        ))}
        {cells.map((day, i) => {
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const dayEvents = dateStr ? events[dateStr] || [] : [];
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`bg-card min-h-[90px] p-1.5 ${!day ? 'bg-card/50' : ''}`}>
              {day && (
                <>
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev, j) => (
                      <div key={j} className={`${ev.color} rounded px-1 py-0.5 text-[10px] truncate text-foreground`}>
                        {ev.label}
                      </div>
                    ))}
                    {dayEvents.length > 3 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
