-- Add an index to the deleted_at column in the deleted_users table
CREATE INDEX idx_deleted_users_deleted_at ON public.deleted_users(deleted_at);
