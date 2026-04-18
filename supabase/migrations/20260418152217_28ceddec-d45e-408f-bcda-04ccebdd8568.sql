-- automated_discord_signals
DROP POLICY IF EXISTS "System can insert automated signals" ON public.automated_discord_signals;
CREATE POLICY "Service role can insert automated signals"
ON public.automated_discord_signals FOR INSERT TO public
WITH CHECK (auth.role() = 'service_role');

-- referrals
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can update referrals" ON public.referrals;
CREATE POLICY "Service role can insert referrals"
ON public.referrals FOR INSERT TO public
WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update referrals"
ON public.referrals FOR UPDATE TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- signal_history
DROP POLICY IF EXISTS "Service can insert signal history" ON public.signal_history;
CREATE POLICY "Service role can insert signal history"
ON public.signal_history FOR INSERT TO public
WITH CHECK (auth.role() = 'service_role');

-- user_referral_codes
DROP POLICY IF EXISTS "System can create referral codes" ON public.user_referral_codes;
DROP POLICY IF EXISTS "System can update referral stats" ON public.user_referral_codes;
CREATE POLICY "Service role can create referral codes"
ON public.user_referral_codes FOR INSERT TO public
WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update referral stats"
ON public.user_referral_codes FOR UPDATE TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- user_subscriptions
DROP POLICY IF EXISTS "System can create subscriptions" ON public.user_subscriptions;
CREATE POLICY "Service role can create subscriptions"
ON public.user_subscriptions FOR INSERT TO public
WITH CHECK (auth.role() = 'service_role');