-- Add scheduling fields to exams table
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS start_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS end_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS auto_activate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_deactivate boolean DEFAULT false;

-- Create question bank table
CREATE TABLE IF NOT EXISTS public.question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  question_type question_type NOT NULL,
  options jsonb,
  correct_answer text,
  sample_code text,
  programming_language programming_language DEFAULT 'python',
  marks integer NOT NULL DEFAULT 10,
  difficulty_level text DEFAULT 'medium',
  subject text NOT NULL DEFAULT 'Computer Science',
  tags text[] DEFAULT '{}',
  category text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS on question_bank
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- Policies for question_bank
CREATE POLICY "Admins can manage question bank"
  ON public.question_bank
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view question bank"
  ON public.question_bank
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Add trigger to update last_login_at in profiles when user signs in
CREATE OR REPLACE FUNCTION public.sync_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.sync_last_login();

-- Function to auto-activate/deactivate exams based on schedule
CREATE OR REPLACE FUNCTION public.update_exam_status_by_schedule()
RETURNS void AS $$
BEGIN
  -- Auto-activate exams that should be active
  UPDATE public.exams
  SET status = 'active'
  WHERE auto_activate = true
    AND start_time IS NOT NULL
    AND start_time <= now()
    AND (end_time IS NULL OR end_time > now())
    AND status = 'draft';

  -- Auto-deactivate exams that have ended
  UPDATE public.exams
  SET status = 'closed'
  WHERE auto_deactivate = true
    AND end_time IS NOT NULL
    AND end_time <= now()
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_question_bank_tags ON public.question_bank USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_question_bank_subject ON public.question_bank(subject);
CREATE INDEX IF NOT EXISTS idx_exams_schedule ON public.exams(start_time, end_time, status) WHERE auto_activate = true OR auto_deactivate = true;