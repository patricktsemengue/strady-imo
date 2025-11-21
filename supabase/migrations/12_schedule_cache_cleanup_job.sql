-- This script schedules a daily job to clean up the ai_cache table.
-- This script creates a PostgreSQL function and a cron job to clean up the ai_cache table.
-- The job deletes all cache entries older than 1 month.

-- It is scheduled to run every day at 3:00 AM UTC.
-- You can check the status of your cron jobs with: SELECT * FROM cron.job;
-- You can view the execution history with: SELECT * FROM cron.job_run_details;

-- Step 1: Create the database function that performs the deletion.
-- This function is more efficient than an Edge Function as it runs directly in the database.
CREATE OR REPLACE FUNCTION delete_old_ai_cache_entries()
RETURNS void AS $$
BEGIN
  -- Delete rows from the ai_cache table where the creation date is older than 1 month.
  DELETE FROM public.ai_cache
  WHERE created_at < now() - interval '1 month';
END;
$$ LANGUAGE plpgsql;


-- Step 2: Schedule the function to run daily.
-- We use cron.schedule to create the job.
-- If the job already exists, cron.schedule will update it.
SELECT cron.schedule(
  'daily-ai-cache-cleanup', -- A unique name for the job
  '0 3 * * *',              -- Cron expression: "at 03:00 every day"
  $$
    -- The command to execute is a simple call to our PostgreSQL function.
    SELECT delete_old_ai_cache_entries();
  $$
);