-- Add wallet_address column to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create index for better performance on wallet address lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_wallet_address 
ON public.user_subscriptions(wallet_address);

-- Update the RLS policies to work with wallet addresses
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view subscriptions by wallet" 
ON public.user_subscriptions 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  wallet_address IS NOT NULL
);

CREATE POLICY "Users can update subscriptions by wallet" 
ON public.user_subscriptions 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  wallet_address IS NOT NULL
);

-- Create policy for inserting subscriptions with wallet
CREATE POLICY "System can create subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Update the grant_trial_to_new_user function to support wallet-based trials
CREATE OR REPLACE FUNCTION public.create_wallet_trial(wallet_addr TEXT)
RETURNS UUID
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
  
  -- Create 7-day trial subscription for wallet
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    trial_start_date,
    trial_end_date,
    wallet_address
  ) VALUES (
    gen_random_uuid(), -- Generate a dummy user_id for wallet-only users
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