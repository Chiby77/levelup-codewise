-- =========================================================================
-- 1. EXAM QUESTIONS: hide correct_answer / sample_code from students
-- =========================================================================

-- Drop the over-permissive policy that exposed correct answers
DROP POLICY IF EXISTS "Anyone can view questions for active exams" ON public.questions;

-- Create a safe public view for students (no correct_answer, no sample_code's hidden test data)
-- sample_code is the starter/scaffold code shown to students — it IS safe to expose.
-- correct_answer is the only sensitive field that must be hidden.
CREATE OR REPLACE VIEW public.questions_public
WITH (security_invoker = on) AS
SELECT
  q.id,
  q.exam_id,
  q.question_text,
  q.question_type,
  q.options,
  q.sample_code,
  q.marks,
  q.order_number,
  q.programming_language,
  q.created_at
FROM public.questions q
WHERE EXISTS (
  SELECT 1 FROM public.exams e
  WHERE e.id = q.exam_id
    AND e.status = 'active'
);

GRANT SELECT ON public.questions_public TO anon, authenticated;

-- Admins keep direct access to the questions table (existing admin policies remain)

-- =========================================================================
-- 2. USER_INTERACTIONS: add user_id and fix RLS
-- =========================================================================

-- Add user_id column tying each interaction to its owner
ALTER TABLE public.user_interactions
  ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id
  ON public.user_interactions(user_id);

-- Drop the broken session-id-based SELECT policy
DROP POLICY IF EXISTS "Users can view own session interactions" ON public.user_interactions;
DROP POLICY IF EXISTS "Authenticated users can insert interactions" ON public.user_interactions;

-- Replace with proper auth.uid() based policies
CREATE POLICY "Users can view own interactions"
  ON public.user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON public.user_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Existing "Admins can view all interactions" policy is retained.

-- =========================================================================
-- 3. ENROLLMENT_PAYMENT_STATUS view: remove SECURITY DEFINER behavior
-- =========================================================================

DROP VIEW IF EXISTS public.enrollment_payment_status;

CREATE VIEW public.enrollment_payment_status
WITH (security_invoker = on) AS
SELECT
  ce.id,
  ce.student_email,
  ce.student_id,
  ce.class_id,
  c.name AS class_name,
  c.subject,
  ce.payment_status,
  ce.payment_due_date,
  ce.last_payment_date,
  ce.payment_amount,
  ce.is_active,
  ce.auto_suspended,
  ce.suspension_reason,
  ce.enrolled_at,
  p.full_name AS student_name
FROM public.class_enrollments ce
LEFT JOIN public.classes c ON ce.class_id = c.id
LEFT JOIN public.profiles p ON ce.student_id = p.id;

GRANT SELECT ON public.enrollment_payment_status TO authenticated;