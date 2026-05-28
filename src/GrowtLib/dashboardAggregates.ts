import type { WorkOrder, WorkOrderTask, Issue, CustodyEvent } from '@/hooks/useWorkOrders';
import type { CRMContact, CRMDeal, CRMActivity } from '@/hooks/useCRM';
import { isOverdue, daysFromNow } from './statusColors';

export interface AggregateInput {
  workOrders: WorkOrder[];
  tasks: WorkOrderTask[];
  issues: Issue[];
  custodyEvents: CustodyEvent[];
  contacts: CRMContact[];
  deals: CRMDeal[];
  activities: CRMActivity[];
}

export interface KPIs {
  activeProjects: number;
  openIssues: number;
  highPriorityIssues: number;
  dueThisWeek: number;
  awaitingClient: number;
  resolvedThisWeek: number;
}

export function getKPIs(d: AggregateInput): KPIs {
  const now = Date.now();
  const weekAhead = now + 7 * 24 * 3600 * 1000;
  const weekAgo = now - 7 * 24 * 3600 * 1000;

  const activeProjects = d.workOrders.filter(w => w.status === 'in_progress' || w.status === 'pending').length;
  const openIssues = d.issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const highPriorityIssues = d.issues.filter(i =>
    (i.status === 'open' || i.status === 'in_progress') && (i.priority === 'high' || i.priority === 'critical' || i.priority === 'urgent')
  ).length;

  const dueThisWeek =
    d.tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date).getTime() <= weekAhead && new Date(t.due_date).getTime() >= now - 24 * 3600 * 1000).length +
    d.workOrders.filter(w => w.status !== 'done' && w.due_date && new Date(w.due_date).getTime() <= weekAhead && new Date(w.due_date).getTime() >= now - 24 * 3600 * 1000).length;

  const awaitingClient =
    d.custodyEvents.filter(e => e.status === 'open' && (e.event_type === 'handoff' || e.event_type === 'review' || e.event_type === 'approval')).length +
    d.workOrders.filter(w => w.status === 'review').length;

  const resolvedThisWeek =
    d.tasks.filter(t => t.completed_at && new Date(t.completed_at).getTime() >= weekAgo).length +
    d.issues.filter(i => i.resolved_at && new Date(i.resolved_at).getTime() >= weekAgo).length;

  return { activeProjects, openIssues, highPriorityIssues, dueThisWeek, awaitingClient, resolvedThisWeek };
}

export interface AttentionItem {
  id: string;
  kind: 'issue' | 'task' | 'workOrder' | 'custody';
  title: string;
  subtitle: string;
  assignee?: string | null;
  dueDate?: string | null;
  daysOverdue: number;
  severity: number; // higher = more urgent
  workOrderId?: string | null;
}

export function getNeedsAttention(d: AggregateInput): AttentionItem[] {
  const items: AttentionItem[] = [];
  const woMap = new Map(d.workOrders.map(w => [w.id, w]));

  // High priority open issues
  d.issues.forEach(i => {
    if (i.status === 'resolved' || i.status === 'closed') return;
    const high = i.priority === 'high' || i.priority === 'critical' || i.priority === 'urgent';
    const days = daysFromNow(i.created_at) ?? 0;
    items.push({
      id: i.id,
      kind: 'issue',
      title: i.title,
      subtitle: i.work_order_id ? (woMap.get(i.work_order_id)?.title ?? 'Issue') : 'Standalone issue',
      daysOverdue: Math.max(0, -days),
      severity: (high ? 100 : 50) + Math.max(0, -days),
      workOrderId: i.work_order_id,
    });
  });

  // Overdue tasks
  d.tasks.forEach(t => {
    if (!isOverdue(t.due_date, t.status)) return;
    const days = -(daysFromNow(t.due_date) ?? 0);
    items.push({
      id: t.id,
      kind: 'task',
      title: t.title,
      subtitle: woMap.get(t.work_order_id)?.title ?? 'Task',
      assignee: t.assigned_to,
      dueDate: t.due_date,
      daysOverdue: days,
      severity: 60 + days * 5,
      workOrderId: t.work_order_id,
    });
  });

  // Overdue work orders
  d.workOrders.forEach(w => {
    if (!isOverdue(w.due_date, w.status)) return;
    const days = -(daysFromNow(w.due_date) ?? 0);
    items.push({
      id: w.id,
      kind: 'workOrder',
      title: w.title,
      subtitle: 'Project overdue',
      assignee: w.assigned_to,
      dueDate: w.due_date,
      daysOverdue: days,
      severity: 80 + days * 5,
      workOrderId: w.id,
    });
  });

  // Awaiting client (open custody handoffs)
  d.custodyEvents.forEach(e => {
    if (e.status !== 'open') return;
    if (!['handoff', 'review', 'approval'].includes(e.event_type)) return;
    items.push({
      id: e.id,
      kind: 'custody',
      title: e.title,
      subtitle: `Awaiting ${e.to_person ?? 'client'}`,
      daysOverdue: 0,
      severity: 40,
      workOrderId: e.work_order_id,
    });
  });

  return items.sort((a, b) => b.severity - a.severity).slice(0, 12);
}

