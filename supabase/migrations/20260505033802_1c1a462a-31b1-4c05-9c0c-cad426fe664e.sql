-- Lock down proposal_shares: remove anon access
DROP POLICY IF EXISTS "Anyone can view shares by token" ON public.proposal_shares;
DROP POLICY IF EXISTS "Anyone can update signing status" ON public.proposal_shares;

-- Lock down proposal_signatures: remove anon access
DROP POLICY IF EXISTS "Anyone can insert signatures" ON public.proposal_signatures;
DROP POLICY IF EXISTS "Anyone can view signatures via share token" ON public.proposal_signatures;

-- Allow share creators to view signatures of their own shares (covers proposals without proposal_id)
DROP POLICY IF EXISTS "Users can view signatures for own shares" ON public.proposal_signatures;
CREATE POLICY "Users can view signatures for own shares"
ON public.proposal_signatures FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.proposal_shares ps
    LEFT JOIN public.proposals p ON ps.proposal_id = p.id
    WHERE ps.id = proposal_signatures.share_id
      AND (ps.created_by = auth.uid() OR p.user_id = auth.uid())
  )
);

-- Lock down company-stamps storage: remove anon upload, restrict by mime type via bucket config
DROP POLICY IF EXISTS "Anyone can upload company stamps" ON storage.objects;

-- Restrict bucket: allowed mime types + size limit (5MB). Keep public read so signed stamp URLs work.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
    file_size_limit = 5242880
WHERE id = 'company-stamps';
