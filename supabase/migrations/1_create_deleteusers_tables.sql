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


-- 4. Politique de LECTURE (SELECT)
-- Permet à un utilisateur de voir UNIQUEMENT son propre enregistrement dans la table.
-- Utile pour le débogage ou pour qu'une interface puisse savoir si l'utilisateur est "supprimé".
CREATE POLICY "Allow user to see their own deleted status"
ON public.deleted_users
FOR SELECT
USING (auth.uid() = user_id);

-- 5. Politique de SUPPRESSION (DELETE) - SÉCURITÉ
-- N'autorise PERSONNE à supprimer des lignes directement.
-- La suppression doit OBLIGATOIREMENT passer par la fonction `restore-user` qui utilise la clé admin.
-- C'est une politique restrictive qui renforce la sécurité.
CREATE POLICY "Disallow direct deletion by users"
ON public.deleted_users
FOR DELETE
USING (false);

-- 6. Politique d'INSERTION et de MISE À JOUR (INSERT, UPDATE) - SÉCURITÉ
-- De même, on interdit ces actions directement par l'utilisateur.
CREATE POLICY "Disallow direct modification by users"
ON public.deleted_users
FOR ALL -- S'applique à INSERT, UPDATE, et complète les autres
USING (false);
