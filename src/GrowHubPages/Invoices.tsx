import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import InvoiceView from '@/components/invoice/InvoiceView';
import { Helmet } from 'react-helmet-async';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string | null;
  customer_id: string | null;
  quotation_number: string | null;
  total_amount: number;
  currency: string;
  monthly_installment: number | null;
  installment_count: number | null;
  status: string;
  issued_at: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
}

const STATUS_OPTIONS = ['issued', 'sent', 'paid', 'overdue', 'cancelled'];

const fmtMoney = (v: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency, minimumFractionDigits: 2 }).format(v);

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Invoice | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issued_at', { ascending: false });
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to load invoices', description: error.message });
    } else {
      setInvoices((data as Invoice[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const patch: Record<string, unknown> = { status };
    if (status === 'paid') patch.paid_at = new Date().toISOString();
    else patch.paid_at = null;
    const { error } = await supabase.from('invoices').update(patch).eq('id', id);
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" /> Invoices
            </h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold">No invoices yet</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Invoices are auto-issued when a client signs a quotation.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Invoice #</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Quote #</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-right">Monthly</th>
                    <th className="px-4 py-3 font-semibold">Issued</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-border hover:bg-secondary/20">
                      <td className="px-4 py-3 font-mono">{inv.invoice_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{inv.client_name || '—'}</div>
                        {inv.customer_id && <div className="text-xs text-muted-foreground font-mono">{inv.customer_id}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{inv.quotation_number || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold">{fmtMoney(Number(inv.total_amount), inv.currency)}</td>
                      <td className="px-4 py-3 text-right">
                        {inv.monthly_installment ? (
                          <>
                            {fmtMoney(Number(inv.monthly_installment), inv.currency)}
                            <div className="text-xs text-muted-foreground">× {inv.installment_count} mo</div>
                          </>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs">{format(new Date(inv.issued_at), 'dd MMM yyyy')}</td>
                      <td className="px-4 py-3">
                        <select
                          value={inv.status}
                          onChange={(e) => updateStatus(inv.id, e.target.value)}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setViewing(inv)}>
                          <Eye className="h-3 w-3 mr-1" />View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <InvoiceView invoice={viewing} open={!!viewing} onClose={() => setViewing(null)} />
      </div></>
  );
};

export default Invoices;
