-- Activer l'extension pg_cron (nécessaire une seule fois par projet)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- === ROUTINE 1 : PURGE DES DONNÉES (4 SEMAINES) ===
-- Crée une fonction qui supprime les analyses et feedbacks
CREATE OR REPLACE FUNCTION purge_deleted_user_data_4_weeks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Exécuter en tant qu'admin
AS $$
DECLARE
  four_weeks_ago timestamptz := now() - interval '4 weeks';
BEGIN
  RAISE LOG 'Début de la purge des données (4 semaines).';

  -- Supprimer les analyses
  DELETE FROM public.analyses
  WHERE user_id IN (
    SELECT user_id FROM public.deleted_users WHERE deleted_at <= four_weeks_ago
  );

  -- Supprimer les feedbacks
  DELETE FROM public.feedbacks
  WHERE user_id IN (
    SELECT user_id FROM public.deleted_users WHERE deleted_at <= four_weeks_ago
  );
  
  RAISE LOG 'Purge des données (4 semaines) terminée.';
END;
$$;


-- === ROUTINE 2 : SUPPRESSION DES COMPTES (6 SEMAINES) ===
-- Crée une fonction qui supprime le compte auth (ce qui supprime en cascade l'entrée dans deleted_users)
CREATE OR REPLACE FUNCTION purge_deleted_users_6_weeks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    six_weeks_ago timestamptz := now() - interval '6 weeks';
    user_to_delete RECORD;
BEGIN
    RAISE LOG 'Début de la suppression des comptes (6 semaines).';

    FOR user_to_delete IN 
        SELECT user_id FROM public.deleted_users WHERE deleted_at <= six_weeks_ago
    LOOP
        RAISE LOG 'Suppression définitive du compte auth: %', user_to_delete.user_id;
        
        -- Appeler la fonction admin de Supabase pour supprimer l'utilisateur
        -- (Ceci va cascader et supprimer l'entrée dans public.deleted_users grâce au 'ON DELETE CASCADE')
        PERFORM auth.admin_delete_user(user_to_delete.user_id);
    END LOOP;

    RAISE LOG 'Suppression des comptes (6 semaines) terminée.';
END;
$$;


-- === PLANIFICATION DES TÂCHES (CRON) ===
-- (S'exécute tous les jours à 3h00 et 4h00 du matin)

-- Désactiver les anciennes tâches si elles existent


SELECT cron.unschedule('purge-data-4-weeks');
-- Planifier la purge de données (4 semaines) à 3h00
SELECT cron.schedule(
  'purge-data-4-weeks',
  '0 3 * * *', -- 3h00 tous les jours
  $$ SELECT purge_deleted_user_data_4_weeks() $$
);

--       SELECT cron.unschedule('delete-accounts-6-weeks');
--       --       
--       -- Planifier la suppression de compte (6 semaines) à 4h00
--       SELECT cron.schedule(
--         'delete-accounts-6-weeks',
--         '0 4 * * *', -- 4h00 tous les jours
--         $$ SELECT purge_deleted_users_6_weeks() $$
--       );