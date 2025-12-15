-- Allow users to insert feedback even if user_id is null (anonymous feedback)
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.student_feedback;

CREATE POLICY "Anyone can insert feedback" 
ON public.student_feedback 
FOR INSERT 
WITH CHECK (true);

-- Update the select policy to allow anyone to view their own feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.student_feedback;

CREATE POLICY "Users can view own feedback" 
ON public.student_feedback 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);