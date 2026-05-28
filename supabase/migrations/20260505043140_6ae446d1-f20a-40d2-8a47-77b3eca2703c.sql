ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS client_id uuid;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS client_id uuid;
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);

CREATE POLICY "Clients view own invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = invoices.client_id AND c.auth_user_id = auth.uid()));
