-- 1. Créer la table pour stocker les analyses
CREATE TABLE public.analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Clé étrangère qui lie cette table à la table des utilisateurs de Supabase Auth
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name text NULL,
  ville text NULL,
  data jsonb NULL, -- Pour stocker l'objet 'data' de React
  result jsonb NULL, -- Pour stocker l'objet 'result' de React
  CONSTRAINT analyses_pkey PRIMARY KEY (id)
);

-- 2. Activer la Sécurité "Row Level Security" (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques de sécurité (Policies)
-- Ces règles vérifient que l'utilisateur est le propriétaire ET qu'il n'est pas marqué pour suppression.

-- Permet aux utilisateurs de VOIR UNIQUEMENT leurs propres analyses
CREATE POLICY "Allow user to read their own analyses"
ON public.analyses
FOR SELECT USING (
  (auth.uid() = user_id) AND
  (NOT EXISTS (SELECT 1 FROM public.deleted_users WHERE user_id = auth.uid()))
);

-- Permet aux utilisateurs de CRÉER des analyses pour eux-mêmes
CREATE POLICY "Allow user to create an analysis"
ON public.analyses
FOR INSERT WITH CHECK (
  (auth.uid() = user_id) AND
  (NOT EXISTS (SELECT 1 FROM public.deleted_users WHERE user_id = auth.uid()))
);

-- Permet aux utilisateurs de METTRE À JOUR leurs propres analyses
CREATE POLICY "Allow user to update their own analyses"
ON public.analyses
FOR UPDATE USING (
  (auth.uid() = user_id) AND
  (NOT EXISTS (SELECT 1 FROM public.deleted_users WHERE user_id = auth.uid()))
) WITH CHECK (
  (auth.uid() = user_id) AND
  (NOT EXISTS (SELECT 1 FROM public.deleted_users WHERE user_id = auth.uid()))
);

-- Permet aux utilisateurs de SUPPRIMER leurs propres analyses
CREATE POLICY "Allow user to delete their own analyses"
ON public.analyses
FOR DELETE USING (
  (auth.uid() = user_id) AND
  (NOT EXISTS (SELECT 1 FROM public.deleted_users WHERE user_id = auth.uid()))
);