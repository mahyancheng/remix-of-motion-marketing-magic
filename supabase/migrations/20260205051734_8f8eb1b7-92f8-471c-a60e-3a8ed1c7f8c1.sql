-- Create proposal shares table for shareable links
CREATE TABLE public.proposal_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  proposal_data JSONB NOT NULL,
  client_name TEXT,
  client_email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_signed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create proposal signatures table for storing client acceptance
CREATE TABLE public.proposal_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID REFERENCES public.proposal_shares(id) ON DELETE CASCADE NOT NULL UNIQUE,
  signature_data TEXT NOT NULL, -- Base64 signature image
  stamp_url TEXT, -- URL to uploaded company stamp
  signer_name TEXT NOT NULL,
  signer_designation TEXT,
  signer_email TEXT,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.proposal_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_signatures ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposal_shares
-- Authenticated users can create shares for their own proposals
CREATE POLICY "Users can create shares for own proposals"
ON public.proposal_shares
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Authenticated users can view their own shares
CREATE POLICY "Users can view own shares"
ON public.proposal_shares
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Authenticated users can update their own shares
CREATE POLICY "Users can update own shares"
ON public.proposal_shares
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Anonymous users can view shares by token (for public signing page)
CREATE POLICY "Anyone can view shares by token"
ON public.proposal_shares
FOR SELECT
TO anon
USING (true);

-- RLS policies for proposal_signatures
-- Authenticated users can view signatures for their shares
CREATE POLICY "Users can view signatures for own shares"
ON public.proposal_signatures
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.proposal_shares ps
    JOIN public.proposals p ON ps.proposal_id = p.id
    WHERE ps.id = share_id AND p.user_id = auth.uid()
  )
);

-- Anyone can insert signatures (clients signing)
CREATE POLICY "Anyone can insert signatures"
ON public.proposal_signatures
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create storage bucket for company stamps
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-stamps', 'company-stamps', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public read access
CREATE POLICY "Company stamps are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-stamps');

-- Anyone can upload stamps (for client signing)
CREATE POLICY "Anyone can upload company stamps"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-stamps');

-- Create index for faster token lookups
CREATE INDEX idx_proposal_shares_token ON public.proposal_shares(token);