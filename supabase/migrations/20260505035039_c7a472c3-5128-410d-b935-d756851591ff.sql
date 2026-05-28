
-- Add quotation numbering to proposals
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS quotation_number TEXT,
  ADD COLUMN IF NOT EXISTS customer_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS proposals_quotation_number_uq ON public.proposals(quotation_number) WHERE quotation_number IS NOT NULL;

-- Add quotation fields + audit to proposal_shares
ALTER TABLE public.proposal_shares
  ADD COLUMN IF NOT EXISTS quotation_number TEXT,
  ADD COLUMN IF NOT EXISTS customer_id TEXT,
  ADD COLUMN IF NOT EXISTS doc_hash TEXT,
  ADD COLUMN IF NOT EXISTS signed_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS signed_pdf_path TEXT,
  ADD COLUMN IF NOT EXISTS signed_ip TEXT;

-- Sequence for auto-numbering quotations per year stored in agency_settings as JSON counter
CREATE TABLE IF NOT EXISTS public.quotation_counters (
  year INT PRIMARY KEY,
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotation_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view counters" ON public.quotation_counters
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin update counters" ON public.quotation_counters
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin insert counters" ON public.quotation_counters
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Function to allocate next quotation number for a given year (atomic upsert)
CREATE OR REPLACE FUNCTION public.next_quotation_number(_year INT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INT;
BEGIN
  INSERT INTO public.quotation_counters(year, last_number)
  VALUES (_year, 1)
  ON CONFLICT (year) DO UPDATE SET last_number = quotation_counters.last_number + 1, updated_at = now()
  RETURNING last_number INTO next_num;
  RETURN 'Q-' || _year::text || '/' || lpad(next_num::text, 3, '0');
END;
$$;

-- Customer counter
CREATE TABLE IF NOT EXISTS public.customer_counter (
  id INT PRIMARY KEY DEFAULT 1,
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT customer_counter_singleton CHECK (id = 1)
);

ALTER TABLE public.customer_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin manage customer counter sel" ON public.customer_counter
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Team/admin manage customer counter ins" ON public.customer_counter
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Team/admin manage customer counter upd" ON public.customer_counter
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.next_customer_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INT;
BEGIN
  INSERT INTO public.customer_counter(id, last_number)
  VALUES (1, 1)
  ON CONFLICT (id) DO UPDATE SET last_number = customer_counter.last_number + 1, updated_at = now()
  RETURNING last_number INTO next_num;
  RETURN 'C-' || lpad(next_num::text, 3, '0');
END;
$$;

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  share_id UUID,
  proposal_id UUID,
  client_name TEXT,
  customer_id TEXT,
  quotation_number TEXT,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MYR',
  monthly_installment NUMERIC(14,2),
  installment_count INT,
  status TEXT NOT NULL DEFAULT 'issued',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_share ON public.invoices(share_id);
CREATE INDEX IF NOT EXISTS idx_invoices_proposal ON public.invoices(proposal_id);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin view invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin insert invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin update invoices" ON public.invoices
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team/admin delete invoices" ON public.invoices
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invoice numbering
CREATE TABLE IF NOT EXISTS public.invoice_counters (
  year INT PRIMARY KEY,
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team/admin sel inv counters" ON public.invoice_counters
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Team/admin ins inv counters" ON public.invoice_counters
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Team/admin upd inv counters" ON public.invoice_counters
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.next_invoice_number(_year INT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INT;
BEGIN
  INSERT INTO public.invoice_counters(year, last_number)
  VALUES (_year, 1)
  ON CONFLICT (year) DO UPDATE SET last_number = invoice_counters.last_number + 1, updated_at = now()
  RETURNING last_number INTO next_num;
  RETURN 'INV-' || _year::text || '/' || lpad(next_num::text, 4, '0');
END;
$$;

-- Private bucket for signed quotation PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('signed-quotations', 'signed-quotations', false)
ON CONFLICT (id) DO NOTHING;

-- Only team/admin can read signed PDFs
CREATE POLICY "Team/admin read signed quotations"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'signed-quotations' AND (has_role(auth.uid(), 'team'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));
