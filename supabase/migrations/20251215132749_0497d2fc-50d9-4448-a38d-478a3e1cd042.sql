-- Fix security issue 1: student_submissions email exposure - require authentication
DROP POLICY IF EXISTS "Students can view own submissions by email" ON public.student_submissions;

CREATE POLICY "Students can view own submissions by authenticated email" 
ON public.student_submissions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  student_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Fix security issue 2: admin_sessions weak protection - require admin role
DROP POLICY IF EXISTS "Can create new sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Can only view valid sessions" ON public.admin_sessions;

CREATE POLICY "Only admins can create sessions" 
ON public.admin_sessions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can view valid sessions" 
ON public.admin_sessions 
FOR SELECT 
USING (
  expires_at > now() AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can delete sessions" 
ON public.admin_sessions 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);