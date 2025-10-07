-- Create chat_tokens table to track message usage per user
CREATE TABLE public.chat_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tokens_used integer NOT NULL DEFAULT 0,
  tokens_limit integer NOT NULL DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.chat_tokens ENABLE ROW LEVEL SECURITY;

-- Users can view their own tokens
CREATE POLICY "Users can view their own tokens"
ON public.chat_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own tokens (for incrementing usage)
CREATE POLICY "Users can update their own tokens"
ON public.chat_tokens
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow inserting tokens for new users
CREATE POLICY "Users can insert their own tokens"
ON public.chat_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins have unlimited access
CREATE POLICY "Admins can view all tokens"
ON public.chat_tokens
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Function to check if user has tokens available
CREATE OR REPLACE FUNCTION public.check_chat_tokens(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  tokens_used integer;
  tokens_limit integer;
BEGIN
  -- Check if user is admin (unlimited tokens)
  SELECT has_role(_user_id, 'admin') INTO is_admin;
  IF is_admin THEN
    RETURN true;
  END IF;
  
  -- Check token usage
  SELECT ct.tokens_used, ct.tokens_limit 
  INTO tokens_used, tokens_limit
  FROM public.chat_tokens ct
  WHERE ct.user_id = _user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.chat_tokens (user_id, tokens_used, tokens_limit)
    VALUES (_user_id, 0, 10);
    RETURN true;
  END IF;
  
  RETURN tokens_used < tokens_limit;
END;
$$;

-- Function to increment token usage
CREATE OR REPLACE FUNCTION public.increment_chat_tokens(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Don't increment for admins
  IF has_role(_user_id, 'admin') THEN
    RETURN;
  END IF;
  
  -- Insert or update token usage
  INSERT INTO public.chat_tokens (user_id, tokens_used, tokens_limit)
  VALUES (_user_id, 1, 10)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    tokens_used = chat_tokens.tokens_used + 1,
    updated_at = now();
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_chat_tokens_updated_at
BEFORE UPDATE ON public.chat_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();