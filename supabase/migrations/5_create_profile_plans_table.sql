-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the table
CREATE TABLE profile_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT,
    plan_name TEXT NOT NULL UNIQUE,
    ai_credits INTEGER,
    stored_analysis INTEGER,
    ai_credit_periodicity TEXT,
    plan_price INTEGER,
    plan_payment_periodicity TEXT,
    is_most_popular BOOLEAN DEFAULT FALSE
);

-- 3. Enable Security (RLS)
ALTER TABLE profile_plans ENABLE ROW LEVEL SECURITY;

-- 4. Create Policy
CREATE POLICY "Allow all authenticated users to read plans"
ON profile_plans
FOR SELECT
TO authenticated
USING (true);

-- 5. Insert Data (New Plans + Marketing Descriptions)
INSERT INTO profile_plans (
    plan_name, 
    description, 
    ai_credits, 
    stored_analysis, 
    ai_credit_periodicity, 
    plan_price, 
    plan_payment_periodicity, 
    is_most_popular
) VALUES
(
    'Starter', 
    'Lancez-vous ! Obtenez **20 crédits IA** chaque mois pour poser vos premières questions, analyser le potentiel d''un bien et découvrir la puissance de l''analyse immobilière assistée par IA.', 
    20, 
    3, 
    'monthly', 
    0, 
    'monthly', 
    false
),
(
    'Essential', 
    'Passez à la vitesse supérieure. Avec **500 crédits IA** par mois, vous pouvez discuter en profondeur de vos projets, extraire automatiquement les données d''annonces en ligne et simuler de multiples scénarios de rentabilité.', 
    500, 
    15, 
    'monthly', 
    199, 
    'monthly', 
    true
),
(
    'Investor', 
    'Dominez votre marché. Profitez de **1500 crédits IA** chaque mois pour une analyse exhaustive, un suivi de portefeuille et un dialogue continu avec votre assistant pour challenger chaque aspect de vos investissements.', 
    1500, 
    50, 
    'monthly', 
    499, 
    'monthly', 
    false
),
(
    'Pro', 
    'L''outil ultime pour les pros. Avec **2500 crédits IA** par mois, plus aucune limite à vos analyses. Idéal pour les agents, les gestionnaires de patrimoine et les investisseurs à plein temps qui exigent des réponses instantanées et illimitées.', 
    2500, 
    -1, 
    'monthly', 
    799, 
    'monthly', 
    false
);