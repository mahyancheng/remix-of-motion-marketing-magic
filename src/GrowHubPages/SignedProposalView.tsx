import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, defaultProposalData } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Download, CheckCircle2, Calendar, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

// Import proposal section components
import { ProposalHeader } from '@/components/proposal/ProposalHeader';
import { PushPullFramework } from '@/components/proposal/PushPullFramework';
import { StrategicProcess } from '@/components/proposal/StrategicProcess';
import { AIInsightsSection, defaultAIInsights } from '@/components/proposal/AIInsightsSection';
import { PaymentSchedule } from '@/components/proposal/PaymentSchedule';
import { PlatformBreakdown } from '@/components/proposal/PlatformBreakdown';
import { MarketResearchSection } from '@/components/proposal/MarketResearchSection';
import { TermsAndConditions } from '@/components/proposal/TermsAndConditions';
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

interface SignatureInfo {
  signer_name: string;
  signer_designation: string | null;
  signer_email: string | null;
  signature_data: string;
  stamp_url: string | null;
  signed_at: string;
}

const SignedProposalView = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const proposalRef = useRef<HTMLDivElement>(null);
  const [proposalData, setProposalData] = useState<ProposalData>(defaultProposalData);
  const [signatureInfo, setSignatureInfo] = useState<SignatureInfo | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [docHash, setDocHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignedProposal = async () => {
      if (!token) {
        setError('Invalid link');
        setIsLoading(false);
        return;
      }

      try {
        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-proposal-share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'get', token }),
        });

        if (!resp.ok) {
          setError('Proposal not found');
          setIsLoading(false);
          return;
        }
        const { share, signature } = await resp.json();
        if (!share) {
          setError('Proposal not found');
          setIsLoading(false);
          return;
        }
        if (!share.is_signed) {
          setError('This proposal has not been signed yet');
          setIsLoading(false);
          return;
        }

        const data = share.proposal_data as unknown as ProposalData;
        setProposalData(data);
        setClientName(share.client_name || data.clientName || 'Client');
        setQuotationNumber(share.quotation_number || null);
        setCustomerId(share.customer_id || null);
        setDocHash(share.doc_hash || null);

        if (signature) {
          setSignatureInfo({
            signer_name: signature.signer_name,
            signer_designation: signature.signer_designation,
            signer_email: signature.signer_email,
            signature_data: signature.signature_data,
            stamp_url: signature.stamp_url,
            signed_at: signature.signed_at || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error fetching signed proposal:', err);
        setError('Failed to load the proposal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignedProposal();
  }, [token]);

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
    switch (proposalData.selectedPackage) {
      case 'google-seo':
        return { name: 'Google Ads + SEO', price: 2400, budget: 2000 };
      case 'social':
        return { name: 'Social Media Paid Ads', price: 2100 + (proposalData.extraPlatforms * 300), budget: 2000 * (1 + proposalData.extraPlatforms) };
      case 'both':
        return { name: 'Complete Package', price: 4500 + (proposalData.extraPlatforms * 300), budget: 4000 + (proposalData.extraPlatforms * 2000) };
      case 'custom': {
        const customSum = (proposalData.customLineItems || []).reduce((s, i) => s + (i.monthlyAmount || 0), 0);
        return { name: 'Custom Package', price: customSum + (proposalData.extraPlatforms * 300), budget: proposalData.monthlyBreakdown?.adBudget || 0 };
      }
      default:
        return { name: 'Custom Package', price: 0, budget: 0 };
    }
  };

  const packageInfo = getPackageDetails();

  // Helper to preload images with CORS for canvas capture
  const preloadImagesForCanvas = async (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const loadPromises: Promise<void>[] = [];

    images.forEach((img) => {
      const src = img.src;
      if (!src) return;

      // Check if it's an external URL (not data: or blob:)
      const isExternal = !src.startsWith('data:') && !src.startsWith('blob:');

      if (isExternal) {
        const promise = new Promise<void>((resolve) => {
          const newImg = new Image();
          newImg.crossOrigin = 'anonymous';
          newImg.onload = () => {
            // Replace the original image src to trigger reload with CORS
            img.crossOrigin = 'anonymous';
            img.src = src;
            resolve();
          };
          newImg.onerror = () => {
            console.warn('Failed to preload image:', src);
            resolve(); // Continue even if image fails
          };
          newImg.src = src;
        });
        loadPromises.push(promise);
      }
    });

    await Promise.all(loadPromises);
    // Small delay to ensure DOM updates
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleDownloadPDF = async () => {
    if (!proposalRef.current) return;

    setIsGeneratingPDF(true);
    try {
      // 🚀 核心优化：在点击下载时动态加载重型库
      // 这样在页面初始加载时，这些代码不会被包含在主包中
      const [html2canvas, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      // 确保图片资源加载完成
      await preloadImagesForCanvas(proposalRef.current);

      // 调用动态加载的 html2canvas
      const canvas = await html2canvas(proposalRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#121212',
        windowWidth: proposalRef.current.scrollWidth,
        windowHeight: proposalRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const A4_WIDTH_MM = 210;
      const aspectRatio = imgHeightPx / imgWidthPx;
      const pageHeightMM = A4_WIDTH_MM * aspectRatio;

      // 使用动态加载的 jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [A4_WIDTH_MM, pageHeightMM],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, pageHeightMM);
      pdf.save(`Signed_Proposal_${clientName || 'Client'}_${formatDate(proposalData.date)}.pdf`);

      toast({
        title: 'PDF Downloaded',
        description: 'Your signed proposal has been saved.',
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not generate PDF. Please try again.',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">{error}</h1>
          <p className="mt-2 text-muted-foreground">
            This link may be invalid or the proposal hasn't been signed yet.
          </p>
        </div>
        <Button onClick={() => navigate('/admins')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-lg font-semibold text-foreground">
                Signed Proposal
              </h1>
              <span className="text-sm text-muted-foreground">
                {clientName}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </header>

        {/* Signature Banner */}
        {signatureInfo && (
          <div className="border-b border-accent/20 bg-accent/5">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Signed & Accepted</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{signatureInfo.signer_name}</span>
                  </div>

                  {signatureInfo.signer_designation && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      <span>{signatureInfo.signer_designation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(signatureInfo.signed_at), 'dd MMM yyyy, h:mm a')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Content */}
        <main className="container mx-auto px-4 py-8">
          <div ref={proposalRef} className="space-y-16 rounded-3xl bg-card p-8 shadow-card md:p-16 mx-auto max-w-5xl">
            {/* Header */}
            <ProposalHeader data={proposalData} formatDate={formatDate} />

            {/* Executive Summary */}
            <ExecutiveSummary data={proposalData} formatDate={formatDate} />

            {/* Business Context */}
            <BusinessContext data={proposalData} formatCurrency={formatCurrency} />

            {/* Push-Pull Framework */}
            <div className="border-t border-border pt-16">
              <PushPullFramework />
            </div>

            {/* Strategic Marketing Process */}
            <div className="border-t border-border pt-16">
              <StrategicProcess />
            </div>

            {/* Market Research Section */}
            {proposalData.marketResearch && (
              <div className="border-t border-border pt-16">
                <MarketResearchSection data={proposalData} />
              </div>
            )}

            {/* Insights Section */}
            <div className="border-t border-border pt-16">
              <AIInsightsSection
                insights={defaultAIInsights}
                manualNotes=""
                onNotesChange={() => { }}
                isEditable={false} />
            </div>

            {/* Strategy & Positioning */}
            <div className="border-t border-border pt-16">
              <StrategyPositioning data={proposalData} />
            </div>

            {/* Platform Breakdown */}
            {(proposalData.selectedPackage === 'social' || proposalData.selectedPackage === 'both') && proposalData.selectedPlatforms?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PlatformBreakdown data={proposalData} formatCurrency={formatCurrency} />
              </div>
            )}

            {/* Recommended Package */}
            <div className="border-t border-border pt-16">
              <RecommendedPackage packageInfo={packageInfo} formatCurrency={formatCurrency} />
            </div>

            {/* Payment Schedule */}
            {proposalData.paymentSchedule?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PaymentSchedule data={proposalData} formatCurrency={formatCurrency} formatDate={formatDate} />
              </div>
            )}

            {/* Budget Recommendation */}
            <div className="border-t border-border pt-16">
              <BudgetRecommendation data={proposalData} formatCurrency={formatCurrency} />
            </div>

            {/* Implementation Timeline */}
            <div className="border-t border-border pt-16">
              <ImplementationTimeline />
            </div>

            {/* KPI & Reporting */}
            <div className="border-t border-border pt-16">
              <KPIReporting data={proposalData} />
            </div>

            {/* Terms & Conditions */}
            <div className="border-t border-border pt-16">
              <TermsAndConditions contractMonths={proposalData.contractMonths} />
            </div>

            {/* Formal Legal Quotation */}
            <div className="border-t border-border pt-16">
              <FormalQuotation
                data={proposalData}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                quotationNumber={quotationNumber}
                customerId={customerId}
                docHash={docHash} />
            </div>

            {/* Signature Section — mirrors the CustomerAcceptance block clients sign,
                filled in with the captured signature record. */}
            {signatureInfo && (
              <div className="border-t border-border pt-16">
                <section className="space-y-6">
                  <div className="mb-8">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
                        <CheckCircle2 className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">Customer Acceptance</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Signed electronically on {format(new Date(signatureInfo.signed_at), 'dd MMMM yyyy')} at{' '}
                          {format(new Date(signatureInfo.signed_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden">
                    {/* Header */}
                    <div className="bg-accent/20 px-6 py-3 border-b border-accent/30">
                      <h4 className="font-display font-bold text-foreground text-center">Customer Acceptance</h4>
                    </div>

                    {/* Acceptance Text */}
                    <div className="p-6 space-y-8">
                      <p className="text-muted-foreground leading-relaxed">
                        We hereby confirm acceptance of this quotation and agree to proceed with the order based on the terms and
                        conditions stated herein. This signed quotation shall serve as confirmation of order in lieu of an official
                        Purchase Order (PO).
                      </p>

                      {/* Signature Section */}
                      <div className="max-w-xl mx-auto">
                        <div className="space-y-6">
                          <h5 className="font-display font-bold text-foreground border-b border-border pb-2">
                            Client
                          </h5>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Company Stamp &amp; Signature:</p>
                              <div className="flex items-end gap-4 border-b-2 border-muted-foreground/30 pb-2">
                                <div className="rounded-xl bg-white px-4 py-2">
                                  <img
                                    src={signatureInfo.signature_data}
                                    alt="Signature"
                                    className="h-16 w-auto object-contain"
                                    crossOrigin="anonymous" />
                                </div>
                                {signatureInfo.stamp_url && (
                                  <div className="rounded-xl bg-white px-4 py-2">
                                    <img
                                      src={signatureInfo.stamp_url}
                                      alt="Company Stamp"
                                      className="h-16 w-auto object-contain"
                                      crossOrigin="anonymous" />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Name:</p>
                                <div className="h-8 border-b border-muted-foreground/30">
                                  <span className="text-foreground font-semibold">{signatureInfo.signer_name}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Designation:</p>
                                <div className="h-8 border-b border-muted-foreground/30">
                                  <span className="text-foreground">{signatureInfo.signer_designation || '—'}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Date:</p>
                              <div className="h-8 border-b border-muted-foreground/30 w-48">
                                <span className="text-foreground">
                                  {format(new Date(signatureInfo.signed_at), 'dd MMMM yyyy')}
                                </span>
                              </div>
                            </div>

                            {signatureInfo.signer_email && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Email:</p>
                                <div className="h-8 border-b border-muted-foreground/30">
                                  <span className="text-foreground">{signatureInfo.signer_email}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <p className="text-xs text-muted-foreground text-center italic">
                    Executed copy — accepted electronically by the signatory named above. This record is retained with the
                    quotation reference and document hash shown in the formal quotation.
                  </p>
                </section>
              </div>
            )}

            {/* Footer */}
            <ProposalFooter formatDate={formatDate} date={proposalData.date} />
          </div>
        </main>
      </div></>
  );
};

export default SignedProposalView;