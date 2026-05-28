// Central status taxonomy for consistent color coding across the dashboard.
// Green = Done, Blue = In Progress, Yellow = Waiting/Due Soon,
// Purple = Awaiting Client, Red = Overdue/Blocked/High, Gray = Backlog.

export type StatusTone = 'done' | 'progress' | 'waiting' | 'external' | 'blocked' | 'idle';

export const TONE_BADGE: Record<StatusTone, string> = {
  done: 'bg-green-500/20 text-green-400 border-green-500/30',
  progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  waiting: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  external: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  blocked: 'bg-destructive/20 text-destructive border-destructive/30',
  idle: 'bg-muted text-muted-foreground border-border',
};

export const TONE_DOT: Record<StatusTone, string> = {
  done: 'bg-green-500',
  progress: 'bg-blue-500',
  waiting: 'bg-yellow-500',
  external: 'bg-purple-500',
  blocked: 'bg-destructive',
  idle: 'bg-muted-foreground',
};

const WORK_ORDER_TONE: Record<string, StatusTone> = {
  pending: 'idle',
  in_progress: 'progress',
  review: 'external',
  done: 'done',
  cancelled: 'idle',
};

const TASK_TONE: Record<string, StatusTone> = {
  todo: 'idle',
  in_progress: 'progress',
  review: 'external',
  done: 'done',
};

const ISSUE_TONE: Record<string, StatusTone> = {
  open: 'blocked',
  in_progress: 'progress',
  resolved: 'done',
  closed: 'done',
};

const DEAL_TONE: Record<string, StatusTone> = {
  lead: 'idle',
  qualified: 'progress',
  proposal: 'waiting',
  negotiation: 'external',
  won: 'done',
  lost: 'blocked',
};

export function workOrderTone(s: string): StatusTone { return WORK_ORDER_TONE[s] ?? 'idle'; }
export function taskTone(s: string): StatusTone { return TASK_TONE[s] ?? 'idle'; }
export function issueTone(s: string): StatusTone { return ISSUE_TONE[s] ?? 'idle'; }
export function dealTone(s: string): StatusTone { return DEAL_TONE[s] ?? 'idle'; }

export function priorityTone(p: string): StatusTone {
  if (p === 'urgent' || p === 'critical' || p === 'high') return 'blocked';
  if (p === 'medium') return 'waiting';
  return 'idle';
}

export function isOverdue(dueDate: string | null, status?: string): boolean {
  if (!dueDate) return false;
  if (status === 'done' || status === 'resolved' || status === 'closed' || status === 'cancelled') return false;
  return new Date(dueDate).getTime() < Date.now() - 24 * 3600 * 1000;
}

export function daysFromNow(date: string | null): number | null {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
