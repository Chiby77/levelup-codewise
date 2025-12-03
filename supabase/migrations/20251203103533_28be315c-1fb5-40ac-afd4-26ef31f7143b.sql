-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the exam status update function to run every minute
SELECT cron.schedule(
  'auto-activate-deactivate-exams',
  '* * * * *',
  $$SELECT public.update_exam_status_by_schedule()$$
);