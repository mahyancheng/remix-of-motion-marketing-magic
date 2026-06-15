import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, Edit, Eye, Share2, Link, Copy, Loader2 } from 'lucide-react';
import { ProposalData, defaultProposalData } from '@/types/proposal';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';
import { useProposalShare } from '@/GrowHubHooks/useProposalShare';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Import refactored components
import { ProposalHeader } from '@/components/proposal/ProposalHeader';
import { PushPullFramework } from '@/components/proposal/PushPullFramework';
import { StrategicProcess } from '@/components/proposal/StrategicProcess';
import { AIInsightsSection, AIInsight, defaultAIInsights } from '@/components/proposal/AIInsightsSection';
import { PaymentSchedule } from '@/components/proposal/PaymentSchedule';
import { PlatformBreakdown } from '@/components/proposal/PlatformBreakdown';
import { MarketResearchSection } from '@/components/proposal/MarketResearchSection';
import { TermsAndConditions } from '@/components/proposal/TermsAndConditions';
import { CustomerAcceptance } from '@/components/proposal/CustomerAcceptance';
import {
  ExecutiveSummary,
  BusinessContext,
  StrategyPositioning,
  RecommendedPackage,
  BudgetRecommendation,
  ImplementationTimeline,
  KPIReporting,
  ProposalFooter,
} from '@/components/proposal/ProposalSections';
import { FormalQuotation } from '@/components/proposal/FormalQuotation';
import { Helmet } from 'react-helmet-async';

