-- Add account status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated'));

-- Add last login tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

-- Create user activity log table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert activity logs
CREATE POLICY "Admins can insert activity logs"
ON public.user_activity_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Update profiles RLS to allow admins to update account status
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));