-- Add programming language support to questions
CREATE TYPE programming_language AS ENUM ('python', 'java', 'vb', 'c', 'cpp', 'javascript');

ALTER TABLE public.questions 
ADD COLUMN programming_language programming_language DEFAULT 'python';

-- Create downloads materials table for admin management
CREATE TABLE public.downloads_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  category TEXT NOT NULL,
  material_type TEXT NOT NULL,
  year TEXT,
  is_active BOOLEAN DEFAULT true,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on downloads_materials
ALTER TABLE public.downloads_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for downloads_materials
CREATE POLICY "Admins can manage download materials"
ON public.downloads_materials
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active materials"
ON public.downloads_materials
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_downloads_materials_updated_at
BEFORE UPDATE ON public.downloads_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();