-- Security definer helper: is the current requester an admin?
-- Checks both auth.uid() (for authenticated users) and the wallet_address claim
-- in the JWT (for wallet-based auth). Runs as definer to bypass RLS on user_roles
-- and avoid infinite recursion when used inside user_roles policies.
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.role = 'admin'::app_role
      AND (
        (auth.uid() IS NOT NULL AND ur.user_id = auth.uid())
        OR (
          ur.wallet_address IS NOT NULL
          AND ur.wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
        )
      )
  );
$$;

-- Drop the broken policies
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Recreate with proper identity check
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO public
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO public
USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO public
USING (public.is_current_user_admin());