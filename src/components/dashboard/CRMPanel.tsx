import { useState } from 'react';
import { useCRM, CRMContact, CRMDeal } from '@/GrowHubHooks/useCRM';
import { useWorkOrders } from '@/GrowHubHooks/useWorkOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, Phone, Mail, Building, Edit, User, FileText, ChevronDown, ChevronRight, CheckCircle2, Clock, AlertTriangle, ClipboardList } from 'lucide-react';

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_COLORS: Record<string, string> = {
  lead: 'bg-muted text-muted-foreground',
  qualified: 'bg-blue-500/20 text-blue-400',
  proposal: 'bg-accent/20 text-accent',
  negotiation: 'bg-orange-500/20 text-orange-400',
  won: 'bg-green-500/20 text-green-400',
  lost: 'bg-destructive/20 text-destructive',
};

const CONTACT_TYPES = ['lead', 'client', 'partner', 'vendor'];
const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/20 text-accent',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-destructive/20 text-destructive',
};

interface Props {
  tab: 'contacts' | 'deals';
}

export default function CRMPanel({ tab }: Props) {
  const { contacts, deals, proposals, upsertContact, deleteContact, upsertDeal, deleteDeal, addActivity } = useCRM();
  const { workOrders, tasks, issues, fetchTasks, fetchIssues } = useWorkOrders();
  const [editContact, setEditContact] = useState<Partial<CRMContact> | null>(null);
  const [editDeal, setEditDeal] = useState<Partial<CRMDeal> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveContact = async () => {
    if (!editContact?.name) return;
    await upsertContact(editContact as CRMContact & { name: string });
    setEditContact(null);
    setDialogOpen(false);
  };

  const handleSaveDeal = async () => {
    if (!editDeal?.title) return;
    await upsertDeal(editDeal as CRMDeal & { title: string });
    setEditDeal(null);
    setDialogOpen(false);
  };

  if (tab === 'contacts') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Contacts & Companies</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setEditContact({ type: 'lead' })}>
                <Plus className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editContact?.id ? 'Edit' : 'New'} Contact</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name *" value={editContact?.name || ''} onChange={e => setEditContact(p => ({ ...p, name: e.target.value }))} />
                <Input placeholder="Email" value={editContact?.email || ''} onChange={e => setEditContact(p => ({ ...p, email: e.target.value }))} />
                <Input placeholder="Phone" value={editContact?.phone || ''} onChange={e => setEditContact(p => ({ ...p, phone: e.target.value }))} />
                <Input placeholder="Company" value={editContact?.company || ''} onChange={e => setEditContact(p => ({ ...p, company: e.target.value }))} />
                <Input placeholder="Position" value={editContact?.position || ''} onChange={e => setEditContact(p => ({ ...p, position: e.target.value }))} />
                <Select value={editContact?.type || 'lead'} onValueChange={v => setEditContact(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CONTACT_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
                <Textarea placeholder="Notes" value={editContact?.notes || ''} onChange={e => setEditContact(p => ({ ...p, notes: e.target.value }))} />
                <Select value={editContact?.proposal_id || '_none'} onValueChange={v => setEditContact(p => ({ ...p, proposal_id: v === '_none' ? null : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to Proposal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No proposal</SelectItem>
                    {proposals.map(p => <SelectItem key={p.id} value={p.id}>{p.client_name || p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button className="w-full bg-accent text-accent-foreground" onClick={handleSaveContact}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map(c => (
            <Card key={c.id} className="card-gradient border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-accent" />
                    {c.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{c.type}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditContact(c); setDialogOpen(true); }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteContact(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                {c.company && <div className="flex items-center gap-2"><Building className="h-3.5 w-3.5" />{c.company}</div>}
                {c.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>}
                {c.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>}
                {c.proposal_id && <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-accent" /><span className="text-accent text-xs">Linked to proposal</span></div>}
                {c.notes && <p className="text-xs mt-2 line-clamp-2">{c.notes}</p>}
              </CardContent>
            </Card>
          ))}
          {contacts.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">No contacts yet. Add your first contact to get started.</p>
          )}
        </div>
      </div>
    );
  }

  // Project Monitoring view
  const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'];
  const ISSUE_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

  const TASK_STATUS_COLORS: Record<string, string> = {
    todo: 'bg-muted text-muted-foreground',
    in_progress: 'bg-blue-500/20 text-blue-400',
    review: 'bg-orange-500/20 text-orange-400',
    done: 'bg-green-500/20 text-green-400',
  };
  const ISSUE_STATUS_COLORS: Record<string, string> = {
    open: 'bg-destructive/20 text-destructive',
    in_progress: 'bg-orange-500/20 text-orange-400',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-muted text-muted-foreground',
  };

  const woMap = new Map(workOrders.map(wo => [wo.id, wo]));
  const contactMap = new Map(contacts.map(c => [c.id, c]));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Project Monitoring</h2>

      {/* Tasks by Status */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tasks ({tasks.length})</h3>
        </div>
        <div className="grid grid-cols-4 gap-3 min-h-[200px]">
          {TASK_STATUSES.map(status => {
            const statusTasks = tasks.filter(t => t.status === status);
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <Badge className={TASK_STATUS_COLORS[status]}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                  <span className="text-xs text-muted-foreground">{statusTasks.length}</span>
                </div>
                <div className="space-y-1.5">
                  {statusTasks.map(task => {
                    const wo = woMap.get(task.work_order_id);
                    return (
                      <Card key={task.id} className="border-border">
                        <CardContent className="p-2 space-y-0.5">
                          <span className="text-xs font-medium text-foreground line-clamp-2">{task.title}</span>
                          {wo && <span className="text-[10px] text-muted-foreground truncate block">📋 {wo.title}</span>}
                          {task.assigned_to && <span className="text-[10px] text-muted-foreground">👤 {task.assigned_to}</span>}
                          {task.due_date && <span className="text-[10px] text-muted-foreground block">📅 {new Date(task.due_date).toLocaleDateString()}</span>}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {statusTasks.length === 0 && <p className="text-[10px] text-muted-foreground/50 italic text-center py-4">None</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues by Status */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Issues ({issues.length})</h3>
        </div>
        <div className="grid grid-cols-4 gap-3 min-h-[200px]">
          {ISSUE_STATUSES.map(status => {
            const statusIssues = issues.filter(i => i.status === status);
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <Badge className={ISSUE_STATUS_COLORS[status]}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                  <span className="text-xs text-muted-foreground">{statusIssues.length}</span>
                </div>
                <div className="space-y-1.5">
                  {statusIssues.map(issue => {
                    const wo = issue.work_order_id ? woMap.get(issue.work_order_id) : null;
                    const contact = issue.contact_id ? contactMap.get(issue.contact_id) : null;
                    return (
                      <Card key={issue.id} className="border-border">
                        <CardContent className="p-2 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground line-clamp-2">{issue.title}</span>
                            <Badge className={`${PRIORITY_COLOR[issue.priority] || ''} text-[8px] flex-shrink-0 ml-1`}>{issue.priority}</Badge>
                          </div>
                          {wo && <span className="text-[10px] text-muted-foreground truncate block">📋 {wo.title}</span>}
                          {contact && <span className="text-[10px] text-muted-foreground block">👤 {contact.name}</span>}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {statusIssues.length === 0 && <p className="text-[10px] text-muted-foreground/50 italic text-center py-4">None</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, contact, relatedWOs, relatedTasks, relatedIssues, doneTasks, openIssues, onEdit, onDelete }: {
  deal: any;
  contact: any;
  relatedWOs: any[];
  relatedTasks: any[];
  relatedIssues: any[];
  doneTasks: number;
  openIssues: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasLinkedData = relatedTasks.length > 0 || relatedIssues.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border hover:border-accent/40 transition-colors overflow-hidden">
        <CardContent className="p-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              {hasLinkedData && (
                <CollapsibleTrigger asChild>
                  <button className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                </CollapsibleTrigger>
              )}
              <span className="text-sm font-medium truncate">{deal.title}</span>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {deal.value > 0 && <p className="text-xs text-accent">RM {deal.value.toLocaleString()}</p>}
          {contact && <p className="text-xs text-muted-foreground">{contact.name}</p>}
          {/* Summary badges */}
          {hasLinkedData && (
            <div className="flex gap-1.5 flex-wrap pt-1">
              {relatedTasks.length > 0 && (
                <Badge variant="outline" className="text-[9px] gap-1 py-0">
                  <ClipboardList className="h-2.5 w-2.5" />
                  {doneTasks}/{relatedTasks.length}
                </Badge>
              )}
              {openIssues > 0 && (
                <Badge className="bg-destructive/20 text-destructive text-[9px] gap-1 py-0">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {openIssues}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* Expanded: grouped by status */}
        <CollapsibleContent>
          <div className="border-t border-border bg-secondary/10 p-2 space-y-3">
            {/* Tasks grouped by status */}
            {relatedTasks.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" /> Tasks
                </span>
                {['todo', 'in_progress', 'review', 'done'].map(status => {
                  const statusTasks = relatedTasks.filter(t => t.status === status);
                  if (statusTasks.length === 0) return null;
                  return (
                    <div key={status} className="space-y-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider pl-1">
                        {status.replace('_', ' ')} ({statusTasks.length})
                      </span>
                      {statusTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-background/50 text-[11px]">
                          {task.status === 'done'
                            ? <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                            : <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          }
                          <span className={`truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Issues grouped by status */}
            {relatedIssues.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Issues
                </span>
                {['open', 'in_progress', 'resolved', 'closed'].map(status => {
                  const statusIssues = relatedIssues.filter(i => i.status === status);
                  if (statusIssues.length === 0) return null;
                  return (
                    <div key={status} className="space-y-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider pl-1">
                        {status.replace('_', ' ')} ({statusIssues.length})
                      </span>
                      {statusIssues.map(issue => (
                        <div key={issue.id} className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-destructive/5 text-[11px]">
                          <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
                          <span className="truncate text-foreground">{issue.title}</span>
                          <Badge className="bg-destructive/20 text-destructive text-[8px] ml-auto flex-shrink-0">{issue.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {relatedTasks.length === 0 && relatedIssues.length === 0 && (
              <p className="text-[10px] text-muted-foreground italic text-center py-1">No linked tasks or issues</p>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
