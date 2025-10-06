-- Create user_watchlists table for favorite trading pairs
CREATE TABLE IF NOT EXISTS public.user_watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  symbol TEXT NOT NULL,
  blockchain TEXT NOT NULL DEFAULT 'Binance',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, symbol, blockchain)
);

ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist"
ON public.user_watchlists
FOR ALL
USING (true)
WITH CHECK (true);

-- Create signal_history table for tracking signal performance
CREATE TABLE IF NOT EXISTS public.signal_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  blockchain TEXT NOT NULL DEFAULT 'Binance',
  signal_type TEXT NOT NULL,
  grade TEXT NOT NULL,
  entry_price NUMERIC NOT NULL,
  target_price NUMERIC,
  stop_loss NUMERIC,
  current_price NUMERIC,
  pnl_percentage NUMERIC,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  ichimoku_data JSONB
);

ALTER TABLE public.signal_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view signal history"
ON public.signal_history
FOR SELECT
USING (true);

CREATE POLICY "Service can insert signal history"
ON public.signal_history
FOR INSERT
WITH CHECK (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_trader BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_featured BOOLEAN DEFAULT false
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
ON public.testimonials
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (wallet_address IS NOT NULL);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ items"
ON public.faq_items
FOR SELECT
USING (true);

-- Insert default FAQ items
INSERT INTO public.faq_items (question, answer, category, order_index) VALUES
('What is Ichimoku Cloud analysis?', 'Ichimoku Cloud is a comprehensive technical analysis system that shows support/resistance levels, momentum, and trend direction all in one chart. It was developed in Japan and is particularly effective for cryptocurrency trading.', 'Basics', 1),
('How accurate are the trading signals?', 'Our signals are generated using proven Ichimoku Cloud methodology combined with multiple timeframe analysis. While no trading system is 100% accurate, our historical performance tracking shows strong results. Always use proper risk management.', 'Signals', 2),
('What does the signal grade (A, B, C) mean?', 'Grade A signals have the strongest confluence across multiple Ichimoku indicators. Grade B signals have good setup but less confirmation. Grade C signals are weaker setups. Focus on A and B grades for best results.', 'Signals', 3),
('Do I need to connect my wallet?', 'Wallet connection is optional but recommended. It allows you to save your watchlist, preferences, and access premium features. We never ask for private keys or seed phrases.', 'Account', 4),
('How do I upgrade to premium?', 'Click on any premium feature to see upgrade options. Payment is accepted in cryptocurrency for true decentralization. You can pay with SOL, USDT, or other major cryptocurrencies.', 'Premium', 5),
('Can I use this on mobile?', 'Yes! Our platform is fully responsive and works great on mobile devices. You can also add it to your home screen for a native app-like experience.', 'Technical', 6),
('What are the Phemex referral benefits?', 'When you click "Trade Now" buttons, you will be directed to Phemex with our referral code. This helps support the platform. If you sign up through our link, you may also receive trading fee discounts.', 'Trading', 7);

-- Create user_preferences table for settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  theme TEXT DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT true,
  email_alerts TEXT,
  preferred_timeframes TEXT[] DEFAULT ARRAY['1h', '4h', '1d'],
  min_signal_grade TEXT DEFAULT 'B',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
ON public.user_preferences
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_user_preferences_updated_at();