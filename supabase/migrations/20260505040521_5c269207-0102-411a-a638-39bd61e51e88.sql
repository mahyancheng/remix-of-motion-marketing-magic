
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  customer_id TEXT,
  proposal_id UUID,
  share_id UUID,
  quotation_number TEXT,
  currency TEXT NOT NULL DEFAULT 'MYR',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  monthly_installment NUMERIC NOT NULL DEFAULT 0,
  installment_count INT NOT NULL DEFAULT 12,
  installments_issued INT NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view contracts" ON public.contracts
  FOR SELECT TO authenticated USING (has_role(auth.uid(),'team'::app_role) OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Team/admin insert contracts" ON public.contracts
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'team'::app_role) OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Team/admin update contracts" ON public.contracts
  FOR UPDATE TO authenticated USING (has_role(auth.uid(),'team'::app_role) OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Team/admin delete contracts" ON public.contracts
  FOR DELETE TO authenticated USING (has_role(auth.uid(),'team'::app_role) OR has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER contracts_set_updated_at BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contracts_next_invoice_date ON public.contracts(next_invoice_date) WHERE status = 'active';
