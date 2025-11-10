-- Assurez-vous que l'extension pg_cron est activée
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- === FONCTION DE RÉINITIALISATION DES CRÉDITS IA ===
-- Crée une fonction qui met à jour les crédits des utilisateurs dont l'abonnement a atteint sa date anniversaire mensuelle.
CREATE OR REPLACE FUNCTION public.reset_monthly_ai_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  RAISE LOG 'Début de la réinitialisation des crédits IA mensuels.';

  WITH updated_rows AS (
    UPDATE public.user_profile_plans AS upp
    SET
      -- Réinitialise les crédits à la valeur définie dans le plan de l'utilisateur
      current_ai_credits = (SELECT pp.ai_credits FROM public.profile_plans AS pp WHERE pp.id = upp.plan_id),
      -- Met à jour la date du dernier reset à aujourd'hui
      last_credit_reset_date = NOW()
    WHERE
      -- Condition 1: La date actuelle est supérieure ou égale à la date du dernier reset + 1 mois.
      -- Cela signifie que la date "anniversaire" mensuelle est atteinte ou dépassée.
      NOW() >= upp.last_credit_reset_date + interval '1 month'
      -- Condition 2: On ne met à jour que les plans qui n'ont pas de crédits illimités.
      AND (SELECT pp.ai_credits FROM public.profile_plans AS pp WHERE pp.id = upp.plan_id) != -1
    RETURNING 1
  )
  SELECT count(*) INTO updated_count FROM updated_rows;

  RAISE LOG 'Réinitialisation des crédits IA mensuels terminée. % utilisateurs mis à jour.', updated_count;
END;
$$;

-- === PLANIFICATION DE LA TÂCHE (CRON) ===
-- S'exécute tous les jours à 2h00 du matin pour vérifier les comptes à réinitialiser.
SELECT cron.schedule('reset-monthly-credits', '0 2 * * *', $$ SELECT public.reset_monthly_ai_credits() $$);