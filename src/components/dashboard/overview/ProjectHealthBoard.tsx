import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ProjectHealth } from '@/GrowtLib/dashboardAggregates';
import { TONE_BADGE } from '@/GrowtLib/statusColors';

interface Props {
  projects: ProjectHealth[];
  onOpen: (id: string) => void;
}

const STATUS_LABEL: Record<ProjectHealth['status'], { label: string; cls: string }> = {
  on_track: { label: 'On Track', cls: TONE_BADGE.done },
  at_risk: { label: 'At Risk', cls: TONE_BADGE.waiting },
  blocked: { label: 'Blocked', cls: TONE_BADGE.blocked },
  done: { label: 'Done', cls: TONE_BADGE.idle },
};

function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const days = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ProjectHealthBoard({ projects, onOpen }: Props) {
  const active = projects.filter(p => p.status !== 'done');
  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-accent" />
          Project Health
        </h3>
        <Badge variant="outline" className="text-[10px]">{active.length} active</Badge>
      </div>

      {active.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No active projects.</div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {active.map(p => {
            const sl = STATUS_LABEL[p.status];
            return (
              <div
                key={p.workOrder.id}
                onClick={() => onOpen(p.workOrder.id)}
                className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer border border-border"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground truncate">{p.workOrder.title}</span>
                  <Badge className={`${sl.cls} text-[9px] flex-shrink-0`}>{sl.label}</Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Progress value={p.percentDone} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground tabular-nums w-10 text-right">{p.percentDone}%</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    {p.doneTasks}/{p.totalTasks}
                  </span>
                  {p.openIssues > 0 && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {p.openIssues}
                    </span>
                  )}
                  <span className="ml-auto">{relativeTime(p.lastActivity)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
