import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData } from '@/types/proposal';
import { toast } from '@/hooks/use-toast';

export interface ShareInfo {
  url: string;
  token: string;
  quotationNumber: string;
  customerId: string;
  docHash: string;
}

export const useProposalShare = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null);

  const generateShareLink = async (
    proposalData: ProposalData,
    proposalId?: string,
    overrides?: { quotationNumber?: string; customerId?: string },
  ) => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-proposal-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'create',
          proposal_data: proposalData,
          proposal_id: proposalId || null,
          client_name: proposalData.clientName,
          quotation_number_override: overrides?.quotationNumber,
          customer_id_override: overrides?.customerId,
        }),
      });

      const j = await resp.json();
      if (!resp.ok) throw new Error(j?.error || 'Failed to create share');

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/sign/${j.token}`;
      const info: ShareInfo = {
        url,
        token: j.token,
        quotationNumber: j.quotation_number,
        customerId: j.customer_id,
        docHash: j.doc_hash,
      };
      setShareInfo(info);
      try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }

      toast({
        title: 'Quotation Issued',
        description: `${j.quotation_number} — link copied to clipboard.`,
      });
      return info;
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Link',
        description: error instanceof Error ? error.message : 'Could not create share link.',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = async () => {
    if (shareInfo?.url) {
      await navigator.clipboard.writeText(shareInfo.url);
      toast({ title: 'Copied!', description: 'Share link copied to clipboard.' });
    }
  };

  return {
    isGenerating,
    shareInfo,
    shareUrl: shareInfo?.url ?? null,
    generateShareLink,
    copyShareLink,
  };
};
