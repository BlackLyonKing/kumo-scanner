-- Fix the create_wallet_trial function to handle wallet-only users correctly
-- The issue is that it was creating a random user_id that doesn't exist in any users table
CREATE OR REPLACE FUNCTION public.create_wallet_trial(wallet_addr text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  default_plan_id UUID;
  new_subscription_id UUID;
BEGIN
  -- Get the monthly plan as default
  SELECT id INTO default_plan_id 
  FROM public.subscription_plans 
  WHERE billing_cycle = 'monthly'
  LIMIT 1;
  
  -- Check if wallet already has a subscription
  IF EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE wallet_address = wallet_addr
  ) THEN
    -- Return existing subscription
    SELECT id INTO new_subscription_id 
    FROM public.user_subscriptions 
    WHERE wallet_address = wallet_addr 
    LIMIT 1;
    RETURN new_subscription_id;
  END IF;
  
  -- Create 7-day trial subscription for wallet-only users
  -- Set user_id to NULL since wallet-only users don't have auth accounts
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    trial_start_date,
    trial_end_date,
    wallet_address
  ) VALUES (
    NULL, -- NULL for wallet-only users instead of random UUID
    default_plan_id,
    'trial',
    now(),
    now() + INTERVAL '7 days',
    wallet_addr
  )
  RETURNING id INTO new_subscription_id;
  
  RETURN new_subscription_id;
END;
$$;