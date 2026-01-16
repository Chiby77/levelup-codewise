-- Fix the update_exam_status_by_schedule function to use 'completed' instead of 'closed'
CREATE OR REPLACE FUNCTION public.update_exam_status_by_schedule()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-activate exams that should be active
  UPDATE public.exams
  SET status = 'active'
  WHERE auto_activate = true
    AND start_time IS NOT NULL
    AND start_time <= now()
    AND (end_time IS NULL OR end_time > now())
    AND status = 'draft';

  -- Auto-deactivate exams that have ended (use 'completed' which is a valid enum value)
  UPDATE public.exams
  SET status = 'completed'
  WHERE auto_deactivate = true
    AND end_time IS NOT NULL
    AND end_time <= now()
    AND status = 'active';
END;
$function$;