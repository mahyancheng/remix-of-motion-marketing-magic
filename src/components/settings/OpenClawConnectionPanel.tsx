import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Circle, Bot, ExternalLink, Copy, AlertTriangle, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Production: calls the admin-gated `openclaw-auth` Supabase function, which proxies
// to the login sidecar on your VPS (sidecar URL + token stay server-side).
// Local dev: if VITE_OPENCLAW_LOGIN_URL is set, hits the sidecar directly instead.
const DIRECT_URL = (import.meta.env.VITE_OPENCLAW_LOGIN_URL as string | undefined) || '';
const DIRECT_TOKEN = (import.meta.env.VITE_OPENCLAW_LOGIN_TOKEN as string | undefined) || '';

type Status = { connected: boolean; account: string | null; expires: string | null };
type Started = { sessionId?: string; verificationUri?: string | null; userCode?: string | null; needsDeviceCodeToggle?: boolean };
type Action = 'status' | 'start' | 'poll' | 'logout' | 'restart';

async function call(action: Action, sessionId?: string): Promise<any> {
  if (DIRECT_URL) {
    const path =
      action === 'status' ? '/status'
      : action === 'start' ? '/login/start'
      : action === 'logout' ? '/logout'
      : action === 'restart' ? '/restart'
      : `/login/status?sessionId=${sessionId}`;
    const r = await fetch(`${DIRECT_URL}${path}`, {
      method: action === 'status' || action === 'poll' ? 'GET' : 'POST',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${DIRECT_TOKEN}` },
    });
    return r.json();
  }
  const { data, error } = await supabase.functions.invoke('openclaw-auth', { body: { action, sessionId } });
  if (error) throw error;
  return data;
}

export default function OpenClawConnectionPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [busy, setBusy] = useState<'logout' | 'restart' | null>(null);
  const [flow, setFlow] = useState<Started | null>(null);

  const refresh = useCallback(async () => {
    try { setStatus(await call('status')); } catch { setStatus(null); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!flow?.sessionId) return;
    const id = setInterval(async () => {
      try {
        const s = await call('poll', flow.sessionId);
        if (s.state === 'connected') { clearInterval(id); setConnecting(false); setFlow(null); toast.success('ChatGPT connected'); void refresh(); }
        else if (s.state === 'error') { clearInterval(id); setConnecting(false); toast.error(s.detail === 'needsDeviceCodeToggle' ? 'Enable device-code auth in ChatGPT settings first' : (s.detail || 'Login failed')); }
        else if (s.verificationUri || s.userCode) {
          // The CLI sometimes prints the URL/code after /login/start responds —
          // fill them in from the poll so the code always shows.
          setFlow((f) => f && (f.verificationUri !== s.verificationUri || f.userCode !== s.userCode)
            ? { ...f, verificationUri: s.verificationUri ?? f.verificationUri, userCode: s.userCode ?? f.userCode }
            : f);
        }
      } catch { /* keep polling */ }
    }, 2500);
    return () => clearInterval(id);
  }, [flow?.sessionId, refresh]);

  const connect = async () => {
    setConnecting(true);
    setFlow(null);
    try {
      const res: Started = await call('start');
      setFlow(res);
      if (res.needsDeviceCodeToggle) setConnecting(false);
    } catch (e: any) { toast.error(e?.message || 'Could not start login'); setConnecting(false); }
  };

  const logout = async () => {
    setBusy('logout');
    try {
      await call('logout');
      setFlow(null);
      toast.success('ChatGPT disconnected');
      await refresh();
    } catch (e: any) { toast.error(e?.message || 'Logout failed'); }
    finally { setBusy(null); }
  };

  const restart = async () => {
    setBusy('restart');
    try {
      await call('restart');
      toast.info('Engine restarting — back in ~20 seconds');
      setFlow(null);
      // The container takes a moment to come back; poll status until it answers.
      setLoading(true);
      setTimeout(async () => { await refresh(); setBusy(null); }, 20000);
    } catch (e: any) { toast.error(e?.message || 'Restart failed'); setBusy(null); }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted"><Bot className="h-5 w-5 text-accent" /></div>
            <div>
              <CardTitle className="text-base">AI Engine — OpenClaw (ChatGPT)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Powers the AI Performance Reports via your ChatGPT subscription.</p>
            </div>
          </div>
          {loading ? (
            <Badge variant="outline" className="gap-1 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Checking</Badge>
          ) : status?.connected ? (
            <Badge className="bg-accent/20 text-accent border-accent/30 gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-muted-foreground"><Circle className="h-3 w-3" /> Not connected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!loading && !status && (
          <p className="text-xs text-muted-foreground">
            Couldn't reach the OpenClaw gateway. Make sure it's running on your server and the <code className="text-accent">openclaw-auth</code> function is configured.
          </p>
        )}

        {status?.connected && (
          <p className="text-xs text-muted-foreground">
            Connected as <span className="text-foreground font-medium">{status.account}</span>
            {status.expires && <> · token valid until {new Date(status.expires).toLocaleDateString()}</>}
          </p>
        )}

        {flow?.needsDeviceCodeToggle ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs space-y-1">
            <p className="flex items-center gap-1 font-semibold text-destructive"><AlertTriangle className="h-3 w-3" /> One-time setup needed</p>
            <p className="text-muted-foreground">In ChatGPT → Settings → Security, enable <strong>device-code authorization for Codex</strong>, then click Connect again.</p>
          </div>
        ) : flow?.sessionId ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs space-y-2">
            {flow.verificationUri ? (
              <>
                <p className="text-muted-foreground">Approve this in your browser to connect:</p>
                <a href={flow.verificationUri} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                  {flow.verificationUri} <ExternalLink className="h-3 w-3" />
                </a>
              </>
            ) : (
              <p className="flex items-center gap-1 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Getting your sign-in link…</p>
            )}
            {flow.userCode ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Code:</span>
                <code className="font-mono text-sm text-foreground bg-background px-2 py-0.5 rounded border border-border">{flow.userCode}</code>
                <Button type="button" variant="ghost" size="sm" className="h-6 px-2" onClick={() => { navigator.clipboard.writeText(flow.userCode!); toast.success('Code copied'); }}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ) : flow.verificationUri ? (
              <p className="flex items-center gap-1 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Waiting for your one-time code…</p>
            ) : null}
            {flow.verificationUri && flow.userCode && (
              <p className="flex items-center gap-1 text-muted-foreground pt-1"><Loader2 className="h-3 w-3 animate-spin" /> Waiting for approval…</p>
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="accent" size="sm" onClick={connect} disabled={connecting || busy !== null}>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Bot className="h-4 w-4 mr-1" />}
            {status?.connected ? 'Reconnect ChatGPT' : 'Connect ChatGPT'}
          </Button>
          {status?.connected && (
            <Button variant="outline" size="sm" onClick={logout} disabled={connecting || busy !== null}>
              {busy === 'logout' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <LogOut className="h-4 w-4 mr-1" />}
              Disconnect
            </Button>
          )}
          {status && (
            <Button variant="outline" size="sm" onClick={restart} disabled={connecting || busy !== null}>
              {busy === 'restart' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Restart engine
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
