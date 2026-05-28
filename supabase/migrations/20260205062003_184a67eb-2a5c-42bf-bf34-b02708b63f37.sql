-- Add delete policy for proposal_shares (for signed proposals)
CREATE POLICY "Users can delete own shares" 
ON public.proposal_shares 
FOR DELETE 
USING (
  (created_by = auth.uid()) OR 
  (EXISTS ( 
    SELECT 1 FROM proposals 
    WHERE proposals.id = proposal_shares.proposal_id 
    AND proposals.user_id = auth.uid()
  ))
);

-- Also add delete policy for proposal_signatures when share is deleted
CREATE POLICY "Users can delete signatures for own shares" 
ON public.proposal_signatures 
FOR DELETE 
USING (
  EXISTS ( 
    SELECT 1 FROM proposal_shares ps
    LEFT JOIN proposals p ON ps.proposal_id = p.id
    WHERE ps.id = proposal_signatures.share_id 
    AND (ps.created_by = auth.uid() OR p.user_id = auth.uid())
  )
);