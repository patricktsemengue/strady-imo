CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'uploads' );

CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'uploads' );