-- Create referrals table to track referral relationships
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT NOT NULL,
  referrer_code TEXT NOT NULL,
  referred_wallet TEXT,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, rewarded
  reward_days INTEGER DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_wallet);
CREATE INDEX idx_referrals_code ON public.referrals(referrer_code);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_wallet);

-- Create user_referral_codes table to store each user's unique referral code
CREATE TABLE public.user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  total_days_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals as referrer"
  ON public.referrals
  FOR SELECT
  USING (referrer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view referrals they were referred by"
  ON public.referrals
  FOR SELECT
  USING (referred_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "System can insert referrals"
  ON public.referrals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update referrals"
  ON public.referrals
  FOR UPDATE
  USING (true);

-- RLS Policies for user_referral_codes
CREATE POLICY "Users can view their own referral code"
  ON public.user_referral_codes
  FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Anyone can view referral codes for validation"
  ON public.user_referral_codes
  FOR SELECT
  USING (true);

CREATE POLICY "System can create referral codes"
  ON public.user_referral_codes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update referral stats"
  ON public.user_referral_codes
  FOR UPDATE
  USING (true);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(wallet_addr TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text || wallet_addr || now()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM user_referral_codes WHERE referral_code = code) INTO exists_check;
    
    -- Exit loop if unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to automatically create referral code for wallet users
CREATE OR REPLACE FUNCTION public.create_referral_code_for_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate unique code
  new_code := generate_referral_code(NEW.wallet_address);
  
  -- Insert referral code record
  INSERT INTO public.user_referral_codes (wallet_address, referral_code)
  VALUES (NEW.wallet_address, new_code)
  ON CONFLICT (wallet_address) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create referral code when subscription is created
CREATE TRIGGER on_subscription_create_referral_code
  AFTER INSERT ON public.user_subscriptions
  FOR EACH ROW
  WHEN (NEW.wallet_address IS NOT NULL)
  EXECUTE FUNCTION public.create_referral_code_for_wallet();