import { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import { useClients, PROVIDERS, Client, MetricEntry, Credential } from '@/GrowHubHooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Loader2, Globe, BarChart3, UserPlus, Key, Eye, EyeOff, Copy, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MetricsCharts from './MetricsCharts';
import AIInsightsCard from './AIInsightsCard';

export default function ClientsPanel() {
  const {
    clients, metrics, credentials, isLoading,
    createClient, updateClient, deleteClient,
    addMetric, deleteMetric,
    addCredential, updateCredential, deleteCredential,
    fetchMetrics,
  } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientDialog, setClientDialog] = useState<{ open: boolean; editing: Client | null }>({ open: false, editing: null });
  const [metricDialog, setMetricDialog] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const [credDialog, setCredDialog] = useState<{ open: boolean; editing: Credential | null }>({ open: false, editing: null });
  const [syncing, setSyncing] = useState(false);
  const [chartRange, setChartRange] = useState<{ from: Date; to: Date }>(() => ({
    from: subDays(new Date(), 30),
    to: new Date(),
  }));

  const runSync = async (fnName: 'sync-gsc-metrics' | 'sync-google-ads-metrics' | 'sync-google-analytics-metrics' | 'sync-meta-ads-metrics', friendly: string) => {
    if (!selectedClient) return;
    setSyncing(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) {
      setSyncing(false);
      toast.error('Please sign in again');
      return;
    }
    const { data, error } = await supabase.functions.invoke(fnName, {
      body: {
        client_id: selectedClient.id,
        start_date: format(chartRange.from, 'yyyy-MM-dd'),
        end_date: format(chartRange.to, 'yyyy-MM-dd'),
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setSyncing(false);
    // Adaptive: if provider isn't configured for this client, skip silently
    if ((data as any)?.not_configured) return;
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || `${friendly} sync failed`);
      return;
    }
    const result = (data as any)?.summary?.[0];
    if (result?.status === 'ok') {
      if (result.skipped) {
        if (result.reason === 'not_configured' || result.reason === 'no_account') return;
        toast.success(`${friendly}: already up to date (${result.cached} days cached)`);
      } else {
        toast.success(`${friendly}: synced ${result.days} day(s), ${result.rows_inserted} rows`);
      }
      await fetchMetrics();
    } else {
      toast.error(result?.error || `${friendly}: no data returned.`);
    }
  };
  const handleSyncGSC = () => runSync('sync-gsc-metrics', 'Search Console');
  const handleSyncAds = () => runSync('sync-google-ads-metrics', 'Google Ads');
  const handleSyncGA = () => runSync('sync-google-analytics-metrics', 'Google Analytics');
  const handleSyncMeta = () => runSync('sync-meta-ads-metrics' as any, 'Meta Ads');

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const clientMetrics = metrics.filter((m) => m.client_id === selectedClientId);
  const clientCreds = credentials.filter((c) => c.client_id === selectedClientId);

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="flex h-full">
      {/* Client list */}
      <div className="w-80 border-r border-border bg-card/30 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold">Clients</h2>
          <Button size="sm" variant="accent" onClick={() => setClientDialog({ open: true, editing: null })}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {clients.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No clients yet. Add one to get started.</p>
          )}
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`w-full text-left p-3 border-b border-border hover:bg-secondary/50 transition ${selectedClientId === c.id ? 'bg-secondary' : ''}`}
            >
              <div className="font-medium text-sm">{c.name}</div>
              {c.website && <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1"><Globe className="h-3 w-3" />{c.website}</div>}
              {c.auth_user_id && <Badge variant="outline" className="mt-1 text-xs">Login linked</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-auto p-6">
        {!selectedClient ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
            <p>Select a client to view their metrics</p>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-display font-semibold">{selectedClient.name}</h1>
                {selectedClient.website && <a href={selectedClient.website} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline">{selectedClient.website}</a>}
                {selectedClient.notes && <p className="text-sm text-muted-foreground mt-2">{selectedClient.notes}</p>}
              </div>
              <div className="flex gap-2">
                {!selectedClient.auth_user_id && (
                  <Button size="sm" variant="accent" onClick={() => setLoginDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-1" /> Create login
                  </Button>
                )}
                {selectedClient.auth_user_id && (
                  <Badge variant="outline" className="self-center">Login active</Badge>
                )}
                <Button size="sm" variant="outline" onClick={() => setClientDialog({ open: true, editing: selectedClient })}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => { if (confirm('Delete client and all metrics?')) { deleteClient(selectedClient.id); setSelectedClientId(null); } }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="metrics">
              <TabsList>
                <TabsTrigger value="metrics" className="gap-2"><BarChart3 className="h-4 w-4" />Metrics</TabsTrigger>
                <TabsTrigger value="credentials" className="gap-2"><Key className="h-4 w-4" />Credentials</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                <div className="flex justify-end gap-2 flex-wrap">
                  {selectedClient.website && (
                    <Button size="sm" variant="outline" onClick={handleSyncGSC} disabled={syncing}>
                      {syncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                      Sync Search Console ({format(chartRange.from, 'MMM d')} – {format(chartRange.to, 'MMM d')})
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={handleSyncAds} disabled={syncing}>
                    {syncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                    Sync Google Ads ({format(chartRange.from, 'MMM d')} – {format(chartRange.to, 'MMM d')})
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSyncGA} disabled={syncing}>
                    {syncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                    Sync Google Analytics ({format(chartRange.from, 'MMM d')} – {format(chartRange.to, 'MMM d')})
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSyncMeta} disabled={syncing}>
                    {syncing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                    Sync Meta Ads ({format(chartRange.from, 'MMM d')} – {format(chartRange.to, 'MMM d')})
                  </Button>
                </div>
                <MetricsCharts metrics={clientMetrics} range={chartRange} onRangeChange={setChartRange} />
                <AIInsightsCard clientId={selectedClient.id} clientName={selectedClient.name} range={chartRange} hasMetrics={clientMetrics.length > 0} metrics={clientMetrics} canManage />
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Manual entries</CardTitle>
                    <Button size="sm" variant="accent" onClick={() => setMetricDialog(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add metric
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {clientMetrics.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">No manual metrics added.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-auto">
                        {clientMetrics.slice(0, 20).map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-2 rounded-md border border-border bg-card text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant="outline" className="shrink-0">{PROVIDERS.find((p) => p.value === m.provider)?.label || m.provider}</Badge>
                              <span className="truncate">{m.metric_label}</span>
                              {m.metric_value !== null && <span className="font-semibold text-accent shrink-0">{m.metric_value.toLocaleString()}</span>}
                              <span className="text-xs text-muted-foreground shrink-0">{m.period_end}</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => deleteMetric(m.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {clientMetrics.length > 20 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">Showing 20 of {clientMetrics.length} entries</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">API Credentials</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Store API keys, tokens, and IDs for this client's integrations.</p>
                    </div>
                    <Button size="sm" variant="accent" onClick={() => setCredDialog({ open: true, editing: null })}>
                      <Plus className="h-4 w-4 mr-1" /> Add credential
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {clientCreds.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">No credentials saved yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {clientCreds.map((c) => (
                          <CredentialRow
                            key={c.id}
                            cred={c}
                            onEdit={() => setCredDialog({ open: true, editing: c })}
                            onDelete={() => { if (confirm('Delete credential?')) deleteCredential(c.id); }}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <CredentialsHelp />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {selectedClient && (
        <CredentialDialog
          open={credDialog.open}
          editing={credDialog.editing}
          clientId={selectedClient.id}
          onClose={() => setCredDialog({ open: false, editing: null })}
          onSave={async (data) => {
            if (credDialog.editing) await updateCredential(credDialog.editing.id, data);
            else await addCredential(data);
            setCredDialog({ open: false, editing: null });
          }}
        />
      )}

      <ClientDialog
        open={clientDialog.open}
        editing={clientDialog.editing}
        onClose={() => setClientDialog({ open: false, editing: null })}
        onSave={async (data) => {
          if (clientDialog.editing) await updateClient(clientDialog.editing.id, data);
          else await createClient(data);
          setClientDialog({ open: false, editing: null });
        }}
      />

      {selectedClient && (
        <MetricDialog
          open={metricDialog}
          clientId={selectedClient.id}
          onClose={() => setMetricDialog(false)}
          onSave={async (data) => { await addMetric(data); setMetricDialog(false); }}
        />
      )}

      {selectedClient && (
        <CreateLoginDialog
          open={loginDialog}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          onClose={() => setLoginDialog(false)}
          onSuccess={async () => { setLoginDialog(false); window.location.reload(); }}
        />
      )}
    </div>
  );
}

function CreateLoginDialog({ open, clientId, clientName, onClose, onSuccess }: { open: boolean; clientId: string; clientName: string; onClose: () => void; onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const suggested = clientName.toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 24) || 'client';
      setUsername(suggested);
      setPassword(generatePassword());
    }
  }, [open, clientName]);

  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');

  const handleCreate = async () => {
    if (cleanUsername.length < 3 || password.length < 8) {
      toast.error('Username (min 3 chars) and password (min 8 chars) required');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('create-client-login', {
      body: { client_id: clientId, username: cleanUsername, password },
    });
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || 'Failed');
      return;
    }
    toast.success(`Login created: ${cleanUsername}`);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create login for {clientName}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Username *</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. tectone" />
            <p className="text-xs text-muted-foreground mt-1">Lowercase letters, numbers, dot, dash, underscore. No email needed.</p>
          </div>
          <div>
            <Label>Temporary password *</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Share these credentials with your client. They sign in at <code>/client/login</code>.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="accent" onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let p = '';
  for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

function ClientDialog({ open, editing, onClose, onSave }: { open: boolean; editing: Client | null; onClose: () => void; onSave: (d: Partial<Client>) => void }) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [authUserId, setAuthUserId] = useState('');

  useEffect(() => {
    if (open) {
      setName(editing?.name || '');
      setWebsite(editing?.website || '');
      setNotes(editing?.notes || '');
      setAuthUserId(editing?.auth_user_id || '');
    }
  }, [open, editing]);

  const reset = () => { setName(''); setWebsite(''); setNotes(''); setAuthUserId(''); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? 'Edit client' : 'Add client'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></div>
          <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div>
            <Label>Client login user ID (optional)</Label>
            <Input value={authUserId} onChange={(e) => setAuthUserId(e.target.value)} placeholder="UUID of the auth user" />
            <p className="text-xs text-muted-foreground mt-1">Paste the user ID after creating the client's login account. They'll see only this client's metrics.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="accent" disabled={!name.trim()} onClick={() => { onSave({ name: name.trim(), website: website.trim() || null, notes: notes.trim() || null, auth_user_id: authUserId.trim() || null }); reset(); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MetricDialog({ open, clientId, onClose, onSave }: { open: boolean; clientId: string; onClose: () => void; onSave: (d: Omit<MetricEntry, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => void }) {
  const [provider, setProvider] = useState('google_analytics');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => { setProvider('google_analytics'); setLabel(''); setValue(''); setText(''); setStart(''); setEnd(''); setNotes(''); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add metric</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Source</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PROVIDERS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Metric name *</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Sessions, Ad Spend, CTR" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Numeric value</Label><Input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} /></div>
            <div><Label>Text value</Label><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. 3.2%, top query: ..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Period start</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
            <div><Label>Period end</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          </div>
          <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="accent" disabled={!label.trim()} onClick={() => {
            onSave({
              client_id: clientId,
              provider,
              metric_label: label.trim(),
              metric_value: value ? Number(value) : null,
              metric_text: text.trim() || null,
              period_start: start || null,
              period_end: end || null,
              notes: notes.trim() || null,
            });
            reset();
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CredentialRow({ cred, onEdit, onDelete }: { cred: Credential; onEdit: () => void; onDelete: () => void }) {
  const [show, setShow] = useState(false);
  const masked = cred.credential_value.length > 8
    ? cred.credential_value.slice(0, 4) + '••••••••' + cred.credential_value.slice(-4)
    : '••••••••';
  const copy = async () => {
    await navigator.clipboard.writeText(cred.credential_value);
    toast.success('Copied to clipboard');
  };
  return (
    <div className="flex items-start justify-between p-3 rounded-md border border-border bg-card">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{PROVIDERS.find((p) => p.value === cred.provider)?.label || cred.provider}</Badge>
          <span className="font-medium text-sm">{cred.label}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all flex-1">
            {show ? cred.credential_value : masked}
          </code>
          <Button size="sm" variant="ghost" onClick={() => setShow(!show)} title={show ? 'Hide' : 'Show'}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={copy} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {cred.notes && <p className="text-xs text-muted-foreground mt-2">{cred.notes}</p>}
      </div>
      <div className="flex flex-col gap-1 ml-2">
        <Button size="sm" variant="ghost" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

function CredentialDialog({ open, editing, clientId, onClose, onSave }: { open: boolean; editing: Credential | null; clientId: string; onClose: () => void; onSave: (d: Omit<Credential, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => void }) {
  const [provider, setProvider] = useState('google_search_console');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setProvider(editing?.provider || 'google_search_console');
      setLabel(editing?.label || '');
      setValue(editing?.credential_value || '');
      setNotes(editing?.notes || '');
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? 'Edit credential' : 'Add credential'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Source</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PROVIDERS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Label *</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. API Key, Property ID, Access Token" />
          </div>
          <div>
            <Label>Value *</Label>
            <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="Paste API key, token, or ID here" className="font-mono text-sm" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Where this is used, expiry, etc." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="accent" disabled={!label.trim() || !value.trim()} onClick={() => {
            onSave({
              client_id: clientId,
              provider,
              label: label.trim(),
              credential_value: value.trim(),
              notes: notes.trim() || null,
            });
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CredentialsHelp() {
  const items: { provider: string; label: string; what: string; where: string }[] = [
    {
      provider: 'Google Search Console',
      label: 'Site URL',
      what: 'The exact verified property URL (e.g. https://example.com/ or sc-domain:example.com).',
      where: 'GSC → Settings → Property — copy the property name shown.',
    },
    {
      provider: 'Google Analytics',
      label: 'Property ID',
      what: 'The numeric GA4 Property ID (e.g. 492029865) — not the Measurement ID.',
      where: 'GA4 → Admin → Property settings → Property ID.',
    },
    {
      provider: 'Google Ads',
      label: 'Customer ID',
      what: 'The 10-digit Customer ID (dashes optional, e.g. 563-020-4207).',
      where: 'Google Ads UI → top right next to your account name.',
    },
    {
      provider: 'Meta Ads',
      label: 'Ad Account ID',
      what: 'Your ad account ID — paste digits only (e.g. 1234567890) or with prefix (act_1234567890).',
      where: 'Meta Ads Manager → top-left dropdown → the ID under the account name (starts with act_).',
    },
  ];
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-sm">What credentials to add</CardTitle>
        <p className="text-xs text-muted-foreground">Add one credential per provider with the exact label below — the sync buttons match by label.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.provider} className="text-xs border-l-2 border-accent/40 pl-3">
              <div className="font-medium text-sm text-foreground">{it.provider}</div>
              <div className="text-muted-foreground mt-0.5">
                Label: <code className="bg-muted px-1 py-0.5 rounded">{it.label}</code>
              </div>
              <div className="text-muted-foreground mt-0.5"><strong className="text-foreground">What:</strong> {it.what}</div>
              <div className="text-muted-foreground mt-0.5"><strong className="text-foreground">Where:</strong> {it.where}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
