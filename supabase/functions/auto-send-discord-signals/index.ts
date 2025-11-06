import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KlineData {
  time: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

interface IchimokuValues {
  tenkanSen: number;
  kijunSen: number;
  senkouSpanA: number;
  senkouSpanB: number;
  chikouSpan: number;
}

interface TradingSignal {
  symbol: string;
  signal: string;
  signalGrade: string;
  currentPrice: number;
  cloudStatus: string;
  tkCross: string;
  chikouSpanStatus: string;
  rsi: number;
  signalStrength: number;
  priceChangePercent24h?: number;
  volume24h?: number;
}

// Calculate Ichimoku Cloud components
function calculateIchimoku(data: KlineData[]): IchimokuValues {
  const prices = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  
  // Tenkan-sen (Conversion Line): (9-period high + 9-period low)/2
  const tenkanPeriod = 9;
  const tenkanHigh = Math.max(...highs.slice(-tenkanPeriod));
  const tenkanLow = Math.min(...lows.slice(-tenkanPeriod));
  const tenkanSen = (tenkanHigh + tenkanLow) / 2;
  
  // Kijun-sen (Base Line): (26-period high + 26-period low)/2
  const kijunPeriod = 26;
  const kijunHigh = Math.max(...highs.slice(-kijunPeriod));
  const kijunLow = Math.min(...lows.slice(-kijunPeriod));
  const kijunSen = (kijunHigh + kijunLow) / 2;
  
  // Senkou Span A (Leading Span A): (Tenkan-sen + Kijun-sen)/2
  const senkouSpanA = (tenkanSen + kijunSen) / 2;
  
  // Senkou Span B (Leading Span B): (52-period high + 52-period low)/2
  const senkouPeriod = 52;
  const senkouHigh = Math.max(...highs.slice(-senkouPeriod));
  const senkouLow = Math.min(...lows.slice(-senkouPeriod));
  const senkouSpanB = (senkouHigh + senkouLow) / 2;
  
  // Chikou Span (Lagging Span): Current closing price
  const chikouSpan = prices[prices.length - 1];
  
  return {
    tenkanSen,
    kijunSen,
    senkouSpanA,
    senkouSpanB,
    chikouSpan
  };
}

// Calculate RSI
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Fetch historical data with multiple fallbacks
async function fetchHistoricalData(symbol: string): Promise<KlineData[]> {
  const baseCurrency = symbol.replace('USDT', '');
  const limit = 100;
  
  // Strategy 1: Try CryptoCompare API first (free, no auth)
  try {
    console.log(`Trying CryptoCompare for ${symbol}...`);
    const ccUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${baseCurrency}&tsym=USDT&limit=${limit}`;
    const ccResponse = await fetch(ccUrl);
    
    if (ccResponse.ok) {
      const ccData = await ccResponse.json();
      
      if (ccData.Response === 'Success' && ccData.Data?.Data) {
        console.log(`✅ CryptoCompare: Retrieved ${ccData.Data.Data.length} candles for ${symbol}`);
        return ccData.Data.Data.map((candle: any) => ({
          time: candle.time * 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volumeto || 0
        }));
      }
    }
  } catch (error) {
    console.warn(`CryptoCompare failed for ${symbol}:`, error);
  }
  
  // Strategy 2: Fallback to Binance
  try {
    console.log(`Trying Binance for ${symbol}...`);
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=4h&limit=${limit}`;
    const binanceResponse = await fetch(binanceUrl);
    
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json();
      console.log(`✅ Binance: Retrieved ${binanceData.length} candles for ${symbol}`);
      return binanceData.map((candle: any) => ({
        time: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5])
      }));
    }
  } catch (error) {
    console.warn(`Binance failed for ${symbol}:`, error);
  }
  
  throw new Error(`All API sources failed for ${symbol}`);
}

