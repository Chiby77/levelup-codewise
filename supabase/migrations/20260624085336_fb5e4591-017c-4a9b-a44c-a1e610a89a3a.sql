
CREATE TABLE IF NOT EXISTS public.grading_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.student_submissions(id) ON DELETE CASCADE,
  question_id TEXT,
  action TEXT NOT NULL, -- 'ai_grade' | 'admin_override' | 'regrade'
  previous_score NUMERIC,
  new_score NUMERIC,
  previous_feedback TEXT,
  new_feedback TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.grading_audit_log TO authenticated;
GRANT ALL ON public.grading_audit_log TO service_role;

ALTER TABLE public.grading_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all grading audit logs"
  ON public.grading_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert grading audit logs"
  ON public.grading_audit_log FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view audit logs for their submissions"
  ON public.grading_audit_log FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.student_submissions s
    WHERE s.id = grading_audit_log.submission_id
      AND s.student_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ));

CREATE INDEX IF NOT EXISTS idx_grading_audit_log_submission ON public.grading_audit_log(submission_id, created_at DESC);
