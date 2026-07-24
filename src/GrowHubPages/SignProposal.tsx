import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, defaultProposalData } from '@/types/proposal';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface SignatureInfo {
  signer_name: string;
  signer_designation: string | null;
  signature_data: string;
  stamp_url: string | null;
  signed_at: string;
}

import { ClientAcceptanceForm } from '@/components/signing/ClientAcceptanceForm';
import leadzapLogo from '@/assets/leadzap-logo.png';
import { FormalQuotation } from '@/components/proposal/FormalQuotation';

// Import proposal display components
import { ProposalHeader } from '@/components/proposal/ProposalHeader';
import { PushPullFramework } from '@/components/proposal/PushPullFramework';
import { StrategicProcess } from '@/components/proposal/StrategicProcess';
import { PlatformBreakdown } from '@/components/proposal/PlatformBreakdown';
import { MarketResearchSection } from '@/components/proposal/MarketResearchSection';
import { PaymentSchedule } from '@/components/proposal/PaymentSchedule';
import { TermsAndConditions } from '@/components/proposal/TermsAndConditions';
import {
  ExecutiveSummary,
  BusinessContext,
  StrategyPositioning,
  RecommendedPackage,
  BudgetRecommendation,
  ImplementationTimeline,
  KPIReporting,
} from '@/components/proposal/ProposalSections';
import { Helmet } from 'react-helmet-async';

type ShareStatus = 'loading' | 'valid' | 'expired' | 'signed' | 'not_found';

