-- Fix RLS policies to allow exam creation without admin authentication
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can do everything on exams" ON public.exams;
DROP POLICY IF EXISTS "Admins can do everything on questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.student_submissions;

-- Create permissive policies for exam creation and management
CREATE POLICY "Anyone can create exams"
  ON public.exams
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update exams"
  ON public.exams
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete exams"
  ON public.exams
  FOR DELETE
  USING (true);

-- Questions policies
CREATE POLICY "Anyone can create questions"
  ON public.questions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update questions"
  ON public.questions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete questions"
  ON public.questions
  FOR DELETE
  USING (true);

-- Submissions policies
CREATE POLICY "Anyone can view all submissions"
  ON public.student_submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update submissions"
  ON public.student_submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete submissions"
  ON public.student_submissions
  FOR DELETE
  USING (true);