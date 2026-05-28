import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProposalData, ChatMessage } from '@/types/proposal';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { Json } from '@/integrations/supabase/types';

export interface SavedProposal {
  id: string;
  title: string;
  client_name: string | null;
  data: ProposalData;
  created_at: string;
  updated_at: string;
}

export interface LoadedProposalData {
  proposalData: ProposalData;
  chatMessages: ChatMessage[];
}

export function useProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProposals = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setProposals(
        (data || []).map((p) => ({
          ...p,
          data: p.data as unknown as ProposalData,
        }))
      );
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load proposals',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveProposal = useCallback(async (
    proposalData: ProposalData,
    existingId?: string,
    chatMessages?: ChatMessage[]
  ): Promise<string | null> => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'Please sign in to save proposals',
      });
      return null;
    }

    setIsSaving(true);
    try {
      const title = proposalData.clientName 
        ? `Proposal for ${proposalData.clientName}`
        : 'Untitled Proposal';

      // Store both proposal data and chat messages
      const dataToSave = {
        ...proposalData,
        _chatMessages: chatMessages || [],
      };

      if (existingId) {
        const { error } = await supabase
          .from('proposals')
          .update({
            title,
            client_name: proposalData.clientName || null,
            data: dataToSave as unknown as Json,
          })
          .eq('id', existingId);

        if (error) throw error;

        toast({
          title: 'Proposal saved',
          description: 'Your changes have been saved.',
        });
        return existingId;
      } else {
        const { data, error } = await supabase
          .from('proposals')
          .insert({
            user_id: user.id,
            title,
            client_name: proposalData.clientName || null,
            data: dataToSave as unknown as Json,
          })
          .select('id')
          .single();

        if (error) throw error;

        toast({
          title: 'Proposal created',
          description: 'Your proposal has been saved.',
        });
        return data.id;
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: 'Could not save the proposal. Please try again.',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const loadProposal = useCallback(async (id: string): Promise<LoadedProposalData | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('data')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const savedData = data.data as Record<string, unknown>;
      
      // Extract chat messages from saved data
      const chatMessages = (savedData._chatMessages as ChatMessage[]) || [];
      
      // Remove internal field before returning proposal data
      const { _chatMessages, ...proposalData } = savedData;
      
      return {
        proposalData: proposalData as unknown as ProposalData,
        chatMessages,
      };
    } catch (error) {
      console.error('Error loading proposal:', error);
      toast({
        variant: 'destructive',
        title: 'Load failed',
        description: 'Could not load the proposal.',
      });
      return null;
    }
  }, [user]);

  const deleteProposal = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProposals((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: 'Proposal deleted',
        description: 'The proposal has been removed.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Could not delete the proposal.',
      });
      return false;
    }
  }, [user]);

  return {
    proposals,
    isLoading,
    isSaving,
    fetchProposals,
    saveProposal,
    loadProposal,
    deleteProposal,
  };
}
