-- Activer l'extension pg_cron (nécessaire une seule fois par projet)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- === ROUTINE 1 : PURGE DES DONNÉES (Paramétrable) ===
-- Met à jour la fonction pour accepter un intervalle
CREATE OR REPLACE FUNCTION purge_deleted_user_data(cutoff_interval INTERVAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public -- Exécuter en tant qu'admin
AS $$
DECLARE
  -- Utilise le paramètre pour calculer la date limite
  cutoff_date timestamptz := now() - cutoff_interval;
BEGIN
  RAISE LOG 'Début de la purge des données (intervalle: %s).', cutoff_interval;

  -- Supprimer les analyses
  DELETE FROM public.analyses
  WHERE user_id IN (
    SELECT user_id FROM public.deleted_users WHERE deleted_at <= cutoff_date
  );

  -- Supprimer les feedbacks
  DELETE FROM public.feedbacks
  WHERE user_id IN (
    SELECT user_id FROM public.deleted_users WHERE deleted_at <= cutoff_date
  );
  
  RAISE LOG 'Purge des données (intervalle: %s) terminée.', cutoff_interval;
END;
$$;


-- === ROUTINE 2 : SUPPRESSION DES COMPTES (Paramétrable) ===
-- Met à jour la fonction pour accepter un intervalle
CREATE OR REPLACE FUNCTION purge_deleted_users(cutoff_interval INTERVAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE
    -- Utilise le paramètre pour calculer la date limite
    cutoff_date timestamptz := now() - cutoff_interval;
    user_to_delete RECORD;
BEGIN
    RAISE LOG 'Début de la suppression des comptes (intervalle: %s).', cutoff_interval;

    FOR user_to_delete IN 
        SELECT user_id FROM public.deleted_users WHERE deleted_at <= cutoff_date
    LOOP
        RAISE LOG 'Suppression définitive du compte auth: %', user_to_delete.user_id;
        
        -- Appeler la fonction admin de Supabase pour supprimer l'utilisateur
        PERFORM auth.admin_delete_user(user_to_delete.user_id);
    END LOOP;

    RAISE LOG 'Suppression des comptes (intervalle: %s) terminée.', cutoff_interval;
END;
$$;


-- === PLANIFICATION DES TÂCHES (CRON) ===
-- (Les tâches s'exécutent toujours à 3h00 et 4h00, mais appellent maintenant les fonctions paramétrées)


-- Planifier la purge de données (4 semaines) à 3h00
SELECT cron.schedule(
  'purge-data-4-weeks',
  '0 3 * * *', -- 3h00 tous les jours
  -- Appelle la NOUVELLE fonction en passant l'intervalle '4 weeks'
  $$ SELECT purge_deleted_user_data('4 weeks') $$
);
      
-- Planifier la suppression de compte (6 semaines) à 4h00
SELECT cron.schedule(
  'delete-accounts-6-weeks',
  '0 4 * * *', -- 4h00 tous les jours
  -- Appelle la NOUVELLE fonction en passant l'intervalle '6 weeks'
  $$ SELECT purge_deleted_users('6 weeks') $$
);