-- Function to validate the schema of the 'data' jsonb object
CREATE OR REPLACE FUNCTION public.is_valid_analysis_data(data jsonb)
RETURNS boolean AS $$
DECLARE
    detail_item jsonb;
    unit_item jsonb;
BEGIN
    -- Check for null data or not an object
    IF data IS NULL OR jsonb_typeof(data) != 'object' THEN
        RETURN true; -- Allow NULL data if the column is nullable
    END IF;

    -- Check top-level keys
    IF NOT (data ? 'property' AND data ? 'acquisition' AND data ? 'financing' AND data ? 'rental') THEN
        RAISE NOTICE 'Missing top-level key';
        RETURN false;
    END IF;

    -- Check nested array types
    IF NOT (jsonb_typeof(data->'acquisition'->'coutTravaux'->'details') = 'array' AND
            jsonb_typeof(data->'rental'->'loyerEstime'->'units') = 'array' AND
            jsonb_typeof(data->'rental'->'chargesAnnuelles'->'details') = 'array') THEN
        RAISE NOTICE 'A details/units key is not an array';
        RETURN false;
    END IF;

    -- Validate each item in 'acquisition.coutTravaux.details'
    FOR detail_item IN SELECT * FROM jsonb_array_elements(data->'acquisition'->'coutTravaux'->'details')
    LOOP
        IF NOT (detail_item ? 'name' AND detail_item ? 'cost' AND jsonb_typeof(detail_item->'cost') = 'number') THEN
            RAISE NOTICE 'Invalid item in coutTravaux.details: %', detail_item;
            RETURN false;
        END IF;
    END LOOP;

    -- Validate each item in 'rental.loyerEstime.units'
    FOR unit_item IN SELECT * FROM jsonb_array_elements(data->'rental'->'loyerEstime'->'units')
    LOOP
        IF NOT (unit_item ? 'name' AND unit_item ? 'rent' AND jsonb_typeof(unit_item->'rent') = 'number') THEN
            RAISE NOTICE 'Invalid item in loyerEstime.units: %', unit_item;
            RETURN false;
        END IF;
    END LOOP;

    -- All checks passed
    RETURN true;
END;
$$ LANGUAGE plpgsql;

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
  CONSTRAINT analyses_pkey PRIMARY KEY (id),

  -- Ajout d'une contrainte CHECK pour valider la structure du JSONB 'data'
  CONSTRAINT data_schema_validation CHECK (public.is_valid_analysis_data(data))
);
-- Add the check constraint to the table
ALTER TABLE public.analyses
ADD CONSTRAINT data_schema_validation CHECK (public.is_valid_analysis_data(data));

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