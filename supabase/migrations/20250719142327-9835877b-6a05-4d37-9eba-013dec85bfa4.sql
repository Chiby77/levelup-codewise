-- Create table for storing user interactions and learning data
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_input TEXT NOT NULL,
  ai_response TEXT,
  context_keywords TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  interaction_type TEXT DEFAULT 'chat',
  sentiment REAL DEFAULT 0.0,
  topics TEXT[]
);

-- Enable Row Level Security
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user interactions
CREATE POLICY "Anyone can insert interactions" 
ON public.user_interactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view interactions" 
ON public.user_interactions 
FOR SELECT 
USING (true);

-- Create table for storing learned phrases and responses
CREATE TABLE public.learned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_phrase TEXT NOT NULL,
  response_text TEXT NOT NULL,
  confidence_score REAL DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.learned_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for learned responses
CREATE POLICY "Anyone can view learned responses" 
ON public.learned_responses 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage learned responses" 
ON public.learned_responses 
FOR ALL 
USING (true);