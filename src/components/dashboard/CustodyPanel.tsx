import { useState } from 'react';
import { useWorkOrders, CustodyEvent } from '@/GrowHubHooks/useWorkOrders';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ArrowRight, FileText, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

const EVENT_TYPES = ['created', 'handoff', 'review', 'approval', 'revision', 'delivered', 'issue_raised', 'issue_resolved'];

const EVENT_ICON: Record<string, React.ReactNode> = {
  created: <FileText className="h-4 w-4 text-accent" />,
  handoff: <ArrowRight className="h-4 w-4 text-blue-400" />,
  review: <Shield className="h-4 w-4 text-orange-400" />,
  approval: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  revision: <AlertCircle className="h-4 w-4 text-orange-400" />,
  delivered: <CheckCircle2 className="h-4 w-4 text-accent" />,
  issue_raised: <AlertCircle className="h-4 w-4 text-destructive" />,
  issue_resolved: <CheckCircle2 className="h-4 w-4 text-green-400" />,
};

export default function CustodyPanel() {
  const { custodyEvents, workOrders, addCustodyEvent } = useWorkOrders();
  const [newEvent, setNewEvent] = useState<Partial<CustodyEvent>>({ event_type: 'handoff', status: 'open' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = async () => {
    if (!newEvent.title) return;
    await addCustodyEvent(newEvent as Omit<CustodyEvent, 'id' | 'created_at'>);
    setNewEvent({ event_type: 'handoff', status: 'open' });
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Chain of Custody</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" /> Log Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Custody Event</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title *" value={newEvent.title || ''} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
              <Select value={newEvent.event_type || 'handoff'} onValueChange={v => setNewEvent(p => ({ ...p, event_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={newEvent.work_order_id || '_none'} onValueChange={v => setNewEvent(p => ({ ...p, work_order_id: v === '_none' ? null : v }))}>
                <SelectTrigger><SelectValue placeholder="Link to Work Order" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {workOrders.map(w => <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="From (person)" value={newEvent.from_person || ''} onChange={e => setNewEvent(p => ({ ...p, from_person: e.target.value }))} />
                <Input placeholder="To (person)" value={newEvent.to_person || ''} onChange={e => setNewEvent(p => ({ ...p, to_person: e.target.value }))} />
              </div>
              <Input placeholder="Document Name (optional)" value={newEvent.document_name || ''} onChange={e => setNewEvent(p => ({ ...p, document_name: e.target.value }))} />
              <Textarea placeholder="Description" value={newEvent.description || ''} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} />
              <Button className="w-full bg-accent text-accent-foreground" onClick={handleAdd}>Log Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 border-l-2 border-border space-y-4">
        {custodyEvents.map(ev => {
          const wo = workOrders.find(w => w.id === ev.work_order_id);
          return (
            <div key={ev.id} className="relative">
              <div className="absolute -left-[29px] top-1 rounded-full bg-card p-1 border border-border">
                {EVENT_ICON[ev.event_type] || <FileText className="h-4 w-4" />}
              </div>
              <Card className="border-border">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ev.title}</span>
                      <Badge variant="outline" className="text-xs">{ev.event_type.replace('_', ' ')}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</span>
                  </div>
                  {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {ev.from_person && ev.to_person && (
                      <span className="flex items-center gap-1">{ev.from_person} <ArrowRight className="h-3 w-3" /> {ev.to_person}</span>
                    )}
                    {ev.document_name && <span>📄 {ev.document_name}</span>}
                    {wo && <span>• WO: {wo.title}</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
        {custodyEvents.length === 0 && <p className="text-center text-muted-foreground py-12 -ml-6">No events logged yet.</p>}
      </div>
    </div>
  );
}
