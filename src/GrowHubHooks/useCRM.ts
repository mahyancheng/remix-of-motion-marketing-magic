import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Proposal {
  id: string;
  title: string;
  client_name: string | null;
}

export interface CRMContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  type: string;
  notes: string | null;
  proposal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMDeal {
  id: string;
  contact_id: string | null;
  title: string;
  value: number;
  stage: string;
  expected_close_date: string | null;
  proposal_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contact?: CRMContact;
}

export interface CRMActivity {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  type: string;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export function useCRM() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProposals = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('proposals').select('id, title, client_name').order('updated_at', { ascending: false });
    setProposals(data || []);
  }, [user]);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else setContacts(data || []);
    setIsLoading(false);
  }, [user]);

  const fetchDeals = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('crm_deals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else setDeals(data || []);
  }, [user]);

  const fetchActivities = useCallback(async (contactId?: string) => {
    if (!user) return;
    let q = supabase.from('crm_activities').select('*').order('created_at', { ascending: false });
    if (contactId) q = q.eq('contact_id', contactId);
    const { data, error } = await q.limit(50);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else setActivities(data || []);
  }, [user]);

  const upsertContact = useCallback(async (contact: Partial<CRMContact> & { name: string }) => {
    if (!user) return null;
    const payload = { ...contact, user_id: user.id };
    if (contact.id) {
      const { data, error } = await supabase.from('crm_contacts').update(payload).eq('id', contact.id).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchContacts();
      return data;
    } else {
      const { data, error } = await supabase.from('crm_contacts').insert(payload).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchContacts();
      return data;
    }
  }, [user, fetchContacts]);

  const deleteContact = useCallback(async (id: string) => {
    const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    fetchContacts();
  }, [fetchContacts]);

  const upsertDeal = useCallback(async (deal: Partial<CRMDeal> & { title: string }) => {
    if (!user) return null;
    const payload = { ...deal, user_id: user.id };
    delete (payload as any).contact;
    if (deal.id) {
      const { data, error } = await supabase.from('crm_deals').update(payload).eq('id', deal.id).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchDeals();
      return data;
    } else {
      const { data, error } = await supabase.from('crm_deals').insert(payload).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchDeals();
      return data;
    }
  }, [user, fetchDeals]);

  const deleteDeal = useCallback(async (id: string) => {
    const { error } = await supabase.from('crm_deals').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    fetchDeals();
  }, [fetchDeals]);

  const addActivity = useCallback(async (activity: Omit<CRMActivity, 'id' | 'created_at'>) => {
    if (!user) return;
    const { error } = await supabase.from('crm_activities').insert({ ...activity, user_id: user.id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    fetchActivities(activity.contact_id || undefined);
  }, [user, fetchActivities]);

  useEffect(() => {
    if (user) { fetchContacts(); fetchDeals(); fetchActivities(); fetchProposals(); }
  }, [user, fetchContacts, fetchDeals, fetchActivities, fetchProposals]);

  // Listen for AI-triggered refresh events
  useEffect(() => {
    const handler = () => {
      if (user) { fetchContacts(); fetchDeals(); fetchActivities(); fetchProposals(); }
    };
    window.addEventListener('work-data-refresh', handler);
    return () => window.removeEventListener('work-data-refresh', handler);
  }, [user, fetchContacts, fetchDeals, fetchActivities, fetchProposals]);

  return {
    contacts, deals, activities, proposals, isLoading,
    fetchContacts, fetchDeals, fetchActivities,
    upsertContact, deleteContact,
    upsertDeal, deleteDeal,
    addActivity,
  };
}
