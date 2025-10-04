-- Create storage buckets for pictures, books, and exam materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('pictures', 'pictures', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('books', 'books', false, 52428800, ARRAY['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook']),
  ('exam-materials', 'exam-materials', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Storage policies for pictures (public read, authenticated write)
CREATE POLICY "Anyone can view pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'pictures');

CREATE POLICY "Authenticated users can upload pictures"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pictures' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own pictures"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pictures' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Admins can delete pictures"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pictures' 
  AND has_role(auth.uid(), 'admin')
);

-- Storage policies for books (admin only write, authenticated read)
CREATE POLICY "Authenticated users can view books"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'books' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Admins can upload books"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'books' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update books"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'books' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete books"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'books' 
  AND has_role(auth.uid(), 'admin')
);

-- Storage policies for exam materials (admin only)
CREATE POLICY "Admins can view exam materials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exam-materials' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can upload exam materials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exam-materials' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update exam materials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'exam-materials' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete exam materials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exam-materials' 
  AND has_role(auth.uid(), 'admin')
);

-- Create announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Announcements policies
CREATE POLICY "Anyone can view active announcements"
ON public.announcements FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage announcements"
ON public.announcements FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create study tips table
CREATE TABLE public.study_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.study_tips ENABLE ROW LEVEL SECURITY;

-- Study tips policies
CREATE POLICY "Anyone can view active study tips"
ON public.study_tips FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage study tips"
ON public.study_tips FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  student_id text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at trigger for announcements
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();