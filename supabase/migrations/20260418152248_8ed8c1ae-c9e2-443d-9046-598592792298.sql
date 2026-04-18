-- testimonials
DROP POLICY IF EXISTS "Authenticated users can create testimonials" ON public.testimonials;
CREATE POLICY "Owners can create their own testimonials"
ON public.testimonials FOR INSERT TO public
WITH CHECK (wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

-- reviews: remove redundant/loose update policy (owner-scoped one was added in previous migration)
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

-- user_subscriptions: tighten update
DROP POLICY IF EXISTS "Users can update subscriptions by wallet" ON public.user_subscriptions;
CREATE POLICY "Users can update their own subscription"
ON public.user_subscriptions FOR UPDATE TO public
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR auth.role() = 'service_role'
)
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR auth.role() = 'service_role'
);