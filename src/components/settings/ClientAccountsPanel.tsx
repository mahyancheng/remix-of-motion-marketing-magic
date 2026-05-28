import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Trash2, KeyRound, UserCog, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ClientAccount {
  user_id: string;
  email: string;
  username: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  linked_client: { id: string; name: string } | null;
}

export default function ClientAccountsPanel() {
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetTarget, setResetTarget] = useState<ClientAccount | null>(null);

  const load = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.functions.invoke('list-client-accounts');
    setRefreshing(false);
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || 'Failed to load accounts');
      return;
    }
    setAccounts((data as any).accounts || []);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (acc: ClientAccount) => {
    const label = acc.username || acc.email;
    if (!confirm(`Delete login "${label}"? This unlinks it from any client and removes the account permanently.`)) return;
    const { data, error } = await supabase.functions.invoke('delete-client-login', { body: { user_id: acc.user_id } });
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || 'Delete failed');
      return;
    }
    toast.success(`Deleted ${label}`);
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="h-4 w-4 text-accent" /> Client Account Management
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            All logins issued to clients. Reset passwords or delete accounts here. Team & admin accounts are not shown.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : accounts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No client accounts yet.</p>
        ) : (
          <div className="space-y-2">
            {accounts.map((a) => {
              const label = a.username || a.email;
              return (
                <div key={a.user_id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{label}</span>
                      {a.linked_client ? (
                        <Badge variant="outline" className="text-xs">Linked: {a.linked_client.name}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Unlinked</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {format(new Date(a.created_at), 'MMM d, yyyy')}
                      {a.last_sign_in_at ? ` · Last sign-in ${format(new Date(a.last_sign_in_at), 'MMM d, yyyy')}` : ' · Never signed in'}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setResetTarget(a)}>
                      <KeyRound className="h-4 w-4 mr-1" /> Reset password
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(a)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {resetTarget && (
        <ResetPasswordDialog
          account={resetTarget}
          onClose={() => setResetTarget(null)}
          onDone={() => setResetTarget(null)}
        />
      )}
    </Card>
  );
}

function ResetPasswordDialog({ account, onClose, onDone }: { account: ClientAccount; onClose: () => void; onDone: () => void }) {
  const [password, setPassword] = useState(() => generatePassword());
  const [saving, setSaving] = useState(false);
  const label = account.username || account.email;

  const submit = async () => {
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('delete-client-login', { body: { user_id: account.user_id, new_password: password } });
    setSaving(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || 'Reset failed');
      return;
    }
    toast.success(`Password reset for ${label}`);
    onDone();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    toast.success('Password copied');
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password — {label}</DialogTitle>
          <DialogDescription>The client will need this new password to sign in. Share it securely.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>New password</Label>
          <div className="flex gap-2">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} className="font-mono" />
            <Button variant="outline" size="icon" onClick={copy}><Copy className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Update password
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
