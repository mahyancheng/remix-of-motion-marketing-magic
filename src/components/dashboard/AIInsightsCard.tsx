import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Sparkles, Loader2, RefreshCw, TrendingUp, TrendingDown, Minus,
  Trophy, AlertTriangle, Lightbulb, Download, History, Trash2, FileText, Eye,
  ImagePlus, X, BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type MetricEntry } from '@/GrowHubHooks/useClients';
import MetricsCharts from './MetricsCharts';
import leadzapLogo from '@/assets/leadzap-logo.png';

const PROVIDER_META: Record<string, { label: string; source: string }> = {
  google_ads: { label: 'Google Ads', source: 'Google Ads API (advertiser account)' },
  google_analytics: { label: 'Google Analytics', source: 'Google Analytics 4 Data API (GA4 property)' },
  google_search_console: { label: 'Google Search Console', source: 'Google Search Console API (verified property)' },
  meta_ads: { label: 'Meta Ads', source: 'Meta Marketing API (Facebook & Instagram ad account)' },
};
const AI_MODEL_LABEL = 'Google Gemini 2.5 Flash via Lovable AI Gateway';

const CHART_PROVIDERS = ['google_ads', 'google_analytics', 'google_search_console', 'meta_ads'];

interface Props {
  clientId: string;
  clientName?: string;
  range: { from: Date; to: Date };
  hasMetrics: boolean;
  metrics?: MetricEntry[];
  canManage?: boolean;
}

interface KPI { label: string; value: string; trend: 'up' | 'down' | 'flat'; trend_pct: string; sentiment: 'positive' | 'negative' | 'neutral'; }
interface Item { title: string; detail: string; }
interface Breakdown { provider: string; metric: string; analysis: string; verdict: 'positive' | 'negative' | 'neutral'; }
export interface InsightsResult {
  headline: string;
  summary: string;
  kpi_highlights: KPI[];
  metric_breakdowns?: Breakdown[];
  wins: Item[];
  concerns: Item[];
  recommendations: Item[];
}
interface UserImage { url: string; caption: string }
interface ReportRow {
  id: string;
  client_id: string;
  range_start: string | null;
  range_end: string | null;
  result: InsightsResult & { user_images?: UserImage[] };
  created_at: string;
}

const cacheKey = (clientId: string, from: Date, to: Date) =>
  `ai-insights:${clientId}:${format(from, 'yyyy-MM-dd')}:${format(to, 'yyyy-MM-dd')}`;

function renderHighlighted(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const boldRe = /\*\*([^*]+)\*\*/g;
  let lastIdx = 0; let key = 0; let m: RegExpExecArray | null;
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(<span key={key++}>{text.slice(lastIdx, m.index)}</span>);
    parts.push(<span key={key++} className="font-display font-bold text-accent text-[1.15em] tracking-tight">{m[1]}</span>);
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push(<span key={key++}>{text.slice(lastIdx)}</span>);
  return <>{parts}</>;
}

