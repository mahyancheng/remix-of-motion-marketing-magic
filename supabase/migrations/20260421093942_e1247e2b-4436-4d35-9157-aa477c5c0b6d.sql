INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');

CREATE POLICY "Team/admin can upload report images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'report-images' AND (public.has_role(auth.uid(),'team') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "Team/admin can update report images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'report-images' AND (public.has_role(auth.uid(),'team') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "Team/admin can delete report images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'report-images' AND (public.has_role(auth.uid(),'team') OR public.has_role(auth.uid(),'admin')));