const ProposalOutput = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(defaultAIInsights);
  const [manualNotes, setManualNotes] = useState('');
  const proposalRef = useRef<HTMLDivElement>(null);
  const { isGenerating, shareInfo, shareUrl, generateShareLink, copyShareLink } = useProposalShare();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [quoteOverride, setQuoteOverride] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('proposalData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData(parsedData);

        // Load any stored insights/notes
        const storedInsights = sessionStorage.getItem('proposalInsights');
        const storedNotes = sessionStorage.getItem('proposalNotes');
        if (storedInsights) setAiInsights(JSON.parse(storedInsights));
        if (storedNotes) setManualNotes(storedNotes);
      } catch {
        navigate('/tool');
      }
    } else {
      navigate('/tool');
    }
  }, [navigate]);

  // Save notes when changed
  useEffect(() => {
    sessionStorage.setItem('proposalNotes', manualNotes);
  }, [manualNotes]);

  const handleGenerateShareLink = async () => {
    await generateShareLink(data, undefined, quoteOverride ? { quotationNumber: quoteOverride } : undefined);
    setShowShareDialog(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: value < 10 ? 2 : 0,
      maximumFractionDigits: value < 10 ? 2 : 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getPackageDetails = () => {
    switch (data.selectedPackage) {
      case 'google-seo':
        return { name: 'Google Ads + SEO', price: 2400, budget: 2000 };
      case 'social':
        return { name: 'Social Media Paid Ads', price: 2100 + (data.extraPlatforms * 300), budget: 2000 * (1 + data.extraPlatforms) };
      case 'both':
        return { name: 'Complete Package', price: 4500 + (data.extraPlatforms * 300), budget: 4000 + (data.extraPlatforms * 2000) };
      case 'custom': {
        const customSum = (data.customLineItems || []).reduce((s, i) => s + (i.monthlyAmount || 0), 0);
        return { name: 'Custom Package', price: customSum + (data.extraPlatforms * 300), budget: data.monthlyBreakdown?.adBudget || 0 };
      }
      default:
        return { name: 'Custom Package', price: 0, budget: 0 };
    }
  };

  const packageInfo = getPackageDetails();

  const handleDownloadPDF = async () => {
    if (!proposalRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // 🚀 核心优化：动态加载重型库
      const [html2canvas, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      // Capture the full proposal as a high-quality image
      const canvas = await html2canvas(proposalRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#121212',
        windowWidth: proposalRef.current.scrollWidth,
        windowHeight: proposalRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      // A4 width in mm, calculate proportional height
      const A4_WIDTH_MM = 210;

      // Calculate the height needed to maintain aspect ratio
      const aspectRatio = imgHeightPx / imgWidthPx;
      const pageHeightMM = A4_WIDTH_MM * aspectRatio;

      // Create PDF with custom page height to fit all content on one page
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [A4_WIDTH_MM, pageHeightMM],
      });

      // Add the image edge-to-edge (no margins)
      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, pageHeightMM);

      // 注意：这里请确保 data 变量在作用域内可访问，或将其替换为对应的 state 变量
      pdf.save(`Leadzap_Proposal_${data?.clientName || 'Client'}_${formatDate(data?.date || new Date().toISOString())}.pdf`);

      toast({
        title: 'PDF Downloaded',
        description: 'Your proposal has been saved as a one-page PDF matching the website view.',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not generate PDF. Please try again.',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <><Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

      <div className="min-h-screen bg-background">
        {/* Top bar - hidden in print */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tool')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tool
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="font-display font-semibold text-foreground">
              Proposal for {data.clientName || 'Client'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notes
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateShareLink}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Share for Signing'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Quotation for Signing</DialogTitle>
                  <DialogDescription>
                    Send this link to your client. They can review the proposal and sign digitally.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {!shareUrl && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground">Custom quote number (optional)</label>
                      <Input
                        value={quoteOverride}
                        onChange={(e) => setQuoteOverride(e.target.value)}
                        placeholder="e.g. Q-2026/009 — leave blank to auto-generate"
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                  {shareInfo && (
                    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs space-y-1">
                      <div><span className="text-muted-foreground">Quote No:</span> <span className="font-mono font-semibold text-accent">{shareInfo.quotationNumber}</span></div>
                      <div><span className="text-muted-foreground">Customer ID:</span> <span className="font-mono">{shareInfo.customerId}</span></div>
                      <div className="break-all"><span className="text-muted-foreground">Hash:</span> <span className="font-mono">{shareInfo.docHash.slice(0, 32)}…</span></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl || ''}
                      readOnly
                      className="font-mono text-sm"
                      placeholder="Click 'Share for Signing' to generate"
                    />
                    <Button onClick={copyShareLink} variant="outline" size="icon" disabled={!shareUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Signing this link is legally binding and auto-issues an invoice. Link valid for 30 days.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="accent-gradient text-accent-foreground" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </header>

        {/* Proposal Content */}
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div ref={proposalRef} className="space-y-16 rounded-3xl bg-card p-8 shadow-card md:p-16">
            {/* Header */}
            <ProposalHeader data={data} formatDate={formatDate} />

            {/* Executive Summary */}
            <ExecutiveSummary data={data} formatDate={formatDate} />

            {/* Business Context */}
            <BusinessContext data={data} formatCurrency={formatCurrency} />

            {/* Push-Pull Framework */}
            <div className="border-t border-border pt-16">
              <PushPullFramework />
            </div>

            {/* Strategic Marketing Process */}
            <div className="border-t border-border pt-16">
              <StrategicProcess />
            </div>

            {/* Market Research Section */}
            {data.marketResearch && (
              <div className="border-t border-border pt-16">
                <MarketResearchSection data={data} />
              </div>
            )}

            {/* Insights Section */}
            <div className="border-t border-border pt-16">
              <AIInsightsSection
                insights={aiInsights}
                manualNotes={manualNotes}
                onNotesChange={setManualNotes}
                isEditable={isEditMode}
              />
            </div>

            {/* Strategy & Positioning */}
            <div className="border-t border-border pt-16">
              <StrategyPositioning data={data} />
            </div>

            {/* Platform Breakdown */}
            {(data.selectedPackage === 'social' || data.selectedPackage === 'both') && data.selectedPlatforms?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PlatformBreakdown data={data} formatCurrency={formatCurrency} />
              </div>
            )}

            {/* Recommended Package */}
            <div className="border-t border-border pt-16">
              <RecommendedPackage packageInfo={packageInfo} formatCurrency={formatCurrency} />
            </div>

            {/* Payment Schedule */}
            {data.paymentSchedule?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PaymentSchedule data={data} formatCurrency={formatCurrency} formatDate={formatDate} />
              </div>
            )}

            {/* Budget Recommendation */}
            <div className="border-t border-border pt-16">
              <BudgetRecommendation data={data} formatCurrency={formatCurrency} />
            </div>

            {/* Implementation Timeline */}
            <div className="border-t border-border pt-16">
              <ImplementationTimeline />
            </div>

            {/* KPI & Reporting */}
            <div className="border-t border-border pt-16">
              <KPIReporting data={data} />
            </div>

            {/* Terms & Conditions */}
            <div className="border-t border-border pt-16">
              <TermsAndConditions contractMonths={data.contractMonths} />
            </div>

            {/* Formal Legal Quotation */}
            <div className="border-t border-border pt-16">
              <FormalQuotation
                data={data}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                quotationNumber={shareInfo?.quotationNumber ?? null}
                customerId={shareInfo?.customerId ?? null}
                docHash={shareInfo?.docHash ?? null}
              />
            </div>

            {/* Customer Acceptance / Signature */}
            <div className="border-t border-border pt-16">
              <CustomerAcceptance data={data} formatDate={formatDate} />
            </div>

            {/* Footer */}
            <ProposalFooter formatDate={formatDate} date={data.date} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalOutput;
