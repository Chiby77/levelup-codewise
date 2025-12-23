-- Create classes table with subject-based structure
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  year_level TEXT NOT NULL DEFAULT 'Year 1',
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class enrollments table
CREATE TABLE public.class_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_email TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  enrolled_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(class_id, student_id)
);

-- Create exam-class assignments table
CREATE TABLE public.exam_class_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL,
  UNIQUE(exam_id, class_id)
);

-- Create assignments table for student uploads
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  max_marks INTEGER NOT NULL DEFAULT 100,
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  results_released BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  marks INTEGER,
  feedback TEXT,
  graded BOOLEAN DEFAULT false,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view active classes they're enrolled in" ON public.classes
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = classes.id
      AND ce.student_id = auth.uid()
      AND ce.is_active = true
    )
  );

-- Class enrollments policies
CREATE POLICY "Admins can manage enrollments" ON public.class_enrollments
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view own enrollments" ON public.class_enrollments
  FOR SELECT USING (auth.uid() = student_id);

-- Exam-class assignments policies
CREATE POLICY "Admins can manage exam assignments" ON public.exam_class_assignments
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view exam assignments for their classes" ON public.exam_class_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = exam_class_assignments.class_id
      AND ce.student_id = auth.uid()
      AND ce.is_active = true
    )
  );

-- Assignments policies
CREATE POLICY "Admins can manage assignments" ON public.assignments
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view active assignments for their classes" ON public.assignments
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = assignments.class_id
      AND ce.student_id = auth.uid()
      AND ce.is_active = true
    )
  );

-- Assignment submissions policies
CREATE POLICY "Admins can manage all submissions" ON public.assignment_submissions
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can submit assignments" ON public.assignment_submissions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.class_enrollments ce ON ce.class_id = a.class_id
      WHERE a.id = assignment_submissions.assignment_id
      AND ce.student_id = auth.uid()
      AND ce.is_active = true
      AND a.is_active = true
    )
  );

CREATE POLICY "Students can view own submissions" ON public.assignment_submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can view graded submissions when released" ON public.assignment_submissions
  FOR SELECT USING (
    auth.uid() = student_id AND
    graded = true AND
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_submissions.assignment_id
      AND a.results_released = true
    )
  );

-- Create storage bucket for assignments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assignments',
  'assignments',
  false,
  52428800,
  ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Storage policies for assignments bucket
CREATE POLICY "Admins can manage all assignment files" ON storage.objects
  FOR ALL USING (bucket_id = 'assignments' AND has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'assignments' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can upload their own assignment files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assignments' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Students can view their own assignment files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assignments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add triggers for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();