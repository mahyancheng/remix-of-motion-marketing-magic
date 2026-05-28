import { useState } from 'react';
import { useWorkOrders, Issue } from '@/GrowHubHooks/useWorkOrders';
import { useCRM } from '@/GrowHubHooks/useCRM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, CheckCircle2, Clock, AlertTriangle, Briefcase, User, Calendar } from 'lucide-react';
import { DetailDialog } from './DetailDialog';

const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/20 text-accent',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-destructive/20 text-destructive',
};

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

const STATUS_ICON: Record<string, React.ReactNode> = {
  open: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
  in_progress: <Clock className="h-3.5 w-3.5 text-orange-400" />,
  resolved: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
  closed: <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />,
};

export default function IssuesPanel() {
  const { issues, workOrders, upsertIssue, deleteIssue } = useWorkOrders();
  const { contacts } = useCRM();
  const [editIssue, setEditIssue] = useState<Partial<Issue> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openIssueId, setOpenIssueId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editIssue?.title) return;
    await upsertIssue(editIssue as Issue & { title: string });
    setEditIssue(null);
    setDialogOpen(false);
  };

  const openCount = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const openIssue = issues.find(i => i.id === openIssueId) || null;
  const openWo = openIssue ? workOrders.find(w => w.id === openIssue.work_order_id) : null;
  const openContact = openIssue ? contacts.find(c => c.id === openIssue.contact_id) : null;

  const handleUpdate = (patch: Partial<Issue>) => {
    if (!openIssue) return;
    upsertIssue({ ...openIssue, ...patch } as Issue & { title: string });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Issues</h2>
          {openCount > 0 && <Badge className="bg-destructive/20 text-destructive">{openCount} open</Badge>}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setEditIssue({ status: 'open', priority: 'medium' })}>
              <Plus className="h-4 w-4 mr-2" /> Raise Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editIssue?.id ? 'Edit' : 'Raise'} Issue</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Issue Title *" value={editIssue?.title || ''} onChange={e => setEditIssue(p => ({ ...p, title: e.target.value }))} />
              <Textarea placeholder="Description" value={editIssue?.description || ''} onChange={e => setEditIssue(p => ({ ...p, description: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={editIssue?.status || 'open'} onValueChange={v => setEditIssue(p => ({ ...p, status: v, resolved_at: v === 'resolved' ? new Date().toISOString() : p?.resolved_at }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={editIssue?.priority || 'medium'} onValueChange={v => setEditIssue(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PRIORITY_OPTIONS.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Select value={editIssue?.work_order_id || '_none'} onValueChange={v => setEditIssue(p => ({ ...p, work_order_id: v === '_none' ? null : v }))}>
                <SelectTrigger><SelectValue placeholder="Link to Work Order" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {workOrders.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={editIssue?.contact_id || '_none'} onValueChange={v => setEditIssue(p => ({ ...p, contact_id: v === '_none' ? null : v }))}>
                <SelectTrigger><SelectValue placeholder="Link to Client" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button className="w-full bg-accent text-accent-foreground" onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {issues.map(issue => (
          <button
            key={issue.id}
            onClick={() => setOpenIssueId(issue.id)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-card hover:bg-secondary/40 transition-colors border border-border rounded-lg text-left"
          >
            {STATUS_ICON[issue.status]}
            <span className={`text-sm flex-1 min-w-0 truncate ${issue.status === 'resolved' || issue.status === 'closed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {issue.title}
            </span>
            <Badge className={PRIORITY_COLOR[issue.priority] + ' text-[10px] flex-shrink-0'}>{issue.priority}</Badge>
            <Badge variant="outline" className="text-[10px] flex-shrink-0">{issue.status.replace('_', ' ')}</Badge>
          </button>
        ))}
        {issues.length === 0 && <p className="text-center text-muted-foreground py-12">No issues raised yet.</p>}
      </div>

      {openIssue && (
        <DetailDialog
          open={!!openIssueId}
          onOpenChange={(v) => !v && setOpenIssueId(null)}
          kind="issue"
          title={openIssue.title}
          status={openIssue.status}
          statusOptions={STATUS_OPTIONS}
          priority={openIssue.priority}
          priorityOptions={PRIORITY_OPTIONS}
          description={openIssue.description}
          pow={openIssue.resolution || ''}
          breadcrumbs={[{ label: openWo?.title || 'Unlinked' }, { label: 'Issues' }]}
          storagePath={`pow/issues/${openIssue.id}`}
          meta={[
            ...(openWo ? [{ label: 'Work Order', value: openWo.title, icon: <Briefcase className="h-4 w-4" /> }] : []),
            ...(openContact ? [{ label: 'Client', value: openContact.name, icon: <User className="h-4 w-4" /> }] : []),
            { label: 'Created', value: new Date(openIssue.created_at).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> },
            ...(openIssue.resolved_at ? [{ label: 'Resolved', value: new Date(openIssue.resolved_at).toLocaleDateString(), icon: <CheckCircle2 className="h-4 w-4" /> }] : []),
          ]}
          onStatusChange={(s) => handleUpdate({ status: s, resolved_at: s === 'resolved' ? new Date().toISOString() : openIssue.resolved_at })}
          onPriorityChange={(p) => handleUpdate({ priority: p })}
          onPowChange={(p) => handleUpdate({ resolution: p })}
          onDelete={() => {
            deleteIssue(openIssue.id);
            setOpenIssueId(null);
          }}
        />
      )}
    </div>
  );
}