const SignProposal = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ShareStatus>('loading');
  const [shareId, setShareId] = useState<string | null>(null);
  const [quotationNumber, setQuotationNumber] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [docHash, setDocHash] = useState<string | null>(null);
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [signatureInfo, setSignatureInfo] = useState<SignatureInfo | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!token) {
        setStatus('not_found');
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

        if (resp.status === 404) { setStatus('not_found'); return; }
        if (!resp.ok) { setStatus('not_found'); return; }
        const { share, signature } = await resp.json();
        if (!share) { setStatus('not_found'); return; }

        setQuotationNumber(share.quotation_number || null);
        setCustomerId(share.customer_id || null);
        setDocHash(share.doc_hash || null);

        if (share.is_signed) {
          if (signature) setSignatureInfo(signature);
          setData(share.proposal_data as unknown as ProposalData);
          setStatus('signed');
          return;
        }

        if (share.expires_at && new Date(share.expires_at) < new Date()) {
          setStatus('expired');
          return;
        }

        setShareId(share.id);
        setData(share.proposal_data as unknown as ProposalData);
        setStatus('valid');
      } catch {
        setStatus('not_found');
      }
    };

    fetchProposal();
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="font-display text-2xl font-bold text-foreground">Proposal Not Found</h1>
          <p className="text-muted-foreground">
            This proposal link is invalid or has been removed. Please contact the sender for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <Clock className="h-16 w-16 text-amber-500 mx-auto" />
          <h1 className="font-display text-2xl font-bold text-foreground">Proposal Expired</h1>
          <p className="text-muted-foreground">
            This proposal link has expired. Please contact the sender for a new quotation.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'signed') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur px-4 py-3">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={leadzapLogo} alt="Leadzap" className="h-8" />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground">Signed Quotation</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Success Banner */}
          <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-6 mb-8 flex items-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-400 flex-shrink-0" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Quotation Accepted</h1>
              <p className="text-muted-foreground">
                This quotation was signed by {signatureInfo?.signer_name || 'Client'} on{' '}
                {signatureInfo?.signed_at ? formatDate(signatureInfo.signed_at) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Signature Details Card */}
          <div className="rounded-3xl bg-card p-8 shadow-card space-y-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Acceptance Details</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Client Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Signed By</p>
                  <p className="font-semibold text-foreground text-lg">{signatureInfo?.signer_name || 'N/A'}</p>
                </div>
                {signatureInfo?.signer_designation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="text-foreground">{signatureInfo.signer_designation}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date Signed</p>
                  <p className="text-foreground">
                    {signatureInfo?.signed_at ? new Date(signatureInfo.signed_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Signature & Stamp */}
              <div className="space-y-4">
                {signatureInfo?.signature_data && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Signature</p>
                    <div className="rounded-lg border border-border bg-white p-2 inline-block">
                      <img
                        src={signatureInfo.signature_data}
                        alt="Client Signature"
                        className="max-h-24 object-contain"
                      />
                    </div>
                  </div>
                )}
                {signatureInfo?.stamp_url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Company Stamp</p>
                    <div className="rounded-lg border border-border bg-white p-2 inline-block">
                      <img
                        src={signatureInfo.stamp_url}
                        alt="Company Stamp"
                        className="max-h-24 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Proposal Summary */}
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Quotation Summary</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Client</p>
                  <p className="font-semibold text-foreground">{data.clientName || 'N/A'}</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Package</p>
                  <p className="font-semibold text-foreground">{packageInfo.name}</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</p>
                  <p className="font-semibold text-foreground">{formatCurrency(data.totalContractValue || packageInfo.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAcceptClick = () => {
    document.getElementById('client-acceptance-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <><Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur px-4 py-3">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={leadzapLogo} alt="Leadzap" className="h-8" />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground">Quotation for {data.clientName}</span>
            </div>
            <Button
              onClick={handleAcceptClick}
              className="accent-gradient text-accent-foreground font-semibold"
            >
              Accept & Sign
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="space-y-16 rounded-3xl bg-card p-8 shadow-card md:p-16">
            <ProposalHeader data={data} formatDate={formatDate} />
            <ExecutiveSummary data={data} formatDate={formatDate} />
            <BusinessContext data={data} formatCurrency={formatCurrency} />

            <div className="border-t border-border pt-16">
              <PushPullFramework />
            </div>

            <div className="border-t border-border pt-16">
              <StrategicProcess />
            </div>

            {data.marketResearch && (
              <div className="border-t border-border pt-16">
                <MarketResearchSection data={data} />
              </div>
            )}

            <div className="border-t border-border pt-16">
              <StrategyPositioning data={data} />
            </div>

            {(data.selectedPackage === 'social' || data.selectedPackage === 'both') && data.selectedPlatforms?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PlatformBreakdown data={data} formatCurrency={formatCurrency} />
              </div>
            )}

            <div className="border-t border-border pt-16">
              <RecommendedPackage packageInfo={packageInfo} formatCurrency={formatCurrency} />
            </div>

            {data.paymentSchedule?.length > 0 && (
              <div className="border-t border-border pt-16">
                <PaymentSchedule data={data} formatCurrency={formatCurrency} formatDate={formatDate} />
              </div>
            )}

            <div className="border-t border-border pt-16">
              <BudgetRecommendation data={data} formatCurrency={formatCurrency} />
            </div>

            <div className="border-t border-border pt-16">
              <ImplementationTimeline />
            </div>

            <div className="border-t border-border pt-16">
              <KPIReporting data={data} />
            </div>

            <div className="border-t border-border pt-16">
              <TermsAndConditions contractMonths={data.contractMonths} />
            </div>

            {/* Formal Legal Quotation */}
            <div className="border-t border-border pt-16">
              <FormalQuotation
                data={data}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                quotationNumber={quotationNumber}
                customerId={customerId}
                docHash={docHash} />
            </div>

            {/* Inline Acceptance Section */}
            <div id="client-acceptance-form" className="border-t border-border pt-16">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Accept Quotation
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Happy with this proposal? Fill in your details and sign below to confirm your acceptance.
                  </p>
                </div>
                <ClientAcceptanceForm
                  token={token!}
                  clientName={data.clientName}
                  onSuccess={(sigInfo) => {
                    setSignatureInfo(sigInfo);
                    setStatus('signed');
                  }} />
              </div>
            </div>
          </div>
        </div>
      </div></>
  );
};

export default SignProposal;