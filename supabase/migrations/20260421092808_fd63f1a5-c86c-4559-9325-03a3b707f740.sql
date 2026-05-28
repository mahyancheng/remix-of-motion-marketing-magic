CREATE TABLE public.ai_insight_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  range_start DATE,
  range_end DATE,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_insight_reports_client ON public.ai_insight_reports(client_id, created_at DESC);

ALTER TABLE public.ai_insight_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view all reports"
ON public.ai_insight_reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients view own reports"
ON public.ai_insight_reports FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = ai_insight_reports.client_id AND c.auth_user_id = auth.uid()));

CREATE POLICY "Team/admin insert reports"
ON public.ai_insight_reports FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Team/admin delete reports"
ON public.ai_insight_reports FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'team') OR public.has_role(auth.uid(), 'admin'));