CREATE TABLE public.ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_hash TEXT NOT NULL,
  request_payload JSONB NOT NULL,
  response_payload JSONB NOT NULL
);

-- Index pour des recherches rapides sur le hash et l'utilisateur
CREATE UNIQUE INDEX ai_cache_user_hash_idx ON public.ai_cache(user_id, request_hash);

-- Activer la Row-Level Security (RLS)
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour que les utilisateurs ne puissent accéder qu'à leurs propres entrées de cache
CREATE POLICY "Users can access their own cache"
ON public.ai_cache
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cache entries"
ON public.ai_cache
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cache entries"
ON public.ai_cache
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cache entries"
ON public.ai_cache
FOR DELETE
USING (auth.uid() = user_id);
