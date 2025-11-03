-- Create table to track automated Discord signals sent
CREATE TABLE public.automated_discord_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  signal_grade TEXT NOT NULL,
  signal_strength NUMERIC,
  current_price NUMERIC NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  discord_message_id TEXT
);

-- Enable RLS
ALTER TABLE public.automated_discord_signals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view sent signals
CREATE POLICY "Anyone can view automated signals"
ON public.automated_discord_signals
FOR SELECT
USING (true);

-- Allow system to insert signals
CREATE POLICY "System can insert automated signals"
ON public.automated_discord_signals
FOR INSERT
WITH CHECK (true);

-- Create index for efficient weekly queries
CREATE INDEX idx_automated_signals_week ON public.automated_discord_signals(year, week_number);
CREATE INDEX idx_automated_signals_sent_at ON public.automated_discord_signals(sent_at DESC);
