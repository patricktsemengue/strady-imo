DO $$
DECLARE
  basic_plan_id UUID;
BEGIN
  -- Get the ID of the 'Basic' plan
  SELECT id INTO basic_plan_id FROM public.profile_plans WHERE plan_name = 'Basic';

  -- If the basic plan exists, insert a new record into user_profile_plans for all existing users who don't have a plan yet
  IF basic_plan_id IS NOT NULL THEN
    INSERT INTO public.user_profile_plans(user_id, plan_id, current_ai_credits, last_credit_reset_date)
    SELECT id, basic_plan_id, 10, NOW()
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM public.user_profile_plans)
    AND id NOT IN (SELECT user_id FROM public.deleted_users);
  END IF;
END;
$$;