// Generate trading signal
function generateSignal(symbol: string, data: KlineData[]): TradingSignal | null {
  const ichimoku = calculateIchimoku(data);
  const prices = data.map(d => d.close);
  const currentPrice = prices[prices.length - 1];
  const rsi = calculateRSI(prices);
  
  // Determine cloud status
  const cloudTop = Math.max(ichimoku.senkouSpanA, ichimoku.senkouSpanB);
  const cloudBottom = Math.min(ichimoku.senkouSpanA, ichimoku.senkouSpanB);
  
  let cloudStatus: string;
  if (currentPrice > cloudTop) {
    cloudStatus = 'Above Cloud';
  } else if (currentPrice < cloudBottom) {
    cloudStatus = 'Below Cloud';
  } else {
    cloudStatus = 'In Cloud';
  }
  
  // Determine TK Cross
  const tkCross = ichimoku.tenkanSen > ichimoku.kijunSen ? 'Bullish Cross' : 
                  ichimoku.tenkanSen < ichimoku.kijunSen ? 'Bearish Cross' : 'No Cross';
  
  // Determine Chikou Span status
  const chikouSpanStatus = ichimoku.chikouSpan > prices[prices.length - 26] ? 'Above' :
                           ichimoku.chikouSpan < prices[prices.length - 26] ? 'Below' : 'Equal';
  
  // Determine signal
  let signal = 'Neutral';
  let signalGrade = 'C';
  let signalStrength = 0;
  
  const bullishConditions = [
    cloudStatus === 'Above Cloud',
    tkCross === 'Bullish Cross',
    chikouSpanStatus === 'Above'
  ];
  
  const bearishConditions = [
    cloudStatus === 'Below Cloud',
    tkCross === 'Bearish Cross',
    chikouSpanStatus === 'Below'
  ];
  
  const bullishCount = bullishConditions.filter(Boolean).length;
  const bearishCount = bearishConditions.filter(Boolean).length;
  
  if (bullishCount >= 2) {
    signal = 'Long Signal';
    signalStrength = (bullishCount / 3) * 100;
    if (bullishCount === 3) {
      signalGrade = 'A';
    } else {
      signalGrade = 'B';
    }
  } else if (bearishCount >= 2) {
    signal = 'Short Signal';
    signalStrength = (bearishCount / 3) * 100;
    if (bearishCount === 3) {
      signalGrade = 'A';
    } else {
      signalGrade = 'B';
    }
  }
  
  // Calculate 24h price change
  const priceChangePercent24h = ((currentPrice - data[data.length - 7].close) / data[data.length - 7].close) * 100;
  const volume24h = data.slice(-6).reduce((sum, d) => sum + d.volume, 0);
  
  return {
    symbol,
    signal,
    signalGrade,
    currentPrice,
    cloudStatus,
    tkCross,
    chikouSpanStatus,
    rsi,
    signalStrength,
    priceChangePercent24h,
    volume24h
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Starting automated signal scan...');
    
    // Get current week number and year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const year = now.getFullYear();
    
    console.log(`Current week: ${weekNumber}, Year: ${year}`);
    
    // Check how many signals sent this week
    const { data: sentThisWeek, error: countError } = await supabase
      .from('automated_discord_signals')
      .select('id')
      .eq('week_number', weekNumber)
      .eq('year', year);
    
    if (countError) {
      throw new Error(`Error checking weekly count: ${countError.message}`);
    }
    
    const sentCount = sentThisWeek?.length || 0;
    console.log(`Signals sent this week: ${sentCount}/5`);
    
    if (sentCount >= 5) {
      console.log('Weekly limit reached (5 signals), skipping...');
      return new Response(
        JSON.stringify({ message: 'Weekly limit reached', sentThisWeek: sentCount }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get top trading pairs from Binance
    const tickerResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const tickers = await tickerResponse.json();
    
    // Filter for USDT pairs with good volume
    const usdtPairs = tickers
      .filter((t: any) => t.symbol.endsWith('USDT') && parseFloat(t.quoteVolume) > 10000000)
      .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 50)
      .map((t: any) => t.symbol);
    
    console.log(`Scanning ${usdtPairs.length} trading pairs...`);
    
    // Scan for B-grade signals
    const bGradeSignals: TradingSignal[] = [];
    
    for (const symbol of usdtPairs) {
      try {
        const data = await fetchHistoricalData(symbol);
        const signal = generateSignal(symbol, data);
        
        if (signal && signal.signalGrade === 'B' && signal.signal !== 'Neutral') {
          bGradeSignals.push(signal);
          console.log(`Found B-grade signal: ${symbol} - ${signal.signal} (${signal.signalStrength}%)`);
        }
      } catch (error) {
        console.error(`Error scanning ${symbol}:`, error);
      }
    }
    
    console.log(`Found ${bGradeSignals.length} B-grade signals`);
    
    if (bGradeSignals.length === 0) {
      console.log('No B-grade signals found');
      return new Response(
        JSON.stringify({ message: 'No B-grade signals found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Pick the strongest signal
    const strongestSignal = bGradeSignals.reduce((prev, current) => 
      (current.signalStrength > prev.signalStrength) ? current : prev
    );
    
    console.log(`Strongest signal: ${strongestSignal.symbol} - ${strongestSignal.signal} (${strongestSignal.signalStrength}%)`);
    
    // Send to Discord
    const color = strongestSignal.signal === 'Long Signal' ? 0x90ee90 : 0xffa07a;
    const strengthBar = '█'.repeat(Math.floor(strongestSignal.signalStrength / 10)) + 
                        '░'.repeat(10 - Math.floor(strongestSignal.signalStrength / 10)) + 
                        ` ${strongestSignal.signalStrength.toFixed(0)}%`;
    
    const embed = {
      title: `🤖 Automated ${strongestSignal.signal} - Grade ${strongestSignal.signalGrade}`,
      description: `**${strongestSignal.symbol}** daily signal (${sentCount + 1}/5 this week)`,
      color: color,
      fields: [
        { name: '💰 Current Price', value: `$${strongestSignal.currentPrice.toFixed(8)}`, inline: true },
        { name: '📊 Signal Grade', value: strongestSignal.signalGrade, inline: true },
        { name: '🎚️ Signal Strength', value: strengthBar, inline: false },
        { name: '☁️ Cloud Status', value: strongestSignal.cloudStatus, inline: true },
        { name: '⚡ TK Cross', value: strongestSignal.tkCross, inline: true },
        { name: '📈 Chikou Span', value: strongestSignal.chikouSpanStatus, inline: true },
        { name: '🎲 RSI', value: strongestSignal.rsi.toFixed(2), inline: true },
        { name: '📉 24h Change', value: `${strongestSignal.priceChangePercent24h! > 0 ? '+' : ''}${strongestSignal.priceChangePercent24h!.toFixed(2)}%`, inline: true },
        { name: '\u200B', value: '\u200B', inline: false },
        { name: '⭐ Upgrade to Grade A Signals!', value: '🔥 **Get premium Grade A signals** with the highest accuracy and multi-timeframe analysis!\n[**Sign Up Now →**](https://blktrading.group/subscribe)', inline: false }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'B.L.K. Automated Signal • 6am PT Daily' }
    };
    
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
    
    if (!discordResponse.ok) {
      throw new Error(`Discord API error: ${discordResponse.status}`);
    }
    
    console.log('Signal sent to Discord successfully');
    
    // Log to database
    const { error: insertError } = await supabase
      .from('automated_discord_signals')
      .insert({
        symbol: strongestSignal.symbol,
        signal_type: strongestSignal.signal,
        signal_grade: strongestSignal.signalGrade,
        signal_strength: strongestSignal.signalStrength,
        current_price: strongestSignal.currentPrice,
        week_number: weekNumber,
        year: year
      });
    
    if (insertError) {
      console.error('Error logging to database:', insertError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        signal: strongestSignal,
        sentThisWeek: sentCount + 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in auto-send-discord-signals:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
