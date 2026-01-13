-- Add payment tracking columns to class_enrollments table
ALTER TABLE public.class_enrollments
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue')),
ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS auto_suspended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- Create function to auto-suspend overdue enrollments
CREATE OR REPLACE FUNCTION public.suspend_overdue_enrollments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Suspend enrollments where payment is overdue
  UPDATE class_enrollments
  SET 
    is_active = false,
    auto_suspended = true,
    suspension_reason = 'Payment overdue - automatically suspended',
    payment_status = 'overdue'
  WHERE 
    payment_due_date < NOW()
    AND payment_status = 'pending'
    AND is_active = true
    AND auto_suspended = false;
END;
$$;

-- Create a view for admin to see payment status
CREATE OR REPLACE VIEW public.enrollment_payment_status AS
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

-- Grant access to the view
GRANT SELECT ON public.enrollment_payment_status TO authenticated;