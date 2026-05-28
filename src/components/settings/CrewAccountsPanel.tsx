import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/GrowHubHooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Trash2, KeyRound, UsersRound, Copy, Plus, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CrewAccount {
  user_id: string;
  email: string;
  full_name: string | null;
  roles: string[];
  created_at: string;
  last_sign_in_at: string | null;
}

export default function CrewAccountsPanel() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<CrewAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<CrewAccount | null>(null);

  const load = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.functions.invoke('list-crew-accounts');
    setRefreshing(false);
    setLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || 'Failed to load accounts');
      return;
    }
    setAccounts((data as any).accounts || []);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (acc: CrewAccount) => {
    if (acc.user_id === user?.id) { toast.error('You cannot delete your own account'); return; }
    if (!confirm(`Delete account "${acc.email}"? This permanently removes their access.`)) return;
    const { data, error } = await supabase.functions.invoke('manage-crew-account', { body: { user_id: acc.user_id, action: 'delete' } });
    if (error || (data as any)?.error) { toast.error((data as any)?.error || error?.message || 'Delete failed'); return; }
    toast.success(`Deleted ${acc.email}`);
    load();
  };

  const handleRoleChange = async (acc: CrewAccount, role: string) => {
    const { data, error } = await supabase.functions.invoke('manage-crew-account', { body: { user_id: acc.user_id, action: 'set_role', role } });
    if (error || (data as any)?.error) { toast.error((data as any)?.error || error?.message || 'Update failed'); return; }
    toast.success(`Role updated to ${role}`);
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-accent" /> Leadzap Crew Accounts
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Internal team & admin logins. They sign in at /auth with email + password.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={load} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New crew account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : accounts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No crew accounts yet.</p>
        ) : (
          <div className="space-y-2">
            {accounts.map((a) => {
              const isSelf = a.user_id === user?.id;
              const primaryRole = a.roles.includes('admin') ? 'admin' : 'team';
              return (
                <div key={a.user_id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{a.full_name || a.email}</span>
                      {a.full_name && <span className="text-xs text-muted-foreground">{a.email}</span>}
                      {primaryRole === 'admin' ? (
                        <Badge className="bg-accent/20 text-accent border-accent/30 gap-1 text-xs"><ShieldCheck className="h-3 w-3" /> Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Team</Badge>
                      )}
                      {isSelf && <Badge variant="outline" className="text-xs">You</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {format(new Date(a.created_at), 'MMM d, yyyy')}
                      {a.last_sign_in_at ? ` · Last sign-in ${format(new Date(a.last_sign_in_at), 'MMM d, yyyy')}` : ' · Never signed in'}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0 items-center">
                    <Select value={primaryRole} onValueChange={(v) => handleRoleChange(a, v)} disabled={isSelf}>
                      <SelectTrigger className="h-9 w-[110px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={() => setResetTarget(a)}>
                      <KeyRound className="h-4 w-4 mr-1" /> Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(a)} disabled={isSelf}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {createOpen && <CreateCrewDialog onClose={() => setCreateOpen(false)} onDone={() => { setCreateOpen(false); load(); }} />}
      {resetTarget && <ResetCrewPasswordDialog account={resetTarget} onClose={() => setResetTarget(null)} onDone={() => setResetTarget(null)} />}
    </Card>
  );
}

function CreateCrewDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'team' | 'admin'>('team');
  const [password, setPassword] = useState(() => generatePassword());
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { toast.error('Enter a valid email'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('create-crew-account', {
      body: { email: e, password, role, full_name: fullName.trim() || null },
    });
    setSaving(false);
    if (error || (data as any)?.error) { toast.error((data as any)?.error || error?.message || 'Create failed'); return; }
    toast.success(`Account created for ${e}`);
    onDone();
  };

  const copy = async () => { await navigator.clipboard.writeText(password); toast.success('Password copied'); };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Leadzap crew account</DialogTitle>
          <DialogDescription>The user will sign in at /auth with this email and password. Share the password securely.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Full name (optional)</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@leadzap.com.my" />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team — full dashboard access</SelectItem>
                <SelectItem value="admin">Admin — full access + settings & account management</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Initial password</Label>
            <div className="flex gap-2">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} className="font-mono" />
              <Button variant="outline" size="icon" onClick={copy}><Copy className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResetCrewPasswordDialog({ account, onClose, onDone }: { account: CrewAccount; onClose: () => void; onDone: () => void }) {
  const [password, setPassword] = useState(() => generatePassword());
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('manage-crew-account', { body: { user_id: account.user_id, action: 'reset_password', new_password: password } });
    setSaving(false);
    if (error || (data as any)?.error) { toast.error((data as any)?.error || error?.message || 'Reset failed'); return; }
    toast.success(`Password reset for ${account.email}`);
    onDone();
  };

  const copy = async () => { await navigator.clipboard.writeText(password); toast.success('Password copied'); };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password — {account.email}</DialogTitle>
          <DialogDescription>Share the new password with the user securely.</DialogDescription>
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
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Update password
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
