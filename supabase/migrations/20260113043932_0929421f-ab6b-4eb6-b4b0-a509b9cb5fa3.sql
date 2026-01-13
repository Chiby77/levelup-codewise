-- Add is_general column to exams table to distinguish between general and class-specific exams
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS is_general BOOLEAN DEFAULT true;

-- Update the RLS policy to allow students to see general active exams
-- Drop the old policy first
DROP POLICY IF EXISTS "Anyone can view active exams" ON public.exams;

-- Create new policy that allows viewing general active exams OR exams assigned to enrolled classes
CREATE POLICY "Students can view active exams" ON public.exams
  FOR SELECT USING (
    -- Admins can see all
    has_role(auth.uid(), 'admin'::app_role)
    OR
    (
      status = 'active'::exam_status AND (
        -- General exams visible to all authenticated users
        is_general = true
        OR
        -- Class-specific exams only visible to enrolled students
        EXISTS (
          SELECT 1 FROM public.exam_class_assignments eca
          JOIN public.class_enrollments ce ON ce.class_id = eca.class_id
          WHERE eca.exam_id = exams.id
          AND ce.student_id = auth.uid()
          AND ce.is_active = true
        )
      )
    )
  );

-- Comment for clarity
COMMENT ON COLUMN public.exams.is_general IS 'True for exams visible to all students, false for class-specific exams';