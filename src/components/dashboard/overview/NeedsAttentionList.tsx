import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, ClipboardList, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { AttentionItem } from '@/lib/dashboardAggregates';

interface Props {
  items: AttentionItem[];
  onResolveIssue: (id: string) => void;
  onCompleteTask: (id: string, workOrderId: string) => void;
  onOpen: (kind: AttentionItem['kind']) => void;
}

const ICON: Record<AttentionItem['kind'], typeof AlertTriangle> = {
  issue: AlertTriangle,
  task: ClipboardList,
  workOrder: Briefcase,
  custody: ArrowRight,
};

const KIND_TONE: Record<AttentionItem['kind'], string> = {
  issue: 'text-destructive',
  task: 'text-yellow-400',
  workOrder: 'text-blue-400',
  custody: 'text-purple-400',
};

export function NeedsAttentionList({ items, onResolveIssue, onCompleteTask, onOpen }: Props) {
  return (
    <Card className="p-4 border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Needs Attention
        </h3>
        <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
      </div>

      <div className="space-y-1.5 overflow-auto flex-1 max-h-[420px] pr-1">
        {items.map(item => {
          const Icon = ICON[item.kind];
          return (
            <div
              key={`${item.kind}-${item.id}`}
              className="group flex items-center gap-2 px-2 py-2 rounded-md bg-secondary/30 hover:bg-secondary/60 transition-colors"
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${KIND_TONE[item.kind]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                  {item.daysOverdue > 0 && (
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[9px] flex-shrink-0">
                      {item.daysOverdue}d over
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="truncate">{item.subtitle}</span>
                  {item.assignee && <span className="flex-shrink-0">→ {item.assignee}</span>}
                </div>
              </div>
              {item.kind === 'issue' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onResolveIssue(item.id)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Resolve
                </Button>
              )}
              {item.kind === 'task' && item.workOrderId && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onCompleteTask(item.id, item.workOrderId!)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2"
                onClick={() => onOpen(item.kind)}
              >
                Open
              </Button>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-green-400" />
            All clear — nothing needs attention right now.
          </div>
        )}
      </div>
    </Card>
  );
}
