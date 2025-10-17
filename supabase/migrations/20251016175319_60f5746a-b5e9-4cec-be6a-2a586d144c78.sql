-- Make user_id nullable for wallet-only subscriptions
ALTER TABLE public.user_subscriptions 
ALTER COLUMN user_id DROP NOT NULL;

-- Grant permanent access to wallet 6jd9pZqayL2TjfgmjWvN6GpUKuqv8BuaMkhctmBxBZs9,
  Br5s6YVrJoo5NGHqMXAeD2sEUQUUv9rEjaDVk2nq4pxx
DO $$
DECLARE
  default_plan_id UUID;
BEGIN
  -- Get the monthly plan (or any plan as reference)
  SELECT id INTO default_plan_id 
  FROM public.subscription_plans 
  LIMIT 1;
  
  -- Delete any existing subscription for this wallet
  DELETE FROM public.user_subscriptions 
  WHERE wallet_address = '6jd9pZqayL2TjfgmjWvN6GpUKuqv8BuaMkhctmBxBZs9';
  
  -- Create permanent subscription (expires in year 2099)
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    subscription_start_date,
    subscription_end_date,
    wallet_address
  ) VALUES (
    NULL,
    default_plan_id,
    'active',
    now(),
    '2099-12-31 23:59:59+00'::timestamp with time zone,
    '6jd9pZqayL2TjfgmjWvN6GpUKuqv8BuaMkhctmBxBZs9'
  );
END $$;