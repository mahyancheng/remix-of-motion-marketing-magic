import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Loader2, Plus, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

interface Contract {
  id: string;
  client_name: string;
  customer_id: string | null;
  quotation_number: string | null;
  currency: string;
  total_amount: number;
  monthly_installment: number;
  installment_count: number;
  installments_issued: number;
  start_date: string;
  next_invoice_date: string;
  status: string;
  notes: string | null;
}

const fmtMoney = (v: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency, minimumFractionDigits: 2 }).format(v);

const STATUS_OPTIONS = ['active', 'paused', 'completed', 'cancelled'];

const Contracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_id: '',
    client_name: '',
    customer_id: '',
    quotation_number: '',
    total_amount: '',
    monthly_installment: '',
    installment_count: '12',
    start_date: new Date().toISOString().slice(0, 10),
    next_invoice_date: new Date().toISOString().slice(0, 10),
  });

  const load = async () => {
    setLoading(true);
    const [{ data, error }, { data: cl }] = await Promise.all([
      supabase.from('contracts').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ]);
    if (error) toast({ variant: 'destructive', title: 'Failed to load', description: error.message });
    else setContracts((data as Contract[]) || []);
    setClients((cl as Array<{ id: string; name: string }>) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.client_name || !form.monthly_installment || !form.installment_count) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Client, monthly amount, and term are required.' });
      return;
    }
    const monthly = Number(form.monthly_installment);
    const months = Number(form.installment_count);
    const total = form.total_amount ? Number(form.total_amount) : monthly * months;

    const { error } = await supabase.from('contracts').insert({
      client_id: form.client_id || null,
      client_name: form.client_name,
      customer_id: form.customer_id || null,
      quotation_number: form.quotation_number || null,
      total_amount: total,
      monthly_installment: monthly,
      installment_count: months,
      start_date: form.start_date,
      next_invoice_date: form.next_invoice_date,
      status: 'active',
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Create failed', description: error.message });
      return;
    }
    toast({ title: 'Contract created' });
    setOpen(false);
    setForm({ ...form, client_name: '', customer_id: '', quotation_number: '', total_amount: '', monthly_installment: '' });
    load();
  };

  const generateNow = async (id: string) => {
    setGenerating(id);
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contracts-invoicing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'generate-now', contract_id: id }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed');
      toast({ title: 'Invoice generated', description: json.invoice?.invoice_number });
      load();
    } catch (e) {
      toast({ variant: 'destructive', title: 'Failed', description: e instanceof Error ? e.message : 'Error' });
    } finally {
      setGenerating(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contracts').update({ status }).eq('id', id);
    if (error) toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    else load();
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-4 py-3">
          <div className="container mx-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />Contracts
            </h1>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}>View Invoices</Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" />New Contract</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Recurring Contract</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div>
                      <Label>Client *</Label>
                      <Select
                        value={form.client_id}
                        onValueChange={(v) => {
                          const c = clients.find((x) => x.id === v);
                          setForm({ ...form, client_id: v, client_name: c?.name || '' });
                        }}
                      >
                        <SelectTrigger><SelectValue placeholder="Select a client..." /></SelectTrigger>
                        <SelectContent>
                          {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Customer ID</Label><Input value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} /></div>
                      <div><Label>Quote #</Label><Input value={form.quotation_number} onChange={(e) => setForm({ ...form, quotation_number: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><Label>Monthly (RM) *</Label><Input type="number" value={form.monthly_installment} onChange={(e) => setForm({ ...form, monthly_installment: e.target.value })} /></div>
                      <div><Label>Months *</Label><Input type="number" value={form.installment_count} onChange={(e) => setForm({ ...form, installment_count: e.target.value })} /></div>
                      <div><Label>Total (auto)</Label><Input type="number" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} placeholder="auto" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Start date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                      <div><Label>Next invoice date</Label><Input type="date" value={form.next_invoice_date} onChange={(e) => setForm({ ...form, next_invoice_date: e.target.value })} /></div>
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleCreate}>Create</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : contracts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold">No contracts yet</h2>
              <p className="text-muted-foreground text-sm mt-1">Contracts are auto-created when a quotation is signed, or add one manually.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Quote</th>
                    <th className="px-4 py-3 font-semibold text-right">Monthly</th>
                    <th className="px-4 py-3 font-semibold text-center">Progress</th>
                    <th className="px-4 py-3 font-semibold">Next invoice</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => {
                    const remaining = c.installment_count - c.installments_issued;
                    return (
                      <tr key={c.id} className="border-t border-border hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{c.client_name}</div>
                          {c.customer_id && <div className="text-xs text-muted-foreground font-mono">{c.customer_id}</div>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{c.quotation_number || '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold">{fmtMoney(Number(c.monthly_installment), c.currency)}</td>
                        <td className="px-4 py-3 text-center text-xs">{c.installments_issued} / {c.installment_count}</td>
                        <td className="px-4 py-3 text-xs">{format(new Date(c.next_invoice_date), 'dd MMM yyyy')}</td>
                        <td className="px-4 py-3">
                          <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {remaining <= 0 ? (
                            <Button size="sm" variant="outline" onClick={() => navigate('/invoices')}>
                              <FileText className="h-3 w-3 mr-1" />View invoice
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled={generating === c.id} onClick={() => generateNow(c.id)}>
                              {generating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                              Issue full invoice
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div></>
  );
};

export default Contracts;
