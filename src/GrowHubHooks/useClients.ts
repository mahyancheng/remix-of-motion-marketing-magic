import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  website: string | null;
  notes: string | null;
  auth_user_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MetricEntry {
  id: string;
  client_id: string;
  provider: string;
  metric_label: string;
  metric_value: number | null;
  metric_text: string | null;
  period_start: string | null;
  period_end: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const PROVIDERS = [
  { value: 'google_analytics', label: 'Google Analytics' },
  { value: 'google_search_console', label: 'Google Search Console' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'meta_ads', label: 'Meta Ads' },
  { value: 'meta_organic', label: 'Meta (Facebook/Instagram)' },
  { value: 'other', label: 'Other' },
];

export interface Credential {
  id: string;
  client_id: string;
  provider: string;
  label: string;
  credential_value: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [metrics, setMetrics] = useState<MetricEntry[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    if (error) {
      toast.error('Failed to load clients');
      return;
    }
    setClients(data || []);
  }, []);

  const fetchMetrics = useCallback(async (clientId?: string) => {
    // Range high enough to cover ~3 years of daily multi-metric data and bypass the 1000-row default.
    let query = supabase.from('client_metrics_entries').select('*').order('period_end', { ascending: false, nullsFirst: false }).range(0, 49999);
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) {
      toast.error('Failed to load metrics');
      return;
    }
    setMetrics(data || []);
  }, []);

  const fetchCredentials = useCallback(async (clientId?: string) => {
    let query = supabase.from('client_credentials').select('*').order('created_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) {
      // Clients might not have access — silently ignore
      return;
    }
    setCredentials(data || []);
  }, []);

  useEffect(() => {
    Promise.all([fetchClients(), fetchMetrics(), fetchCredentials()]).finally(() => setIsLoading(false));
  }, [fetchClients, fetchMetrics, fetchCredentials]);

  const createClient = async (input: Partial<Client>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('clients').insert({
      name: input.name!,
      website: input.website || null,
      notes: input.notes || null,
      auth_user_id: input.auth_user_id || null,
      created_by: user.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Client added');
    await fetchClients();
  };

  const updateClient = async (id: string, patch: Partial<Client>) => {
    const { error } = await supabase.from('clients').update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Client updated');
    await fetchClients();
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Client deleted');
    await fetchClients();
    await fetchMetrics();
    await fetchCredentials();
  };

  const addMetric = async (input: Omit<MetricEntry, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('client_metrics_entries').insert({
      ...input,
      created_by: user.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Metric added');
    await fetchMetrics();
  };

  const updateMetric = async (id: string, patch: Partial<MetricEntry>) => {
    const { error } = await supabase.from('client_metrics_entries').update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    await fetchMetrics();
  };

  const deleteMetric = async (id: string) => {
    const { error } = await supabase.from('client_metrics_entries').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    await fetchMetrics();
  };

  const addCredential = async (input: Omit<Credential, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('client_credentials').insert({
      ...input,
      created_by: user.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Credential saved');
    await fetchCredentials();
  };

  const updateCredential = async (id: string, patch: Partial<Credential>) => {
    const { error } = await supabase.from('client_credentials').update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Credential updated');
    await fetchCredentials();
  };

  const deleteCredential = async (id: string) => {
    const { error } = await supabase.from('client_credentials').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    await fetchCredentials();
  };

  return {
    clients, metrics, credentials, isLoading,
    fetchClients, fetchMetrics, fetchCredentials,
    createClient, updateClient, deleteClient,
    addMetric, updateMetric, deleteMetric,
    addCredential, updateCredential, deleteCredential,
  };
}
