-- 1. CRÉER LA TABLE deleted_users
-- Cette table stocke les utilisateurs qui ont demandé la suppression de leur compte.
-- L'accès est restreint aux admins et aux fonctions (via service_role).
CREATE TABLE public.deleted_users (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deleted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- 2. Activer RLS pour la nouvelle table
ALTER TABLE public.deleted_users ENABLE ROW LEVEL SECURITY;

-- 3. Politiques de sécurité pour deleted_users
-- Personne ne peut voir/écrire sur cette table (sauf admin/service_role)
CREATE POLICY "Deny all client access"
ON public.deleted_users
FOR ALL USING (false)
WITH CHECK (false);