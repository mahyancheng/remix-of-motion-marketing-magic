import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/GrowHubHooks/useAuth';
import { useUserRole } from '@/GrowHubHooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Loader2, Settings as SettingsIcon, ShieldAlert, CheckCircle2, Circle,
  Search, BarChart3, Megaphone, Facebook, ExternalLink, Eye, EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import ClientAccountsPanel from '@/components/settings/ClientAccountsPanel';
import CrewAccountsPanel from '@/components/settings/CrewAccountsPanel';
import { spec } from 'node:test/reporters';
import { Helmet } from 'react-helmet-async';

interface AgencySetting {
  id: string;
  key_name: string;
  provider: string;
  value: string;
  notes: string | null;
}

interface FieldSpec {
  key: string;             // suffix → stored as `${provider}__${key}`
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'password';
  help?: string;
  required?: boolean;
}

interface ProviderSpec {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  setupGuide: { title: string; steps: string[]; link?: { label: string; url: string } };
  fields: FieldSpec[];
}

const PROVIDER_SPECS: ProviderSpec[] = [
  {
    id: 'google_search_console',
    name: 'Google Search Console',
    icon: Search,
    blurb: 'Auto-pull clicks, impressions, CTR & average position for client websites.',
    setupGuide: {
      title: 'How to get these credentials',
      steps: [
        'Go to Google Cloud Console → IAM & Admin → Service Accounts.',
        'Create a service account, then create a JSON key for it (downloads a .json file).',
        'Open the .json file and paste the entire contents into "Service Account JSON" below.',
        'In Google Search Console, add the service account email (client_email from the JSON) as a user with "Full" or "Restricted" access for each client property.',
      ],
      link: { label: 'Open Google Cloud Console', url: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
    },
    fields: [
      { key: 'service_account_json', label: 'Service Account JSON', type: 'textarea', placeholder: '{ "type": "service_account", "project_id": "...", ... }', required: true, help: 'Paste the full JSON file contents.' },
    ],
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics (GA4)',
    icon: BarChart3,
    blurb: 'Auto-pull sessions, users, traffic sources & conversions.',
    setupGuide: {
      title: 'How to get these credentials',
      steps: [
        'Use the same service account JSON as Search Console (or create a new one).',
        'In GA4 → Admin → Property Access Management, add the service account email as Viewer for each client property.',
        'Find the GA4 Property ID (Admin → Property Settings → "Property ID", a number like 123456789).',
      ],
      link: { label: 'Open GA4 Admin', url: 'https://analytics.google.com/' },
    },
    fields: [
      { key: 'service_account_json', label: 'Service Account JSON', type: 'textarea', placeholder: '{ "type": "service_account", ... }', required: true, help: 'Same JSON as GSC works fine.' },
    ],
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    icon: Megaphone,
    blurb: 'Auto-pull campaign spend, clicks, conversions and cost per lead.',
    setupGuide: {
      title: 'How to get these credentials',
      steps: [
        'Apply for a Google Ads Developer Token (Tools → API Center inside your MCC account).',
        'Create OAuth credentials in Google Cloud and generate a refresh token (use Google\'s OAuth Playground).',
        'Get your Manager (MCC) Customer ID (10-digit number, top-right in Google Ads).',
      ],
      link: { label: 'Open Google Ads API Center', url: 'https://ads.google.com/aw/apicenter' },
    },
    fields: [
      { key: 'developer_token', label: 'Developer Token', type: 'password', required: true },
      { key: 'oauth_client_id', label: 'OAuth Client ID', type: 'text', required: true },
      { key: 'oauth_client_secret', label: 'OAuth Client Secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
      { key: 'login_customer_id', label: 'Manager Account ID (MCC)', type: 'text', placeholder: '123-456-7890', required: true },
    ],
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads',
    icon: Facebook,
    blurb: 'Auto-pull Facebook & Instagram ad spend, reach, leads.',
    setupGuide: {
      title: 'How to get these credentials',
      steps: [
        'Go to Meta for Developers → My Apps → create a Business app.',
        'Generate a System User Access Token in Business Settings (with ads_read & ads_management scopes).',
        'Long-lived tokens recommended (60 day, or System User for permanent).',
      ],
      link: { label: 'Open Meta for Developers', url: 'https://developers.facebook.com/apps' },
    },
    fields: [
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'app_id', label: 'App ID', type: 'text', required: true },
      { key: 'app_secret', label: 'App Secret', type: 'password', required: true },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole(user?.id);
  const [settings, setSettings] = useState<AgencySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProvider, setActiveProvider] = useState<ProviderSpec | null>(null);

  useEffect(() => { if (!authLoading && !user) navigate('/auth'); }, [authLoading, user, navigate]);

  const fetchAll = async () => {
    const { data, error } = await supabase.from('agency_settings').select('*');
    if (error) { toast.error(error.message); return; }
    setSettings(data || []);
  };

  useEffect(() => {
    if (isAdmin) fetchAll().finally(() => setLoading(false));
    else if (!roleLoading) setLoading(false);
  }, [isAdmin, roleLoading]);

  const valuesByProvider = useMemo(() => {
    const map: Record<string, Record<string, AgencySetting>> = {};
    for (const s of settings) {
      const [prov, ...rest] = s.key_name.split('__');
      const fieldKey = rest.join('__');
      if (!map[prov]) map[prov] = {};
      map[prov][fieldKey] = s;
    }
    return map;
  }, [settings]);

  const isProviderConfigured = (spec: ProviderSpec) => {
    const provVals = valuesByProvider[spec.id] || {};
    return spec.fields.filter((f) => f.required !== false).every((f) => provVals[f.key]?.value);
  };

  if (authLoading || roleLoading || loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-display font-semibold">Admin only</h1>
        <p className="text-sm text-muted-foreground">Settings are restricted to admin accounts.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-display font-semibold flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-accent" /> Integrations & API Keys
            </h1>
          </div>
          <Badge variant="outline">Admin</Badge>
        </header>

        <main className="max-w-5xl mx-auto p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect each data source once here. Once configured, the dashboard auto-pulls metrics for every client using these credentials.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {PROVIDER_SPECS.map((spec) => {
              const configured = isProviderConfigured(spec);
              const Icon = spec.icon;
              return (
                <Card key={spec.id} className="cursor-pointer hover:border-accent transition-colors" onClick={() => setActiveProvider(spec)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-muted"><Icon className="h-5 w-5 text-accent" /></div>
                        <div>
                          <CardTitle className="text-base">{spec.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">{spec.fields.length} field{spec.fields.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      {configured ? (
                        <Badge className="bg-accent/20 text-accent border-accent/30 gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-muted-foreground"><Circle className="h-3 w-3" /> Not set up</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{spec.blurb}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <CrewAccountsPanel />
          <ClientAccountsPanel />
        </main>

        {activeProvider && (
          <ProviderDialog
            spec={activeProvider}
            existing={valuesByProvider[activeProvider.id] || {}}
            userId={user!.id}
            onClose={() => setActiveProvider(null)}
            onSaved={() => { fetchAll(); setActiveProvider(null); }} />
        )}
      </div></>
  );
}

function ProviderDialog({ spec, existing, userId, onClose, onSaved }: {
  spec: ProviderSpec;
  existing: Record<string, AgencySetting>;
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    spec.fields.forEach((f) => { init[f.key] = existing[f.key]?.value || ''; });
    return init;
  });
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const Icon = spec.icon;

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const f of spec.fields) {
        const val = (values[f.key] || '').trim();
        const keyName = `${spec.id}__${f.key}`;
        const existingRow = existing[f.key];

        if (!val) {
          if (existingRow) await supabase.from('agency_settings').delete().eq('id', existingRow.id);
          continue;
        }

        if (existingRow) {
          const { error } = await supabase.from('agency_settings').update({ value: val }).eq('id', existingRow.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('agency_settings').insert({
            key_name: keyName, provider: spec.id, value: val, created_by: userId, notes: f.label,
          });
          if (error) throw error;
        }
      }
      toast.success(`${spec.name} saved`);
      onSaved();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-accent" /> {spec.name}
          </DialogTitle>
          <DialogDescription>{spec.blurb}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/40 p-3 text-xs space-y-2">
          <p className="font-semibold text-foreground">{spec.setupGuide.title}</p>
          <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
            {spec.setupGuide.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {spec.setupGuide.link && (
            <a href={spec.setupGuide.link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
              {spec.setupGuide.link.label} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {spec.fields.map((f) => {
            const isSecret = f.type === 'password';
            const showValue = !isSecret || reveal[f.key];
            return (
              <div key={f.key}>
                <div className="flex items-center justify-between">
                  <Label>{f.label}{f.required !== false && <span className="text-destructive ml-1">*</span>}</Label>
                  {isSecret && (
                    <Button type="button" variant="ghost" size="sm" className="h-6 px-2" onClick={() => setReveal((r) => ({ ...r, [f.key]: !r[f.key] }))}>
                      {showValue ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
                {f.type === 'textarea' ? (
                  <Textarea
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="font-mono text-xs min-h-[120px]"
                  />
                ) : (
                  <Input
                    type={showValue ? 'text' : 'password'}
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className={isSecret ? 'font-mono' : ''}
                  />
                )}
                {f.help && <p className="text-xs text-muted-foreground mt-1">{f.help}</p>}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="accent" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Save credentials
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
