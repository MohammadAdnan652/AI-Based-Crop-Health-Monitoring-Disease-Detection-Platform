
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

DROP POLICY IF EXISTS "Anyone can view crop images" ON storage.objects;
CREATE POLICY "Public can view individual crop images" ON storage.objects
  FOR SELECT USING (bucket_id = 'crop-images');
-- Listing not granted; only direct URL access via public bucket
