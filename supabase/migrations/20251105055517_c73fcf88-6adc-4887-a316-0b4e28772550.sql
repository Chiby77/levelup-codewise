-- Add difficulty level to exams
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard'));

-- Add programming_language column to questions if not exists (for VB support)
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS programming_language TEXT DEFAULT 'python';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_exams_difficulty ON public.exams(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_programming_language ON public.questions(programming_language);