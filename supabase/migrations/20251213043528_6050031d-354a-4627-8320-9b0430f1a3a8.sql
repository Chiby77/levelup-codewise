-- Schedule cron job to send exam reminder emails every hour
SELECT cron.schedule(
  'exam-reminder-emails-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://lprllsdtgnewmsnjyxhj.supabase.co/functions/v1/exam-reminder-emails',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwcmxsc2R0Z25ld21zbmp5eGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Mzc1MzAsImV4cCI6MjA2ODMxMzUzMH0.Jz0BFk2H73lwVqJ_8gcPwWhGsBiHcMFaZiGK1EN4PM0"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);