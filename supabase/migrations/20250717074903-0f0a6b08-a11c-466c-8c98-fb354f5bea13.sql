-- Create digital exams system database schema

-- Create exam categories enum
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'coding', 'flowchart', 'short_answer');
CREATE TYPE public.exam_status AS ENUM ('draft', 'active', 'completed', 'archived');

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL DEFAULT 'Computer Science',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 100,
  status exam_status NOT NULL DEFAULT 'draft',
  created_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB, -- For multiple choice options
  correct_answer TEXT, -- For multiple choice and short answers
  sample_code TEXT, -- For coding questions
  marks INTEGER NOT NULL DEFAULT 10,
  order_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student submissions table
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT,
  answers JSONB NOT NULL, -- Store all answers
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_taken_minutes INTEGER,
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  graded BOOLEAN DEFAULT false,
  grade_details JSONB -- Detailed grading information
);

-- Create admin sessions table for PIN authentication
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable Row Level Security
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no user authentication)
CREATE POLICY "Anyone can view active exams" ON public.exams
FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view questions for active exams" ON public.questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.exams 
    WHERE exams.id = questions.exam_id 
    AND exams.status = 'active'
  )
);

CREATE POLICY "Anyone can submit answers" ON public.student_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their own submissions" ON public.student_submissions
FOR SELECT USING (true);

-- Admin policies (will be handled by edge functions)
CREATE POLICY "Admins can do everything on exams" ON public.exams
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can do everything on questions" ON public.questions
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view all submissions" ON public.student_submissions
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin sessions are public" ON public.admin_sessions
FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exams_updated_at
BEFORE UPDATE ON public.exams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample exam for testing
INSERT INTO public.exams (title, description, duration_minutes, total_marks, status) 
VALUES (
  'Computer Science Fundamentals', 
  'Basic programming concepts and algorithms', 
  90, 
  100, 
  'active'
);

-- Insert sample questions
INSERT INTO public.questions (exam_id, question_text, question_type, options, correct_answer, marks, order_number)
SELECT 
  (SELECT id FROM public.exams WHERE title = 'Computer Science Fundamentals'),
  'What is the time complexity of binary search?',
  'multiple_choice',
  '["O(n)", "O(log n)", "O(n^2)", "O(1)"]'::jsonb,
  'O(log n)',
  10,
  1;

INSERT INTO public.questions (exam_id, question_text, question_type, sample_code, marks, order_number)
SELECT 
  (SELECT id FROM public.exams WHERE title = 'Computer Science Fundamentals'),
  'Write a Python function to find the factorial of a number using recursion.',
  'coding',
  'def factorial(n):\n    # Write your code here\n    pass',
  20,
  2;

INSERT INTO public.questions (exam_id, question_text, question_type, marks, order_number)
SELECT 
  (SELECT id FROM public.exams WHERE title = 'Computer Science Fundamentals'),
  'Draw a flowchart for finding the largest number in an array.',
  'flowchart',
  15,
  3;