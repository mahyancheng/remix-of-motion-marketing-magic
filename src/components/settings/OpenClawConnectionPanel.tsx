import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Circle, Bot, ExternalLink, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Talks to the OpenClaw login sidecar (runs next to the gateway on your server).
// In production, point these at an admin-only proxy; for local use they hit the
// sidecar directly.
const SIDECAR_URL = (import.meta.env.VITE_OPENCLAW_LOGIN_URL as string | undefined) || '';
const SIDECAR_TOKEN = (import.meta.env.VITE_OPENCLAW_LOGIN_TOKEN as string | undefined) || '';

type Status = { connected: boolean; account: string | null; expires: string | null };
type Started = { sessionId?: string; verificationUri?: string; userCode?: string | null; needsDeviceCodeToggle?: boolean };

async function api(path: string, init?: RequestInit) {
  const r = await fetch(`${SIDECAR_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${SIDECAR_TOKEN}`, ...(init?.headers || {}) },
  });
  return r.json();
}

export default function OpenClawConnectionPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [flow, setFlow] = useState<Started | null>(null);

  const refresh = useCallback(async () => {
    if (!SIDECAR_URL) { setLoading(false); return; }
    try { setStatus(await api('/status')); } catch { setStatus(null); } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  // Poll login status while a flow is active.
  useEffect(() => {
    if (!flow?.sessionId) return;
    const id = setInterval(async () => {
      try {
        const s = await api(`/login/status?sessionId=${flow.sessionId}`);
        if (s.state === 'connected') { clearInterval(id); setConnecting(false); setFlow(null); toast.success('ChatGPT connected'); void refresh(); }
        else if (s.state === 'error') { clearInterval(id); setConnecting(false); toast.error(s.detail === 'needsDeviceCodeToggle' ? 'Enable device-code auth in ChatGPT settings first' : (s.detail || 'Login failed')); }
      } catch { /* keep polling */ }
    }, 2500);
    return () => clearInterval(id);
  }, [flow, refresh]);

  const connect = async () => {
    if (!SIDECAR_URL) { toast.error('OpenClaw login sidecar URL not configured'); return; }
    setConnecting(true);
    setFlow(null);
    try {
      const res: Started = await api('/login/start', { method: 'POST' });
      if (res.needsDeviceCodeToggle) { setFlow(res); setConnecting(false); return; }
      setFlow(res);
    } catch (e: any) { toast.error(e?.message || 'Could not start login'); setConnecting(false); }
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
        {!SIDECAR_URL && (
          <p className="text-xs text-muted-foreground">
            Set <code className="text-accent">VITE_OPENCLAW_LOGIN_URL</code> (and token) to enable in-app login.
          </p>
        )}

        {status?.connected && (
          <p className="text-xs text-muted-foreground">
            Connected as <span className="text-foreground font-medium">{status.account}</span>
            {status.expires && <> · token valid until {new Date(status.expires).toLocaleDateString()}</>}
          </p>
        )}

        {/* Device-code flow */}
        {flow?.needsDeviceCodeToggle ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs space-y-1">
            <p className="flex items-center gap-1 font-semibold text-destructive"><AlertTriangle className="h-3 w-3" /> One-time setup needed</p>
            <p className="text-muted-foreground">In ChatGPT → Settings → Security, enable <strong>device-code authorization for Codex</strong>, then click Connect again.</p>
          </div>
        ) : flow?.verificationUri ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs space-y-2">
            <p className="text-muted-foreground">Approve this in your browser to connect:</p>
            <div className="flex items-center gap-2">
              <a href={flow.verificationUri} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                {flow.verificationUri} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {flow.userCode && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Code:</span>
                <code className="font-mono text-sm text-foreground bg-background px-2 py-0.5 rounded border border-border">{flow.userCode}</code>
                <Button type="button" variant="ghost" size="sm" className="h-6 px-2" onClick={() => { navigator.clipboard.writeText(flow.userCode!); toast.success('Code copied'); }}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p className="flex items-center gap-1 text-muted-foreground pt-1"><Loader2 className="h-3 w-3 animate-spin" /> Waiting for approval…</p>
          </div>
        ) : null}

        <Button variant="accent" size="sm" onClick={connect} disabled={connecting || !SIDECAR_URL}>
          {connecting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Bot className="h-4 w-4 mr-1" />}
          {status?.connected ? 'Reconnect ChatGPT' : 'Connect ChatGPT'}
        </Button>
      </CardContent>
    </Card>
  );
}
