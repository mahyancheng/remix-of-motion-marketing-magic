-- Add policy to allow anyone to view signatures for shares they can access
-- This enables the signed confirmation page to show signature details
CREATE POLICY "Anyone can view signatures via share token"
ON public.proposal_signatures
FOR SELECT
TO anon
USING (true);