export default function AIInsightsCard({ clientId, clientName, range, hasMetrics, metrics = [], canManage = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsightsResult | null>(null);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [history, setHistory] = useState<ReportRow[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeReportMeta, setActiveReportMeta] = useState<{ from: string; to: string; created: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Reset & restore on client/range change
  useEffect(() => {
    setData(null);
    setUserImages([]);
    setActiveReportMeta(null);
    try {
      const cached = localStorage.getItem(cacheKey(clientId, range.from, range.to));
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed.result);
        setUserImages(parsed.user_images || []);
        setActiveReportMeta(parsed.meta || null);
      }
    } catch {}
    void loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, range.from.getTime(), range.to.getTime()]);

  const persistCache = (next: { result?: InsightsResult; images?: UserImage[]; meta?: any }) => {
    try {
      const merged = {
        result: next.result ?? data,
        user_images: next.images ?? userImages,
        meta: next.meta ?? activeReportMeta,
      };
      localStorage.setItem(cacheKey(clientId, range.from, range.to), JSON.stringify(merged));
    } catch {}
  };

  const loadHistory = async () => {
    const { data: rows, error } = await supabase
      .from('ai_insight_reports')
      .select('id, client_id, range_start, range_end, result, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) setHistory((rows || []) as any);
  };

  const generate = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const { data: resp, error } = await supabase.functions.invoke('metrics-insights', {
        body: {
          client_id: clientId,
          start_date: format(range.from, 'yyyy-MM-dd'),
          end_date: format(range.to, 'yyyy-MM-dd'),
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (error || (resp as any)?.error) {
        toast.error((resp as any)?.error || error?.message || 'Failed to generate insights');
        return;
      }
      const result: InsightsResult = (resp as any).result;
      const meta = { from: format(range.from, 'yyyy-MM-dd'), to: format(range.to, 'yyyy-MM-dd'), created: new Date().toISOString() };
      setData(result);
      setActiveReportMeta(meta);
      persistCache({ result, meta });

      if (canManage) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { error: insErr } = await supabase.from('ai_insight_reports').insert({
            client_id: clientId,
            created_by: userData.user.id,
            range_start: meta.from,
            range_end: meta.to,
            result: { ...result, user_images: userImages } as any,
          });
          if (!insErr) void loadHistory();
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${clientId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('report-images').upload(path, file, { cacheControl: '3600' });
      if (error) throw error;
      const { data: pub } = supabase.storage.from('report-images').getPublicUrl(path);
      const next = [...userImages, { url: pub.publicUrl, caption: '' }];
      setUserImages(next);
      persistCache({ images: next });
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateCaption = (idx: number, caption: string) => {
    const next = userImages.map((u, i) => (i === idx ? { ...u, caption } : u));
    setUserImages(next);
    persistCache({ images: next });
  };

  const removeImage = (idx: number) => {
    const next = userImages.filter((_, i) => i !== idx);
    setUserImages(next);
    persistCache({ images: next });
  };

  const viewHistorical = (r: ReportRow) => {
    setData(r.result);
    setUserImages(r.result.user_images || []);
    setActiveReportMeta({ from: r.range_start || '', to: r.range_end || '', created: r.created_at });
    setShowHistory(false);
  };

  const deleteHistorical = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    const { error } = await supabase.from('ai_insight_reports').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Report deleted');
    void loadHistory();
  };

  const downloadPDF = async () => {
    const target = previewRef.current;
    if (!target || !data) return;
    setDownloading(true);
    try {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 350));
      const canvas = await html2canvas(target, { scale: 2, backgroundColor: '#0a0a0a', useCORS: true, windowWidth: target.scrollWidth });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      if (imgH <= pdfH) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH);
      } else {
        let position = 0; let remaining = imgH;
        while (remaining > 0) {
          pdf.addImage(imgData, 'PNG', 0, position, pdfW, imgH);
          remaining -= pdfH;
          if (remaining > 0) { position -= pdfH; pdf.addPage(); }
        }
      }
      pdf.save(`${(clientName || 'client').replace(/\s+/g, '-')}-insights-${activeReportMeta?.from || 'report'}.pdf`);
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  // Filter metrics to only the providers that have native charts
  const chartMetrics = metrics.filter((m) => CHART_PROVIDERS.includes(m.provider));


  return (
    <section className="space-y-6 rounded-2xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">AI Performance Report</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(range.from, 'MMM d')} – {format(range.to, 'MMM d, yyyy')}
              {activeReportMeta?.created && (
                <span className="ml-2 text-xs opacity-70">· generated {format(new Date(activeReportMeta.created), 'MMM d, HH:mm')}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data && (
            <Button size="sm" variant="accent" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-1.5" /> Preview Report
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowHistory((v) => !v)}>
            <History className="h-4 w-4 mr-1.5" /> History {history.length > 0 && <span className="ml-1 text-xs opacity-70">({history.length})</span>}
          </Button>
          {canManage && (
            <Button size="sm" variant={data ? 'outline' : 'accent'} onClick={generate} disabled={loading || !hasMetrics}>
              {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : data ? <RefreshCw className="h-4 w-4 mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
              {data ? 'Regenerate' : 'Generate Report'}
            </Button>
          )}
        </div>
      </div>

      {/* History */}
      {showHistory && (
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-accent" />
            <span className="font-semibold text-sm">Saved Reports</span>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-3 text-center">No saved reports yet.</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-auto">
              {history.map((r) => (
                <li key={r.id} className="flex items-center gap-2 rounded-lg bg-background/60 border border-border px-3 py-2 text-sm">
                  <button onClick={() => viewHistorical(r)} className="flex-1 min-w-0 text-left hover:text-accent transition">
                    <span className="font-medium">{r.range_start} → {r.range_end}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{format(new Date(r.created_at), 'MMM d, yyyy HH:mm')}</span>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{r.result?.headline}</div>
                  </button>
                  {canManage && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-8 px-2 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      onClick={(e) => { e.stopPropagation(); deleteHistorical(r.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Body summary (compact) */}
      {!hasMetrics && !data ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No metrics available to analyze in this period.</p>
      ) : !data && !loading ? (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <Sparkles className="h-10 w-10 text-accent mx-auto mb-3 opacity-60" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {canManage ? <>Click <strong className="text-foreground">Generate Report</strong> to produce a structured analyst report.</> : <>No report generated yet for this period.</>}
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-12">
          <Loader2 className="h-5 w-5 animate-spin text-accent" /> Analyzing performance data…
        </div>
      ) : data ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border border-accent/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">Overview</p>
            <h4 className="font-display text-lg font-bold text-foreground leading-snug mb-2">{renderHighlighted(data.headline)}</h4>
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{renderHighlighted(data.summary)}</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">Click <strong>Preview Report</strong> to see the full structured report with charts, breakdowns, and your custom images.</p>
        </div>
      ) : null}

      {/* User images management (admin only, outside preview so they can edit before downloading) */}
      {canManage && data && (
        <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-accent" />
              <span className="font-semibold text-sm">Custom Images & Notes</span>
              <span className="text-xs text-muted-foreground">(included in the report)</span>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f); e.currentTarget.value = ''; }}
              />
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:border-accent">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                Add Image
              </span>
            </label>
          </div>
          {userImages.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No images added yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {userImages.map((img, i) => (
                <div key={i} className="rounded-lg border border-border bg-background overflow-hidden">
                  <div className="relative">
                    <img src={img.url} alt="" className="w-full h-40 object-cover" />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeImage(i)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Textarea
                    value={img.caption}
                    onChange={(e) => updateCaption(i, e.target.value)}
                    placeholder="Describe this image (e.g. ad creative, screenshot, customer review)…"
                    className="border-0 rounded-none text-sm min-h-[60px] resize-none focus-visible:ring-0"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PREVIEW DIALOG — full report */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 border-b border-border bg-card px-6 py-3">
            <DialogTitle className="font-display">Report Preview · {clientName}</DialogTitle>
            <Button size="sm" variant="accent" onClick={downloadPDF} disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
              Download PDF
            </Button>
          </DialogHeader>
          {data && (
            <div ref={previewRef} className="bg-card p-8 space-y-8">
              {/* COVER HEADER — branded, professional */}
              <header className="space-y-6">
                <div className="flex items-center justify-between">
                  <img src={leadzapLogo} alt="Leadzap" className="h-12" crossOrigin="anonymous" />
                  <div className="text-right text-xs text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">www.leadzapmarketing.com.my</p>
                    <p>www.leadzapmarketing.com</p>
                  </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 accent-gradient opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 opacity-25">
                    <Sparkles className="h-24 w-24 text-accent-foreground" />
                  </div>
                  <div className="relative z-10 p-8 md:p-12">
                    <span className="inline-block rounded-full bg-accent-foreground/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-4">
                      AI Performance Report
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-3 leading-tight">
                      {clientName || 'Client'}
                    </h2>
                    <div className="text-accent-foreground/85 text-sm space-y-1">
                      <p><strong>Reporting period:</strong> {activeReportMeta?.from || format(range.from, 'yyyy-MM-dd')} → {activeReportMeta?.to || format(range.to, 'yyyy-MM-dd')}</p>
                      <p><strong>Prepared by:</strong> Leadzap Marketing</p>
                      <p><strong>Generated:</strong> {activeReportMeta?.created ? format(new Date(activeReportMeta.created), 'MMMM d, yyyy · HH:mm') : format(new Date(), 'MMMM d, yyyy · HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </header>

              {/* SECTION 1: OVERVIEW */}
              <section>
                <SectionHeader number="1" title="Overview" icon={Sparkles} />
                <div className="rounded-2xl bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border border-accent/30 p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">{clientName || ''}</div>
                  <h4 className="font-display text-2xl font-bold text-foreground leading-tight mb-3">{renderHighlighted(data.headline)}</h4>
                  <p className="text-foreground/85 leading-relaxed">{renderHighlighted(data.summary)}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Period: {activeReportMeta?.from || format(range.from, 'yyyy-MM-dd')} → {activeReportMeta?.to || format(range.to, 'yyyy-MM-dd')}
                  </p>
                </div>
                {data.kpi_highlights?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                    {data.kpi_highlights.map((k, i) => {
                      const TrendIcon = k.trend === 'up' ? TrendingUp : k.trend === 'down' ? TrendingDown : Minus;
                      const trendColor = k.sentiment === 'positive' ? 'text-emerald-400' : k.sentiment === 'negative' ? 'text-rose-400' : 'text-muted-foreground';
                      return (
                        <div key={i} className="rounded-xl border border-border bg-secondary/40 p-4">
                          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">{k.label}</div>
                          <div className="mt-2 font-display text-2xl font-bold text-accent tabular-nums leading-none">{k.value}</div>
                          <div className={cn('mt-2 flex items-center gap-1 text-xs font-semibold', trendColor)}>
                            <TrendIcon className="h-3 w-3" /> {k.trend_pct}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="mt-3 text-[11px] text-muted-foreground italic">
                  Source: aggregated metrics from connected platforms (see Section 2). KPI selection, trend % and narrative generated by {AI_MODEL_LABEL}.
                </p>
              </section>

              {/* SECTION 2: PERFORMANCE CHARTS — one chart per provider, followed by per-metric AI explanation */}
              {chartMetrics.length > 0 && (
                <section>
                  <SectionHeader number="2" title="Performance Charts" icon={BarChart3} />
                  <div className="space-y-6">
                    {CHART_PROVIDERS.map((prov) => {
                      const provMetrics = chartMetrics.filter((m) => m.provider === prov);
                      if (provMetrics.length === 0) return null;
                      // Normalize provider names so AI's "Google Ads" matches our "google_ads"
                      const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                      const provNorm = norm(prov);
                      const breakdowns = (data.metric_breakdowns || []).filter((b) => {
                        const bn = norm(b.provider);
                        return bn === provNorm
                          || (provNorm === 'google_search_console' && (bn === 'gsc' || bn.includes('search_console')))
                          || (provNorm === 'google_analytics' && (bn === 'ga4' || bn.includes('analytics')))
                          || (provNorm === 'google_ads' && bn.includes('google_ads'))
                          || (provNorm === 'meta_ads' && (bn.includes('meta') || bn.includes('facebook')));
                      });
                      const meta = PROVIDER_META[prov] || { label: prov, source: prov };
                      const providerLabel = meta.label;
                      return (
                        <div key={prov} className="space-y-3">
                          <h5 className="font-display text-base font-bold text-foreground/90 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {providerLabel}
                          </h5>
                          <MetricsCharts metrics={provMetrics} range={range} />
                          <p className="text-[11px] text-muted-foreground italic">
                            Chart data source: <span className="not-italic font-medium text-foreground/70">{meta.source}</span>, synced into Leadzap on {format(new Date(), 'MMM d, yyyy')}.
                          </p>
                          {breakdowns.length > 0 ? (
                            <>
                              <div className="grid md:grid-cols-2 gap-3">
                                {breakdowns.map((b, i) => {
                                  const verdictColor = b.verdict === 'positive' ? 'border-emerald-500/40 bg-emerald-500/5' : b.verdict === 'negative' ? 'border-rose-500/40 bg-rose-500/5' : 'border-border bg-secondary/30';
                                  const verdictDot = b.verdict === 'positive' ? 'bg-emerald-400' : b.verdict === 'negative' ? 'bg-rose-400' : 'bg-muted-foreground';
                                  return (
                                    <div key={i} className={cn('rounded-xl border p-4', verdictColor)}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={cn('h-2 w-2 rounded-full', verdictDot)} />
                                        <h6 className="font-display font-bold text-foreground text-sm">{b.metric}</h6>
                                      </div>
                                      <p className="text-sm text-foreground/85 leading-relaxed">{renderHighlighted(b.analysis)}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-[11px] text-muted-foreground italic">
                                Analysis generated by {AI_MODEL_LABEL}, based on {meta.label} data above. Interpretations are AI-assisted and should be reviewed by a Leadzap strategist before action.
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No detailed AI breakdown for this provider — regenerate the report to include explanations.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* SECTION 3: USER IMAGES */}
              {userImages.length > 0 && (
                <section>
                  <SectionHeader number="3" title="Supporting Visuals" icon={ImagePlus} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {userImages.map((img, i) => (
                      <figure key={i} className="rounded-2xl border border-border overflow-hidden bg-secondary/30">
                        <img src={img.url} alt={img.caption} className="w-full h-56 object-cover" crossOrigin="anonymous" />
                        <figcaption className="p-3 space-y-1.5">
                          {img.caption && (
                            <p className="text-sm text-foreground/85 leading-relaxed">{renderHighlighted(img.caption)}</p>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[11px] font-semibold tracking-wide">
                            Info by Leadzap Management
                          </span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 4: SUMMARY (wins/concerns/recommendations) */}
              <section>
                <SectionHeader number={userImages.length > 0 ? '4' : '3'} title="Summary & Next Steps" icon={Lightbulb} />
                <div className="grid md:grid-cols-2 gap-4">
                  <InsightBlock icon={Trophy} title="Wins" items={data.wins} accent="emerald" emptyText="No notable wins this period." />
                  <InsightBlock icon={AlertTriangle} title="Concerns" items={data.concerns} accent="rose" emptyText="No concerns flagged." />
                </div>
                <div className="mt-4">
                  <InsightBlock icon={Lightbulb} title="Recommendations" items={data.recommendations} accent="accent" emptyText="No recommendations." fullWidth />
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground italic">
                  Wins, concerns and recommendations synthesized by {AI_MODEL_LABEL} from the data above. Final strategic decisions are made by the Leadzap team.
                </p>
              </section>

              {/* CLOSING FOOTER */}
              <footer className="mt-4 rounded-2xl border border-border bg-secondary/30 p-6 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img src={leadzapLogo} alt="Leadzap" className="h-9" crossOrigin="anonymous" />
                    <div>
                      <div className="font-display font-bold text-foreground">Leadzap Marketing</div>
                      <div className="text-xs text-muted-foreground">Performance marketing, simplified.</div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">www.leadzapmarketing.com.my</p>
                    <p>www.leadzapmarketing.com</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-[11px] text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground/80">Disclaimer.</strong> This report is prepared by Leadzap Marketing for the exclusive use of {clientName || 'the client'}. Quantitative data is sourced directly from the third-party platforms listed under each chart. Narrative analysis, KPI selection and recommendations are generated by {AI_MODEL_LABEL} and reviewed by Leadzap Management. Sections labelled "Info by Leadzap Management" reflect human-curated commentary and supporting visuals provided by the Leadzap team.</p>
                  <p><strong className="text-foreground/80">Confidentiality.</strong> The contents of this report are confidential and intended solely for the named recipient. Redistribution without written consent is not permitted.</p>
                  <p>© {new Date().getFullYear()} Leadzap Marketing. All rights reserved.</p>
                </div>
              </footer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function SectionHeader({ number, title, icon: Icon }: { number: string; title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent font-display font-bold">{number}</span>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      </div>
    </div>
  );
}

function InsightBlock({
  icon: Icon, title, items, accent, emptyText, fullWidth,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: Item[];
  accent: 'emerald' | 'rose' | 'accent';
  emptyText: string;
  fullWidth?: boolean;
}) {
  const styles = {
    emerald: { wrap: 'border-emerald-500/30 bg-emerald-500/5', chip: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
    rose: { wrap: 'border-rose-500/30 bg-rose-500/5', chip: 'bg-rose-500/15 text-rose-400', dot: 'bg-rose-400' },
    accent: { wrap: 'border-accent/30 bg-accent/5', chip: 'bg-accent/15 text-accent', dot: 'bg-accent' },
  }[accent];
  return (
    <div className={cn('rounded-2xl border p-5', styles.wrap, fullWidth && 'md:col-span-2')}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('rounded-lg p-2', styles.chip)}><Icon className="h-4 w-4" /></div>
        <h4 className="font-display font-bold text-foreground">{title}</h4>
        <span className="ml-auto text-xs text-muted-foreground">{items?.length || 0}</span>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', styles.dot)} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground text-sm leading-snug">{renderHighlighted(it.title)}</div>
                <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{renderHighlighted(it.detail)}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">{emptyText}</p>
      )}
    </div>
  );
}
