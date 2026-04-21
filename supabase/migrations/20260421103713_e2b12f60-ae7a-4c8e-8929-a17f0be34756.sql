-- Create dedicated private bucket for exam image answers
INSERT INTO storage.buckets (id, name, public)
VALUES ('exam-answer-images', 'exam-answer-images', false)
ON CONFLICT (id) DO NOTHING;

-- Anyone (including anonymous exam takers) can upload to a randomly-named path
CREATE POLICY "Anyone can upload exam answer images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'exam-answer-images');

-- Admins can read every image for grading and audit
CREATE POLICY "Admins can read all exam answer images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'exam-answer-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete stale images
CREATE POLICY "Admins can delete exam answer images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'exam-answer-images'
  AND public.has_role(auth.uid(), 'admin')
);