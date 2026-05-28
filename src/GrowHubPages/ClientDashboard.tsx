import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/GrowHubHooks/useAuth';
import { useClients, PROVIDERS } from '@/GrowHubHooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, BarChart3, Globe, FileText } from 'lucide-react';
import MetricsCharts from '@/components/dashboard/MetricsCharts';
import AIInsightsCard from '@/components/dashboard/AIInsightsCard';
import { subDays, format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

interface ClientInvoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  currency: string;
  monthly_installment: number | null;
  installment_count: number | null;
  status: string;
  issued_at: string;
  due_date: string | null;
  quotation_number: string | null;
}

const fmtMoney = (v: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency, minimumFractionDigits: 2 }).format(v);

const statusTone = (s: string) =>
  s === 'paid' ? 'bg-green-500/15 text-green-500' :
    s === 'overdue' ? 'bg-red-500/15 text-red-500' :
      s === 'cancelled' ? 'bg-muted text-muted-foreground' :
        'bg-accent/15 text-accent';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { clients, metrics, isLoading } = useClients();

  useEffect(() => {
    if (!authLoading && !user) navigate('/client/login');
  }, [authLoading, user, navigate]);

  const myClients = useMemo(() => clients.filter((c) => c.auth_user_id === user?.id), [clients, user]);

  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  useEffect(() => {
    if (myClients.length === 0) { setInvoices([]); return; }
    (async () => {
      const ids = myClients.map((c) => c.id);
      const { data } = await supabase
        .from('invoices')
        .select('id, invoice_number, total_amount, currency, monthly_installment, installment_count, status, issued_at, due_date, quotation_number')
        .in('client_id', ids)
        .order('issued_at', { ascending: false });
      setInvoices((data as ClientInvoice[]) || []);
    })();
  }, [myClients]);

  const groupedByClient = useMemo(() => {
    const map: Record<string, typeof metrics> = {};
    for (const c of myClients) map[c.id] = [];
    for (const m of metrics) if (map[m.client_id]) map[m.client_id].push(m);
    return map;
  }, [myClients, metrics]);

  if (authLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <><Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h1 className="font-display font-semibold">Performance Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{(user?.user_metadata as any)?.username || user?.email?.split('@')[0]}</span>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate('/client/login'); }}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6 space-y-6">
          {myClients.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No data has been shared with your account yet.</p>
                <p className="text-xs mt-1">Your account manager will populate metrics shortly.</p>
              </CardContent>
            </Card>
          )}

          {invoices.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" /> Invoices
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="py-2 pr-3">Invoice #</th>
                      <th className="py-2 pr-3">Issued</th>
                      <th className="py-2 pr-3">Due</th>
                      <th className="py-2 pr-3 text-right">Amount</th>
                      <th className="py-2 pr-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/40">
                        <td className="py-2 pr-3 font-mono text-xs">{inv.invoice_number}</td>
                        <td className="py-2 pr-3 text-xs">{format(new Date(inv.issued_at), 'dd MMM yyyy')}</td>
                        <td className="py-2 pr-3 text-xs">{inv.due_date ? format(new Date(inv.due_date), 'dd MMM yyyy') : '—'}</td>
                        <td className="py-2 pr-3 text-right font-semibold">
                          {fmtMoney(Number(inv.total_amount), inv.currency)}
                          {inv.installment_count ? <div className="text-xs text-muted-foreground font-normal">{inv.installment_count} mo package</div> : null}
                        </td>
                        <td className="py-2 pr-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusTone(inv.status)}`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {myClients.map((c) => {
            const ms = groupedByClient[c.id] || [];
            const byProvider: Record<string, typeof metrics> = {};
            for (const m of ms) (byProvider[m.provider] ||= []).push(m);
            return (
              <div key={c.id} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-semibold">{c.name}</h2>
                  {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1"><Globe className="h-3 w-3" />{c.website}</a>}
                </div>

                {ms.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No metrics recorded yet.</CardContent></Card>
                ) : (
                  <>
                    <MetricsCharts metrics={ms} />
                    <AIInsightsCard clientId={c.id} clientName={c.name} range={{ from: subDays(new Date(), 30), to: new Date() }} hasMetrics={ms.length > 0} metrics={ms} />
                  </>
                )}
              </div>
            );
          })}
        </main>
      </div></>
  );
}
