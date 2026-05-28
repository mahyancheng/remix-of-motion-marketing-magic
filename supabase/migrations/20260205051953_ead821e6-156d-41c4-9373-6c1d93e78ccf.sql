-- Make proposal_id nullable for standalone shares (generated from session data)
ALTER TABLE public.proposal_shares ALTER COLUMN proposal_id DROP NOT NULL;

-- Update the foreign key to allow null
ALTER TABLE public.proposal_shares DROP CONSTRAINT proposal_shares_proposal_id_fkey;
ALTER TABLE public.proposal_shares ADD CONSTRAINT proposal_shares_proposal_id_fkey 
  FOREIGN KEY (proposal_id) REFERENCES public.proposals(id) ON DELETE CASCADE;