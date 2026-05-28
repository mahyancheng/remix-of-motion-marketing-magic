
-- CLIENTS table: a client business managed by team/admin
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  notes TEXT,
  auth_user_id UUID UNIQUE, -- optional link to an auth.users login (the client's portal account)
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin can view all clients"
  ON public.clients FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view own linked record"
  ON public.clients FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Team/admin insert clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team/admin update clients"
  ON public.clients FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team/admin delete clients"
  ON public.clients FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CLIENT_METRICS_ENTRIES: manually entered metrics per client
CREATE TABLE public.client_metrics_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google_analytics' | 'google_search_console' | 'google_ads' | 'meta_ads' | 'meta_organic' | 'other'
  metric_label TEXT NOT NULL, -- e.g. "Sessions", "Clicks", "Ad Spend"
  metric_value NUMERIC,
  metric_text TEXT, -- for non-numeric notes like "top query: ..."
  period_start DATE,
  period_end DATE,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_metrics_client ON public.client_metrics_entries(client_id);
CREATE INDEX idx_metrics_provider ON public.client_metrics_entries(provider);

ALTER TABLE public.client_metrics_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view all metrics"
  ON public.client_metrics_entries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view own metrics"
  ON public.client_metrics_entries FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = client_metrics_entries.client_id AND c.auth_user_id = auth.uid()
  ));

CREATE POLICY "Team/admin insert metrics"
  ON public.client_metrics_entries FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team/admin update metrics"
  ON public.client_metrics_entries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team/admin delete metrics"
  ON public.client_metrics_entries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_metrics_updated_at
  BEFORE UPDATE ON public.client_metrics_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
