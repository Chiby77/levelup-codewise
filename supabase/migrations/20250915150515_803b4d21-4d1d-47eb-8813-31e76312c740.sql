-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Add grading status tracking
ALTER TABLE public.student_submissions ADD COLUMN IF NOT EXISTS grading_requested_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.student_submissions ADD COLUMN IF NOT EXISTS grading_status TEXT DEFAULT 'pending' CHECK (grading_status IN ('pending', 'processing', 'completed', 'failed'));

-- Create index for better performance on grading queries
CREATE INDEX IF NOT EXISTS idx_student_submissions_grading_status ON public.student_submissions(grading_status);
CREATE INDEX IF NOT EXISTS idx_student_submissions_graded ON public.student_submissions(graded);

-- Create function to request grading
CREATE OR REPLACE FUNCTION public.request_grading(submission_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.student_submissions 
  SET grading_requested_at = now(),
      grading_status = 'processing'
  WHERE id = submission_uuid 
    AND graded = false;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;