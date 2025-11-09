CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profile_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT,
    plan_name TEXT NOT NULL unique,
    ai_credits INTEGER,
    stored_analysis INTEGER,
    ai_credit_periodicity TEXT,
    plan_price INTEGER,
    plan_payment_periodicity TEXT,
    is_most_popular BOOLEAN DEFAULT FALSE
    );


ALTER TABLE profile_plans ENABLE ROW LEVEL SECURITY;

-- Policies for profile_plans
CREATE POLICY "Allow all authenticated users to read plans"
ON profile_plans
FOR SELECT
TO authenticated
USING (true);


INSERT INTO profile_plans (plan_name, description, ai_credits, stored_analysis, ai_credit_periodicity, plan_price, plan_payment_periodicity, is_most_popular) VALUES
('Basic', 'Pour commencer à explorer et analyser vos premiers biens.', 10, 5, 'monthly', 0, 'monthly', false),
('Active', 'Idéal pour les investisseurs actifs qui analysent régulièrement.', 25, 25, 'monthly', 200, 'monthly', true),
('Investor', 'Pour les investisseurs chevronnés avec un large portefeuille.', 300, 500, 'monthly', 900, 'monthly', false),
('Professional', 'Accès illimité et support dédié pour les professionnels.', -1, -1, 'monthly', NULL, 'usage-based', false);
