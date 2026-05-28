-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Users can create shares for own proposals" ON public.proposal_shares;

-- Create a more permissive insert policy for authenticated users
-- They can create shares either for their own proposals or standalone shares (null proposal_id)
CREATE POLICY "Authenticated users can create shares"
ON public.proposal_shares
FOR INSERT
TO authenticated
WITH CHECK (
  proposal_id IS NULL OR
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Also update the select policy for authenticated users to include shares they created
DROP POLICY IF EXISTS "Users can view own shares" ON public.proposal_shares;
CREATE POLICY "Users can view own shares"
ON public.proposal_shares
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Update the update policy similarly
DROP POLICY IF EXISTS "Users can update own shares" ON public.proposal_shares;
CREATE POLICY "Users can update own shares"
ON public.proposal_shares
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.proposals 
    WHERE id = proposal_id AND user_id = auth.uid()
  )
);

-- Allow anon users to update is_signed status (for client signing)
CREATE POLICY "Anyone can update signing status"
ON public.proposal_shares
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);