export interface UpcomingItem {
  id: string;
  kind: 'task' | 'workOrder' | 'activity' | 'deal';
  title: string;
  subtitle?: string;
  date: string;
  daysAway: number;
}

export function getUpcoming(d: AggregateInput, daysWindow = 14): UpcomingItem[] {
  const items: UpcomingItem[] = [];
  const woMap = new Map(d.workOrders.map(w => [w.id, w]));

  d.tasks.forEach(t => {
    if (t.status === 'done' || !t.due_date) return;
    const days = daysFromNow(t.due_date) ?? 999;
    if (days < 0 || days > daysWindow) return;
    items.push({
      id: t.id,
      kind: 'task',
      title: t.title,
      subtitle: woMap.get(t.work_order_id)?.title,
      date: t.due_date,
      daysAway: days,
    });
  });

  d.workOrders.forEach(w => {
    if (w.status === 'done' || !w.due_date) return;
    const days = daysFromNow(w.due_date) ?? 999;
    if (days < 0 || days > daysWindow) return;
    items.push({ id: w.id, kind: 'workOrder', title: w.title, subtitle: 'Project due', date: w.due_date, daysAway: days });
  });

  d.activities.forEach(a => {
    if (!a.scheduled_at || a.completed_at) return;
    const days = daysFromNow(a.scheduled_at) ?? 999;
    if (days < 0 || days > daysWindow) return;
    items.push({ id: a.id, kind: 'activity', title: a.title, subtitle: a.type, date: a.scheduled_at, daysAway: days });
  });

  d.deals.forEach(deal => {
    if (!deal.expected_close_date || deal.stage === 'won' || deal.stage === 'lost') return;
    const days = daysFromNow(deal.expected_close_date) ?? 999;
    if (days < 0 || days > daysWindow) return;
    items.push({ id: deal.id, kind: 'deal', title: deal.title, subtitle: `Expected close • ${deal.stage}`, date: deal.expected_close_date, daysAway: days });
  });

  return items.sort((a, b) => a.daysAway - b.daysAway);
}

export interface ProjectHealth {
  workOrder: WorkOrder;
  totalTasks: number;
  doneTasks: number;
  percentDone: number;
  openIssues: number;
  overdueCount: number;
  lastActivity: string | null;
  status: 'on_track' | 'at_risk' | 'blocked' | 'done';
}

export function getProjectHealth(d: AggregateInput): ProjectHealth[] {
  return d.workOrders
    .filter(w => w.status !== 'cancelled')
    .map(w => {
      const woTasks = d.tasks.filter(t => t.work_order_id === w.id);
      const doneTasks = woTasks.filter(t => t.status === 'done').length;
      const total = woTasks.length;
      const percent = total ? Math.round((doneTasks / total) * 100) : 0;
      const openIssues = d.issues.filter(i => i.work_order_id === w.id && i.status !== 'resolved' && i.status !== 'closed').length;
      const overdueCount = woTasks.filter(t => isOverdue(t.due_date, t.status)).length + (isOverdue(w.due_date, w.status) ? 1 : 0);

      const allDates = [w.updated_at, ...woTasks.map(t => t.created_at)].filter(Boolean) as string[];
      const lastActivity = allDates.length ? allDates.sort().reverse()[0] : null;

      let status: ProjectHealth['status'] = 'on_track';
      if (w.status === 'done') status = 'done';
      else if (overdueCount > 0 || openIssues >= 3) status = 'blocked';
      else if (openIssues > 0 || (w.due_date && (daysFromNow(w.due_date) ?? 999) <= 3)) status = 'at_risk';

      return { workOrder: w, totalTasks: total, doneTasks, percentDone: percent, openIssues, overdueCount, lastActivity, status };
    })
    .sort((a, b) => {
      const order = { blocked: 0, at_risk: 1, on_track: 2, done: 3 };
      return order[a.status] - order[b.status];
    });
}
