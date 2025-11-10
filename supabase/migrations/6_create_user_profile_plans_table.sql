CREATE TABLE user_profile_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES profile_plans(id),
    current_ai_credits INTEGER,
    last_credit_reset_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profile_plans ENABLE ROW LEVEL SECURITY;

-- Policies for user_profile_plans
CREATE POLICY "Allow users to read their own profile plan"
ON user_profile_plans
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own profile plan"
ON user_profile_plans
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own profile plan"
ON user_profile_plans
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);