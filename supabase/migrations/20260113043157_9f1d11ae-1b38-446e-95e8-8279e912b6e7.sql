-- Fix: Drop the security definer view and recreate with proper security
DROP VIEW IF EXISTS public.enrollment_payment_status;

-- Recreate as a regular view (uses invoker's permissions by default)
CREATE VIEW public.enrollment_payment_status AS
SELECT 
  ce.id,
  ce.student_email,
  ce.student_id,
  ce.class_id,
  c.name as class_name,
  c.subject,
  ce.payment_status,
  ce.payment_due_date,
  ce.last_payment_date,
  ce.payment_amount,
  ce.is_active,
  ce.auto_suspended,
  ce.suspension_reason,
  ce.enrolled_at,
  p.full_name as student_name
FROM class_enrollments ce
LEFT JOIN classes c ON ce.class_id = c.id
LEFT JOIN profiles p ON ce.student_id = p.id;

-- Grant access only to authenticated users
GRANT SELECT ON public.enrollment_payment_status TO authenticated;