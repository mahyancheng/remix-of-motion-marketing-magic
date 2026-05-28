CREATE TABLE public.client_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  label TEXT NOT NULL,
  credential_value TEXT NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view all credentials"
ON public.client_credentials FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients view own credentials"
ON public.client_credentials FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_credentials.client_id AND c.auth_user_id = auth.uid()));

CREATE POLICY "Team/admin insert credentials"
ON public.client_credentials FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin update credentials"
ON public.client_credentials FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin delete credentials"
ON public.client_credentials FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_client_credentials_updated_at
BEFORE UPDATE ON public.client_credentials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_client_credentials_client_id ON public.client_credentials(client_id);