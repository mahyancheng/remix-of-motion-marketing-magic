import { useState } from 'react';
import { useWorkOrders, WorkOrderTask } from '@/GrowHubHooks/useWorkOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Clock, Timer, AlertCircle, Briefcase, Calendar, User } from 'lucide-react';
import { DetailDialog } from './DetailDialog';

const STATUS_ICON: Record<string, React.ReactNode> = {
  todo: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  in_progress: <Timer className="h-3.5 w-3.5 text-blue-400" />,
  review: <AlertCircle className="h-3.5 w-3.5 text-orange-400" />,
  done: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
};

const STATUS_OPTIONS = ['todo', 'in_progress', 'review', 'done'];

export default function TasksPanel() {
  const { tasks, workOrders, upsertTask, deleteTask } = useWorkOrders();
  const [filter, setFilter] = useState<string>('all');
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const woMap = new Map(workOrders.map(wo => [wo.id, wo.title]));
  const activeCount = tasks.filter(t => t.status !== 'done').length;
  const openTask = tasks.find(t => t.id === openTaskId) || null;
  const openWoTitle = openTask ? (woMap.get(openTask.work_order_id) || 'Unknown Project') : '';

  const handleUpdate = (patch: Partial<WorkOrderTask>) => {
    if (!openTask) return;
    upsertTask({ ...openTask, ...patch } as any);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">All Tasks</h2>
          {activeCount > 0 && <Badge className="bg-accent/20 text-accent">{activeCount} active</Badge>}
          <span className="text-sm text-muted-foreground">{filteredTasks.length} shown</span>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredTasks.map(task => (
          <button
            key={task.id}
            onClick={() => setOpenTaskId(task.id)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-card hover:bg-secondary/40 transition-colors border border-border rounded-lg text-left"
          >
            {STATUS_ICON[task.status] || STATUS_ICON.todo}
            <span className={`text-sm flex-1 min-w-0 truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </span>
            <span className="text-[10px] text-muted-foreground flex-shrink-0 max-w-[160px] truncate">{woMap.get(task.work_order_id) || ''}</span>
            <Badge variant="outline" className="text-[10px] flex-shrink-0">{task.status.replace('_', ' ')}</Badge>
            {task.assigned_to && <span className="text-[10px] text-muted-foreground flex-shrink-0">{task.assigned_to}</span>}
          </button>
        ))}
        {filteredTasks.length === 0 && <p className="text-center text-muted-foreground py-12">No tasks found.</p>}
      </div>

      {openTask && (
        <DetailDialog
          open={!!openTaskId}
          onOpenChange={(v) => !v && setOpenTaskId(null)}
          kind="task"
          title={openTask.title}
          status={openTask.status}
          statusOptions={STATUS_OPTIONS}
          description={null}
          pow={openTask.pow || ''}
          breadcrumbs={[{ label: openWoTitle }, { label: 'Tasks' }]}
          storagePath={`pow/tasks/${openTask.id}`}
          meta={[
            { label: 'Project', value: openWoTitle, icon: <Briefcase className="h-4 w-4" /> },
            ...(openTask.assigned_to ? [{ label: 'Assigned to', value: openTask.assigned_to, icon: <User className="h-4 w-4" /> }] : []),
            ...(openTask.due_date ? [{ label: 'Due date', value: new Date(openTask.due_date).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> }] : []),
            { label: 'Created', value: new Date(openTask.created_at).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> },
            ...(openTask.completed_at ? [{ label: 'Completed', value: new Date(openTask.completed_at).toLocaleDateString(), icon: <CheckCircle2 className="h-4 w-4" /> }] : []),
          ]}
          onStatusChange={(s) => handleUpdate({ status: s, completed_at: s === 'done' ? new Date().toISOString() : null })}
          onPowChange={(p) => handleUpdate({ pow: p })}
          onDelete={() => {
            deleteTask(openTask.id, openTask.work_order_id);
            setOpenTaskId(null);
          }}
        />
      )}
    </div>
  );
}
