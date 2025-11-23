-- Add an index to the created_at column in the ai_cache table
CREATE INDEX idx_ai_cache_created_at ON public.ai_cache(created_at);
