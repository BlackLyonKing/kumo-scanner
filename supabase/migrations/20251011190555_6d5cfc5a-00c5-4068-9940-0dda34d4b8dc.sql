-- Update subscription plans with new pricing tiers
UPDATE subscription_plans 
SET 
  price_usd = 39.00,
  billing_cycle = 'monthly',
  updated_at = now()
WHERE name = 'B.L.K. Pro';

-- Insert new weekly plan if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'B.L.K. Pro Weekly') THEN
    INSERT INTO subscription_plans (name, price_usd, billing_cycle, features)
    VALUES (
      'B.L.K. Pro Weekly',
      12.00,
      'weekly',
      '{
        "unlimited_scans": true,
        "premium_signals": true,
        "multi_timeframe_analysis": true,
        "rsi_alerts": true,
        "analysis_notes": true,
        "token_screener": true,
        "team_chat": true
      }'::jsonb
    );
  END IF;
END $$;

-- Insert quarterly plan if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'B.L.K. Pro Quarterly') THEN
    INSERT INTO subscription_plans (name, price_usd, billing_cycle, features)
    VALUES (
      'B.L.K. Pro Quarterly',
      99.00,
      'quarterly',
      '{
        "unlimited_scans": true,
        "premium_signals": true,
        "multi_timeframe_analysis": true,
        "rsi_alerts": true,
        "analysis_notes": true,
        "token_screener": true,
        "team_chat": true,
        "priority_support": true
      }'::jsonb
    );
  END IF;
END $$;

-- Update trial period to 7 days
CREATE OR REPLACE FUNCTION public.grant_trial_to_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  default_plan_id UUID;
BEGIN
  -- Get the monthly plan as default
  SELECT id INTO default_plan_id 
  FROM public.subscription_plans 
  WHERE name = 'B.L.K. Pro' 
  LIMIT 1;
  
  -- Create 7-day trial subscription for new user
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    NEW.id,
    default_plan_id,
    'trial',
    now(),
    now() + INTERVAL '7 days'
  );
  
  RETURN NEW;
END;
$$;