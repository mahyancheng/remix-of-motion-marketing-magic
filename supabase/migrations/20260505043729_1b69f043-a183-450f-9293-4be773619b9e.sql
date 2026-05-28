ALTER TABLE public.proposal_shares ADD COLUMN IF NOT EXISTS client_id uuid;
CREATE INDEX IF NOT EXISTS idx_proposal_shares_client_id ON public.proposal_shares(client_id);