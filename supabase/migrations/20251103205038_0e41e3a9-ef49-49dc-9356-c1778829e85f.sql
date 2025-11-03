-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage on cron schema
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule the automated signal function to run daily at 6am Pacific (2pm UTC)
SELECT cron.schedule(
  'send-automated-discord-signals',
  '0 14 * * *', -- Every day at 2pm UTC (6am Pacific Standard Time)
  $$
  SELECT
    net.http_post(
        url:='https://rzxondizgsecijptvqtr.supabase.co/functions/v1/auto-send-discord-signals',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eG9uZGl6Z3NlY2lqcHR2cXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTc5NjIsImV4cCI6MjA2OTk5Mzk2Mn0.YJqIQo1SYrdMrkiJdiE8TZK2iH9mR99_LgqHgjhSmzQ"}'::jsonb,
        body:='{"triggered_at": "' || now()::text || '"}'::jsonb
    ) as request_id;
  $$
);
