-- Enable realtime for student_submissions table
ALTER TABLE public.student_submissions REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_submissions;

-- Enable realtime for student_feedback table
ALTER TABLE public.student_feedback REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_feedback;