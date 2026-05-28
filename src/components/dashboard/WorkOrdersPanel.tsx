import { useState, useCallback } from 'react';
import { useWorkOrders, WorkOrder } from '@/GrowHubHooks/useWorkOrders';
import { useCRM } from '@/GrowHubHooks/useCRM';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Clock, CheckCircle2, AlertCircle, Timer, AlertTriangle, ArrowRight, FileText, Shield, User, Calendar, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { DetailDialog } from './DetailDialog';

const STATUSES = ['pending', 'in_progress', 'review', 'done', 'cancelled'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const TASK_STATUS_OPTIONS = ['todo', 'in_progress', 'review', 'done'];
const ISSUE_STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];
const ISSUE_PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  in_progress: <Timer className="h-3.5 w-3.5 text-blue-400" />,
  review: <AlertCircle className="h-3.5 w-3.5 text-orange-400" />,
  done: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
  cancelled: <AlertCircle className="h-3.5 w-3.5 text-destructive" />,
};

const TASK_STATUS_ICON: Record<string, React.ReactNode> = {
  todo: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  in_progress: <Timer className="h-3.5 w-3.5 text-blue-400" />,
  review: <AlertCircle className="h-3.5 w-3.5 text-orange-400" />,
  done: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
};

const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/20 text-accent',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-destructive/20 text-destructive',
  critical: 'bg-destructive/20 text-destructive',
};

const EVENT_ICON: Record<string, React.ReactNode> = {
  created: <FileText className="h-3.5 w-3.5 text-accent" />,
  handoff: <ArrowRight className="h-3.5 w-3.5 text-blue-400" />,
  review: <Shield className="h-3.5 w-3.5 text-orange-400" />,
  approval: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
  revision: <AlertCircle className="h-3.5 w-3.5 text-orange-400" />,
  delivered: <CheckCircle2 className="h-3.5 w-3.5 text-accent" />,
  issue_raised: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
  issue_resolved: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
};

