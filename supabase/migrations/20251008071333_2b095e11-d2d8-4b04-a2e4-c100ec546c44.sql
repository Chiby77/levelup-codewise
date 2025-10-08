-- Fix student_submissions RLS to require authentication and prevent email harvesting
DROP POLICY IF EXISTS "Anyone can submit answers for active exams" ON student_submissions;

CREATE POLICY "Authenticated users can submit exams"
ON student_submissions
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM exams 
    WHERE id = student_submissions.exam_id 
    AND status = 'active'
  )
);

-- Update user_interactions to require authentication
DROP POLICY IF EXISTS "Anyone can insert their own interactions" ON user_interactions;

CREATE POLICY "Authenticated users can insert interactions"
ON user_interactions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);