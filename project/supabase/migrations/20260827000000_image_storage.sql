-- Public image bucket used by products, banners and store photos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public_read_fenun_images" ON storage.objects;
CREATE POLICY "public_read_fenun_images" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_upload_fenun_images" ON storage.objects;
CREATE POLICY "authenticated_upload_fenun_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_update_fenun_images" ON storage.objects;
CREATE POLICY "authenticated_update_fenun_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "authenticated_delete_fenun_images" ON storage.objects;
CREATE POLICY "authenticated_delete_fenun_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images');
