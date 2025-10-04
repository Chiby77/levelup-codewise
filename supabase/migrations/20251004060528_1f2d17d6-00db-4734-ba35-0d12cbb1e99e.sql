-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on exams table
DROP POLICY IF EXISTS "Anyone can create exams" ON public.exams;
DROP POLICY IF EXISTS "Anyone can update exams" ON public.exams;
DROP POLICY IF EXISTS "Anyone can delete exams" ON public.exams;
DROP POLICY IF EXISTS "Anyone can view active exams" ON public.exams;

-- New secure policies for exams table
CREATE POLICY "Anyone can view active exams"
  ON public.exams
  FOR SELECT
  USING (status = 'active'::exam_status);

CREATE POLICY "Admins can view all exams"
  ON public.exams
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create exams"
  ON public.exams
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update exams"
  ON public.exams
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete exams"
  ON public.exams
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on questions table
DROP POLICY IF EXISTS "Anyone can create questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can update questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can view questions for active exams" ON public.questions;

-- New secure policies for questions table
CREATE POLICY "Anyone can view questions for active exams"
  ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exams
      WHERE exams.id = questions.exam_id
        AND exams.status = 'active'::exam_status
    )
  );

CREATE POLICY "Admins can view all questions"
  ON public.questions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create questions"
  ON public.questions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
  ON public.questions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
  ON public.questions
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on student_submissions table
DROP POLICY IF EXISTS "Anyone can submit answers" ON public.student_submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Anyone can delete submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Anyone can view all submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Anyone can view their own submissions" ON public.student_submissions;

-- New secure policies for student_submissions table
CREATE POLICY "Anyone can submit answers for active exams"
  ON public.student_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exams
      WHERE exams.id = exam_id
        AND exams.status = 'active'::exam_status
    )
  );

CREATE POLICY "Students can view own submissions by email"
  ON public.student_submissions
  FOR SELECT
  USING (student_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Admins can view all submissions"
  ON public.student_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
  ON public.student_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions"
  ON public.student_submissions
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing policies on user_interactions table
DROP POLICY IF EXISTS "Anyone can insert interactions" ON public.user_interactions;
DROP POLICY IF EXISTS "Anyone can view interactions" ON public.user_interactions;

-- New secure policies for user_interactions (session-based privacy)
CREATE POLICY "Anyone can insert their own interactions"
  ON public.user_interactions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own session interactions"
  ON public.user_interactions
  FOR SELECT
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "Admins can view all interactions"
  ON public.user_interactions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing policies on learned_responses table
DROP POLICY IF EXISTS "Anyone can view learned responses" ON public.learned_responses;
DROP POLICY IF EXISTS "System can manage learned responses" ON public.learned_responses;

-- New secure policies for learned_responses (admin-only)
CREATE POLICY "Admins can view learned responses"
  ON public.learned_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage learned responses"
  ON public.learned_responses
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));