
-- Create storage bucket for POW images
INSERT INTO storage.buckets (id, name, public) VALUES ('pow-attachments', 'pow-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload POW images
CREATE POLICY "Authenticated users can upload POW images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pow-attachments');

-- Allow public viewing of POW images
CREATE POLICY "POW images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'pow-attachments');

-- Allow authenticated users to delete their own POW images
CREATE POLICY "Authenticated users can delete POW images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pow-attachments');
