-- Drop the problematic policy that references auth.users
DROP POLICY IF EXISTS "Students can view own submissions by authenticated email" ON public.student_submissions;

-- Recreate the policy using auth.jwt() instead of querying auth.users
CREATE POLICY "Students can view own submissions by authenticated email" 
ON public.student_submissions 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) 
  AND (student_email = (auth.jwt() ->> 'email'))
);