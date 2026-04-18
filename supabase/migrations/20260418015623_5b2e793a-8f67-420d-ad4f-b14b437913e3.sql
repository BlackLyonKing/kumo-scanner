
-- 1. Fix notifications RLS - restrict to owner by wallet
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
  OR (auth.uid() IS NOT NULL AND wallet_address = (auth.jwt() ->> 'wallet_address'))
);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
  OR (auth.uid() IS NOT NULL AND wallet_address = (auth.jwt() ->> 'wallet_address'))
);

-- 2. Fix permanent_access_grants DELETE - require current user to be the admin
DROP POLICY IF EXISTS "Admins can delete permanent access grants" ON public.permanent_access_grants;

CREATE POLICY "Admins can delete permanent access grants"
ON public.permanent_access_grants
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.role = 'admin'::app_role
      AND ur.wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
  )
);

-- 3. Fix user_watchlists - restrict to owner by wallet
DROP POLICY IF EXISTS "Users can manage their own watchlist" ON public.user_watchlists;

CREATE POLICY "Users can view their own watchlist"
ON public.user_watchlists
FOR SELECT
USING (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

CREATE POLICY "Users can insert into their own watchlist"
ON public.user_watchlists
FOR INSERT
WITH CHECK (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

CREATE POLICY "Users can update their own watchlist"
ON public.user_watchlists
FOR UPDATE
USING (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);

CREATE POLICY "Users can delete from their own watchlist"
ON public.user_watchlists
FOR DELETE
USING (
  wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
);