export default function WorkOrdersPanel() {
  const {
    workOrders, tasks, timeEntries, custodyEvents, issues,
    upsertWorkOrder, deleteWorkOrder, upsertTask, deleteTask,
    addTimeEntry, addCustodyEvent, upsertIssue, deleteIssue,
    fetchTasks, fetchTimeEntries, fetchCustodyEvents,
  } = useWorkOrders();
  const { contacts, proposals } = useCRM();

  const [editWO, setEditWO] = useState<Partial<WorkOrder> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWO, setSelectedWO] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigned, setNewTaskAssigned] = useState('');
  const [logHours, setLogHours] = useState({ hours: '', description: '' });

  // Detail dialogs
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [openIssueId, setOpenIssueId] = useState<string | null>(null);

  // Issue dialog
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [editIssue, setEditIssue] = useState<any>(null);

  // Custody dialog
  const [custodyDialogOpen, setCustodyDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<any>({ event_type: 'handoff', status: 'open' });

  const handleSaveWO = async () => {
    if (!editWO?.title) return;
    await upsertWorkOrder(editWO as WorkOrder & { title: string });
    setEditWO(null);
    setDialogOpen(false);
  };

  const handleSelectWO = (id: string) => {
    setSelectedWO(id === selectedWO ? null : id);
    if (id !== selectedWO) {
      fetchTasks(id);
      fetchTimeEntries(id);
      fetchCustodyEvents(id);
    }
  };

  // Auto-log custody event helper
  const autoLogCustody = useCallback(async (woId: string, eventType: string, title: string, description?: string) => {
    await addCustodyEvent({
      work_order_id: woId,
      event_type: eventType,
      title,
      description: description || null,
      from_person: null,
      to_person: null,
      status: 'open',
      document_name: null,
    });
  }, [addCustodyEvent]);

  // Task update with auto-logging
  const handleTaskUpdate = useCallback(async (updated: any, original: any) => {
    await upsertTask(updated);
    const woId = updated.work_order_id;
    if (!woId) return;

    if (original.status !== updated.status) {
      autoLogCustody(woId, updated.status === 'done' ? 'approval' : 'revision',
        `Task "${updated.title}" → ${updated.status}`,
        `Status changed from ${original.status} to ${updated.status}`);
    }
    if (updated.pow && updated.pow !== original.pow) {
      const isImage = updated.pow.includes('![POW Image]');
      autoLogCustody(woId, 'delivered',
        `POW updated: "${updated.title}"`,
        isImage ? `Image evidence added\n${updated.pow.split('\n').pop()}` : `POW: ${updated.pow.slice(-200)}`);
    }
  }, [upsertTask, autoLogCustody]);

  const handleIssueUpdate = useCallback(async (updated: any, original: any) => {
    await upsertIssue(updated);
    const woId = updated.work_order_id || selectedWO;
    if (!woId) return;

    if (original.status !== updated.status) {
      const eventType = (updated.status === 'resolved' || updated.status === 'closed') ? 'issue_resolved' : 'issue_raised';
      autoLogCustody(woId, eventType,
        `Issue "${updated.title}" → ${updated.status}`,
        `Status changed from ${original.status} to ${updated.status}`);
    }
    if (updated.resolution && updated.resolution !== original.resolution) {
      autoLogCustody(woId, 'issue_resolved',
        `Issue resolved: "${updated.title}"`,
        `Resolution: ${updated.resolution}`);
    }
    if (updated.pow && updated.pow !== original.pow) {
      const isImage = updated.pow.includes('![POW Image]');
      autoLogCustody(woId, 'delivered',
        `Evidence added: "${updated.title}"`,
        isImage ? `Image evidence added\n${updated.pow.split('\n').pop()}` : `POW: ${updated.pow.slice(-200)}`);
    }
  }, [upsertIssue, autoLogCustody, selectedWO]);

  const handleAddTask = async () => {
    if (!newTaskTitle || !selectedWO) return;
    await upsertTask({ title: newTaskTitle, work_order_id: selectedWO, status: 'todo', assigned_to: newTaskAssigned || null });
    autoLogCustody(selectedWO, 'created', `Task created: "${newTaskTitle}"`);
    setNewTaskTitle('');
    setNewTaskAssigned('');
  };

  const handleLogTime = async () => {
    if (!logHours.hours || !selectedWO) return;
    await addTimeEntry({ work_order_id: selectedWO, task_id: null, hours: Number(logHours.hours), description: logHours.description, date: new Date().toISOString().split('T')[0] });
    setLogHours({ hours: '', description: '' });
  };

  const handleSaveIssue = async () => {
    if (!editIssue?.title) return;
    await upsertIssue({ ...editIssue, work_order_id: selectedWO });
    if (!editIssue.id && selectedWO) {
      autoLogCustody(selectedWO, 'issue_raised', `Issue raised: "${editIssue.title}"`, editIssue.description || undefined);
    }
    setEditIssue(null);
    setIssueDialogOpen(false);
  };

  const handleAddCustody = async () => {
    if (!newEvent.title) return;
    await addCustodyEvent({ ...newEvent, work_order_id: selectedWO });
    setNewEvent({ event_type: 'handoff', status: 'open' });
    setCustodyDialogOpen(false);
  };

  const selectedTasks = tasks.filter(t => t.work_order_id === selectedWO);
  const selectedTimeEntries = timeEntries.filter(t => t.work_order_id === selectedWO);
  const selectedIssues = issues.filter(i => i.work_order_id === selectedWO);
  const selectedCustody = custodyEvents.filter(e => e.work_order_id === selectedWO);
  const totalHours = selectedTimeEntries.reduce((s, e) => s + Number(e.hours), 0);
  const taskProgress = selectedTasks.length ? (selectedTasks.filter(t => t.status === 'done').length / selectedTasks.length) * 100 : 0;
  const openIssues = selectedIssues.filter(i => i.status === 'open' || i.status === 'in_progress').length;

  // Open dialog data
  const openTask = selectedTasks.find(t => t.id === openTaskId) || null;
  const openIssueObj = selectedIssues.find(i => i.id === openIssueId) || null;
  const selectedWOTitle = workOrders.find(w => w.id === selectedWO)?.title || '';

  return (
    <div className="flex h-full">
      {/* Client Work Orders List */}
      <div className="w-[340px] border-r border-border p-4 overflow-auto space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Client Projects</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setEditWO({ status: 'pending', priority: 'medium' })}>
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editWO?.id ? 'Edit' : 'New'} Client Project</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Project Title *" value={editWO?.title || ''} onChange={e => setEditWO(p => ({ ...p, title: e.target.value }))} />
                <Textarea placeholder="Description" value={editWO?.description || ''} onChange={e => setEditWO(p => ({ ...p, description: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={editWO?.status || 'pending'} onValueChange={v => setEditWO(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={editWO?.priority || 'medium'} onValueChange={v => setEditWO(p => ({ ...p, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Input placeholder="Assigned To" value={editWO?.assigned_to || ''} onChange={e => setEditWO(p => ({ ...p, assigned_to: e.target.value }))} />
                <Select value={editWO?.contact_id || '_none'} onValueChange={v => setEditWO(p => ({ ...p, contact_id: v === '_none' ? null : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to Client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No client</SelectItem>
                    {contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={editWO?.proposal_id || '_none'} onValueChange={v => setEditWO(p => ({ ...p, proposal_id: v === '_none' ? null : v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to Proposal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No proposal</SelectItem>
                    {proposals.map(p => <SelectItem key={p.id} value={p.id}>{p.client_name || p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={editWO?.due_date || ''} onChange={e => setEditWO(p => ({ ...p, due_date: e.target.value }))} />
                <Button className="w-full bg-accent text-accent-foreground" onClick={handleSaveWO}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {workOrders.map(wo => {
          const contact = contacts.find(c => c.id === wo.contact_id);
          const woTasks = tasks.filter(t => t.work_order_id === wo.id);
          const woDone = woTasks.filter(t => t.status === 'done').length;
          const woIssues = issues.filter(i => i.work_order_id === wo.id && (i.status === 'open' || i.status === 'in_progress')).length;
          return (
            <Card
              key={wo.id}
              className={`cursor-pointer transition-colors border-border hover:border-accent/40 ${selectedWO === wo.id ? 'border-accent bg-accent/5' : ''}`}
              onClick={() => handleSelectWO(wo.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {STATUS_ICON[wo.status]}
                    <span className="font-medium text-sm truncate">{wo.title}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Badge className={PRIORITY_COLOR[wo.priority] + ' text-[10px] px-1.5'}>{wo.priority}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {contact && <span>{contact.name}</span>}
                  {wo.assigned_to && <span>• {wo.assigned_to}</span>}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {woTasks.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">{woDone}/{woTasks.length} tasks</span>
                  )}
                  {woIssues > 0 && (
                    <span className="text-[10px] text-destructive flex items-center gap-0.5">
                      <AlertTriangle className="h-2.5 w-2.5" /> {woIssues} issues
                    </span>
                  )}
                  {wo.due_date && <span className="text-[10px] text-muted-foreground">Due {new Date(wo.due_date).toLocaleDateString()}</span>}
                </div>
                {woTasks.length > 0 && (
                  <Progress value={(woDone / woTasks.length) * 100} className="h-1 mt-2" />
                )}
              </CardContent>
            </Card>
          );
        })}
        {workOrders.length === 0 && <p className="text-center text-muted-foreground py-12 text-sm">No client projects yet.</p>}
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-auto">
        {selectedWO ? (
          <Tabs defaultValue="tasks" className="h-full flex flex-col">
            <div className="border-b border-border bg-card/50 px-4 flex items-center justify-between">
              <TabsList className="h-10 bg-transparent gap-1">
                <TabsTrigger value="tasks" className="text-xs gap-1.5 data-[state=active]:bg-secondary">
                  Tasks {selectedTasks.length > 0 && `(${selectedTasks.length})`}
                </TabsTrigger>
                <TabsTrigger value="issues" className="text-xs gap-1.5 data-[state=active]:bg-secondary">
                  <AlertTriangle className="h-3 w-3" />
                  Issues {openIssues > 0 && <Badge className="bg-destructive/20 text-destructive text-[10px] px-1 ml-1">{openIssues}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="custody" className="text-xs gap-1.5 data-[state=active]:bg-secondary">
                  <Shield className="h-3 w-3" />
                  Custody
                </TabsTrigger>
                <TabsTrigger value="time" className="text-xs gap-1.5 data-[state=active]:bg-secondary">
                  <Clock className="h-3 w-3" />
                  Time ({totalHours.toFixed(1)}h)
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditWO(workOrders.find(w => w.id === selectedWO)!); setDialogOpen(true); }}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { deleteWorkOrder(selectedWO); setSelectedWO(null); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Tasks Tab - click row to open DetailDialog */}
            <TabsContent value="tasks" className="flex-1 m-0 overflow-auto p-4 space-y-2 data-[state=inactive]:hidden">
              {taskProgress > 0 && <Progress value={taskProgress} className="h-2 mb-2" />}

              {selectedTasks.map(t => {
                const taskHours = selectedTimeEntries.filter(e => e.task_id === t.id).reduce((s, e) => s + Number(e.hours), 0);
                return (
                  <div key={t.id} className="flex items-center gap-2 px-3 py-2 bg-card hover:bg-secondary/40 transition-colors border border-border rounded-lg">
                    <button
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskUpdate({ ...t, status: t.status === 'done' ? 'todo' : 'done', completed_at: t.status === 'done' ? null : new Date().toISOString() }, t);
                      }}
                    >
                      <CheckCircle2 className={`h-4 w-4 ${t.status === 'done' ? 'text-accent' : 'text-muted-foreground/40 hover:text-accent'} transition-colors`} />
                    </button>
                    <button onClick={() => setOpenTaskId(t.id)} className="flex-1 min-w-0 flex items-center gap-2 text-left">
                      <span className={`text-sm flex-1 min-w-0 truncate ${t.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{t.title}</span>
                      <Badge variant="outline" className="text-[10px] flex-shrink-0">{t.status.replace('_', ' ')}</Badge>
                      {taskHours > 0 && <span className="text-[10px] text-accent flex-shrink-0">{taskHours.toFixed(1)}h</span>}
                      {t.assigned_to && <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.assigned_to}</span>}
                      {t.due_date && <span className="text-[10px] text-muted-foreground flex-shrink-0">{new Date(t.due_date).toLocaleDateString()}</span>}
                    </button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive flex-shrink-0" onClick={() => deleteTask(t.id, selectedWO)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}

              {selectedTasks.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No tasks yet</p>}

              <div className="flex gap-2 pt-2">
                <Input placeholder="New task..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} className="flex-1" />
                <Input placeholder="Assign to" value={newTaskAssigned} onChange={e => setNewTaskAssigned(e.target.value)} className="w-28" />
                <Button size="sm" className="bg-accent text-accent-foreground" onClick={handleAddTask}>Add</Button>
              </div>
            </TabsContent>

            {/* Issues Tab - click row to open DetailDialog */}
            <TabsContent value="issues" className="flex-1 m-0 overflow-auto p-4 space-y-2 data-[state=inactive]:hidden">
              <div className="flex justify-end">
                <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => setEditIssue({ status: 'open', priority: 'medium' })}>
                      <Plus className="h-4 w-4 mr-1" /> Raise Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editIssue?.id ? 'Edit' : 'Raise'} Issue</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Issue Title *" value={editIssue?.title || ''} onChange={e => setEditIssue((p: any) => ({ ...p, title: e.target.value }))} />
                      <Textarea placeholder="Description" value={editIssue?.description || ''} onChange={e => setEditIssue((p: any) => ({ ...p, description: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={editIssue?.status || 'open'} onValueChange={v => setEditIssue((p: any) => ({ ...p, status: v, resolved_at: v === 'resolved' ? new Date().toISOString() : p?.resolved_at }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{ISSUE_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={editIssue?.priority || 'medium'} onValueChange={v => setEditIssue((p: any) => ({ ...p, priority: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{ISSUE_PRIORITY_OPTIONS.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      {(editIssue?.status === 'resolved' || editIssue?.status === 'closed') && (
                        <Textarea placeholder="Resolution details" value={editIssue?.resolution || ''} onChange={e => setEditIssue((p: any) => ({ ...p, resolution: e.target.value }))} />
                      )}
                      <Button className="w-full bg-accent text-accent-foreground" onClick={handleSaveIssue}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedIssues.map(issue => (
                <div key={issue.id} className="flex items-center gap-2 px-3 py-2 bg-card hover:bg-secondary/40 transition-colors border border-border rounded-lg">
                  <button
                    className="flex-shrink-0"
                    onClick={() => {
                      const isResolved = issue.status === 'resolved' || issue.status === 'closed';
                      handleIssueUpdate({ ...issue, status: isResolved ? 'open' : 'resolved', resolved_at: isResolved ? null : new Date().toISOString() }, issue);
                    }}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${issue.status === 'resolved' || issue.status === 'closed' ? 'text-green-400' : 'text-muted-foreground/40 hover:text-green-400'} transition-colors`} />
                  </button>
                  <button onClick={() => setOpenIssueId(issue.id)} className="flex-1 min-w-0 flex items-center gap-2 text-left">
                    <span className={`text-sm flex-1 min-w-0 truncate ${issue.status === 'resolved' || issue.status === 'closed' ? 'line-through text-muted-foreground' : ''}`}>{issue.title}</span>
                    <Badge className={PRIORITY_COLOR[issue.priority] + ' text-[10px] flex-shrink-0'}>{issue.priority}</Badge>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">{issue.status.replace('_', ' ')}</Badge>
                  </button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive flex-shrink-0" onClick={() => deleteIssue(issue.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {selectedIssues.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No issues for this project.</p>}
            </TabsContent>

            {/* Custody Tab */}
            <TabsContent value="custody" className="flex-1 m-0 overflow-auto p-4 space-y-3 data-[state=inactive]:hidden">
              <div className="flex justify-end">
                <Dialog open={custodyDialogOpen} onOpenChange={setCustodyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-accent text-accent-foreground">
                      <Plus className="h-4 w-4 mr-1" /> Log Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Log Custody Event</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Title *" value={newEvent.title || ''} onChange={e => setNewEvent((p: any) => ({ ...p, title: e.target.value }))} />
                      <Select value={newEvent.event_type || 'handoff'} onValueChange={v => setNewEvent((p: any) => ({ ...p, event_type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['created', 'handoff', 'review', 'approval', 'revision', 'delivered', 'issue_raised', 'issue_resolved'].map(t => (
                            <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="From" value={newEvent.from_person || ''} onChange={e => setNewEvent((p: any) => ({ ...p, from_person: e.target.value }))} />
                        <Input placeholder="To" value={newEvent.to_person || ''} onChange={e => setNewEvent((p: any) => ({ ...p, to_person: e.target.value }))} />
                      </div>
                      <Input placeholder="Document Name" value={newEvent.document_name || ''} onChange={e => setNewEvent((p: any) => ({ ...p, document_name: e.target.value }))} />
                      <Textarea placeholder="Description" value={newEvent.description || ''} onChange={e => setNewEvent((p: any) => ({ ...p, description: e.target.value }))} />
                      <Button className="w-full bg-accent text-accent-foreground" onClick={handleAddCustody}>Log</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative pl-6 border-l-2 border-border space-y-3">
                {selectedCustody.map(ev => (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-[25px] top-1 rounded-full bg-card p-0.5 border border-border">
                      {EVENT_ICON[ev.event_type] || <FileText className="h-3.5 w-3.5" />}
                    </div>
                    <Card className="border-border">
                      <CardContent className="p-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs">{ev.title}</span>
                            <Badge variant="outline" className="text-[10px]">{ev.event_type.replace('_', ' ')}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive" onClick={async () => {
                              await supabase.from('custody_events').delete().eq('id', ev.id);
                              fetchCustodyEvents(selectedWO || undefined);
                            }}>
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </div>
                        {ev.description && (
                          <div className="mt-1 space-y-1">
                            {ev.description.split('\n').map((line: string, i: number) => {
                              const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
                              if (imgMatch) return <img key={i} src={imgMatch[1]} alt="Evidence" className="max-w-full max-h-32 rounded border border-border mt-1" />;
                              return <p key={i} className="text-xs text-muted-foreground">{line}</p>;
                            })}
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
                          {ev.from_person && ev.to_person && <span>{ev.from_person} → {ev.to_person}</span>}
                          {ev.document_name && <span>📄 {ev.document_name}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
              {selectedCustody.length === 0 && <p className="text-center text-muted-foreground text-sm py-8 -ml-6">No custody events logged.</p>}
            </TabsContent>

            {/* Time Tab */}
            <TabsContent value="time" className="flex-1 m-0 overflow-auto p-4 space-y-3 data-[state=inactive]:hidden">
              <div className="space-y-1.5 max-h-60 overflow-auto">
                {selectedTimeEntries.map(e => (
                  <div key={e.id} className="flex justify-between text-sm px-3 py-1.5 bg-secondary/30 rounded">
                    <span>{e.description || 'Work'}</span>
                    <span className="text-accent">{Number(e.hours).toFixed(1)}h • {e.date}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input type="number" step="0.5" placeholder="Hours" className="w-20" value={logHours.hours} onChange={e => setLogHours(p => ({ ...p, hours: e.target.value }))} />
                <Input placeholder="What did you do?" value={logHours.description} onChange={e => setLogHours(p => ({ ...p, description: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleLogTime()} className="flex-1" />
                <Button size="sm" className="bg-accent text-accent-foreground" onClick={handleLogTime}>Log</Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a client project to view tasks, issues, custody & time tracking
          </div>
        )}
      </div>

      {/* Task Detail Dialog */}
      {openTask && (
        <DetailDialog
          open={!!openTaskId}
          onOpenChange={(v) => !v && setOpenTaskId(null)}
          kind="task"
          title={openTask.title}
          status={openTask.status}
          statusOptions={TASK_STATUS_OPTIONS}
          description={null}
          pow={openTask.pow || ''}
          breadcrumbs={[{ label: selectedWOTitle }, { label: 'Tasks' }]}
          storagePath={`pow/${selectedWO}/${openTask.id}`}
          meta={[
            { label: 'Project', value: selectedWOTitle, icon: <Briefcase className="h-4 w-4" /> },
            ...(openTask.assigned_to ? [{ label: 'Assigned to', value: openTask.assigned_to, icon: <User className="h-4 w-4" /> }] : []),
            ...(openTask.due_date ? [{ label: 'Due date', value: new Date(openTask.due_date).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> }] : []),
            { label: 'Created', value: new Date(openTask.created_at).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> },
            ...(openTask.completed_at ? [{ label: 'Completed', value: new Date(openTask.completed_at).toLocaleDateString(), icon: <CheckCircle2 className="h-4 w-4" /> }] : []),
          ]}
          onStatusChange={(s) => handleTaskUpdate({ ...openTask, status: s, completed_at: s === 'done' ? new Date().toISOString() : null }, openTask)}
          onPowChange={(p) => handleTaskUpdate({ ...openTask, pow: p }, openTask)}
          onDelete={() => {
            deleteTask(openTask.id, selectedWO!);
            setOpenTaskId(null);
          }}
        />
      )}

      {/* Issue Detail Dialog */}
      {openIssueObj && (
        <DetailDialog
          open={!!openIssueId}
          onOpenChange={(v) => !v && setOpenIssueId(null)}
          kind="issue"
          title={openIssueObj.title}
          status={openIssueObj.status}
          statusOptions={ISSUE_STATUS_OPTIONS}
          priority={openIssueObj.priority}
          priorityOptions={ISSUE_PRIORITY_OPTIONS}
          description={openIssueObj.description}
          pow={openIssueObj.pow || ''}
          breadcrumbs={[{ label: selectedWOTitle }, { label: 'Issues' }]}
          storagePath={`pow/${selectedWO}/issues/${openIssueObj.id}`}
          meta={[
            { label: 'Project', value: selectedWOTitle, icon: <Briefcase className="h-4 w-4" /> },
            { label: 'Created', value: new Date(openIssueObj.created_at).toLocaleDateString(), icon: <Calendar className="h-4 w-4" /> },
            ...(openIssueObj.resolved_at ? [{ label: 'Resolved', value: new Date(openIssueObj.resolved_at).toLocaleDateString(), icon: <CheckCircle2 className="h-4 w-4" /> }] : []),
          ]}
          tags={openIssueObj.resolution ? [{ label: `Resolution: ${openIssueObj.resolution.slice(0, 60)}`, tone: 'secondary' }] : []}
          onStatusChange={(s) => handleIssueUpdate({ ...openIssueObj, status: s, resolved_at: (s === 'resolved' || s === 'closed') ? new Date().toISOString() : null }, openIssueObj)}
          onPriorityChange={(p) => handleIssueUpdate({ ...openIssueObj, priority: p }, openIssueObj)}
          onPowChange={(p) => handleIssueUpdate({ ...openIssueObj, pow: p }, openIssueObj)}
          onDelete={() => {
            deleteIssue(openIssueObj.id);
            setOpenIssueId(null);
          }}
        />
      )}
    </div>
  );
}
