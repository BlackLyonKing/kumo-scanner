-- Helper: wallet from JWT claim
-- Uses current_setting('request.jwt.claims') ->> 'wallet_address'

-- =========================
-- PRODUCTS
-- =========================
DROP POLICY IF EXISTS "Anyone can create products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Sellers can create their own products"
ON public.products FOR INSERT TO public
WITH CHECK (seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Sellers can update their own products"
ON public.products FOR UPDATE TO public
USING (seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'))
WITH CHECK (seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Sellers can delete their own products"
ON public.products FOR DELETE TO public
USING (seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

-- =========================
-- ORDERS
-- =========================
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;

CREATE POLICY "Buyers can create their own orders"
ON public.orders FOR INSERT TO public
WITH CHECK (buyer_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Buyer or seller can update their orders"
ON public.orders FOR UPDATE TO public
USING (
  buyer_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
)
WITH CHECK (
  buyer_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
);

CREATE POLICY "Buyer or seller can view their orders"
ON public.orders FOR SELECT TO public
USING (
  buyer_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR seller_wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR public.is_current_user_admin()
);

-- =========================
-- PROFILES
-- =========================
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT TO public
WITH CHECK (wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO public
USING (wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'))
WITH CHECK (wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

-- =========================
-- OFFERS
-- =========================
DROP POLICY IF EXISTS "Users can create offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can update offers" ON public.offers;

CREATE POLICY "Buyers can create their own offers"
ON public.offers FOR INSERT TO public
WITH CHECK (buyer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Buyer or seller can update their offers"
ON public.offers FOR UPDATE TO public
USING (
  buyer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR seller_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
)
WITH CHECK (
  buyer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR seller_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
);

-- =========================
-- REVIEWS
-- =========================
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

CREATE POLICY "Reviewers can create their own reviews"
ON public.reviews FOR INSERT TO public
WITH CHECK (reviewer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Reviewers can update their own reviews"
ON public.reviews FOR UPDATE TO public
USING (reviewer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'))
WITH CHECK (reviewer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Reviewers can delete their own reviews"
ON public.reviews FOR DELETE TO public
USING (reviewer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

-- =========================
-- DIRECT MESSAGES
-- =========================
DROP POLICY IF EXISTS "Users can send messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.direct_messages;

CREATE POLICY "Senders can create their own messages"
ON public.direct_messages FOR INSERT TO public
WITH CHECK (sender_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Receivers can mark messages as read"
ON public.direct_messages FOR UPDATE TO public
USING (receiver_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'))
WITH CHECK (receiver_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address'));

CREATE POLICY "Sender or receiver can view their messages"
ON public.direct_messages FOR SELECT TO public
USING (
  sender_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  OR receiver_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
);

-- =========================
-- NOTIFICATIONS
-- =========================
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Only admins can create notifications"
ON public.notifications FOR INSERT TO public
WITH CHECK (public.is_current_user_admin());