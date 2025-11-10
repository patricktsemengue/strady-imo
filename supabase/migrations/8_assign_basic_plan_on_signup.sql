CREATE OR REPLACE FUNCTION public.assign_basic_plan_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  basic_plan_id UUID;
BEGIN
  -- Get the ID of the 'Basic' plan
  SELECT id INTO basic_plan_id FROM public.profile_plans WHERE plan_name = 'Basic';

  -- If the basic plan exists, insert a new record into user_profile_plans
  IF basic_plan_id IS NOT NULL THEN
    INSERT INTO public.user_profile_plans(user_id, plan_id, current_ai_credits, last_credit_reset_date)
    VALUES(NEW.id, basic_plan_id, 10, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger that fires after a new user is inserted
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_basic_plan_on_signup();
