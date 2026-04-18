DROP POLICY IF EXISTS "Anyone can view permanent access grants" ON public.permanent_access_grants;

CREATE POLICY "Admins or owner can view permanent access grants"
ON public.permanent_access_grants
FOR SELECT
TO public
USING (
  public.is_current_user_admin()
  OR wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
);