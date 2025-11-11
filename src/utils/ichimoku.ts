import { CandleData, IchimokuData, TradingSignal, ChartDataPoint } from "@/types/trading";
import { monitoredFetch, fetchWithRetry } from "@/utils/apiMonitoring";

// Constants for Ichimoku calculations
export const TENKAN_PERIOD = 9;
export const KIJUN_PERIOD = 26;
export const SENKOU_PERIOD = 52;
export const CHIKOU_PERIOD = 26;
export const RSI_PERIOD = 14;

// API configuration for multiple exchanges
const CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com/data/v2/histohour';
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';
const BINANCE_SYMBOLS_URL = 'https://api.binance.com/api/v3/exchangeInfo';
const BINANCE_FUTURES_URL = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
const PHEMEX_SYMBOLS_URL = 'https://api.phemex.com/exchange/public/products';
const BLOFIN_API_URL = 'https://openapi.blofin.com';

// Browser CORS proxy fallback for Phemex (their API often blocks browser origins)
const CORS_PROXY = 'https://corsproxy.io/?';
const withProxy = (url: string) => `${CORS_PROXY}${encodeURIComponent(url)}`;


// Rate limiting for API calls
class RateLimiter {
  private lastCallTime = 0;
  private minInterval = 300; // 300ms between calls (more conservative)
  
  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      const delay = this.minInterval - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastCallTime = Date.now();
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

export let SYMBOLS: string[] = [];

// Configuration for different base currencies and limits
export interface ScanConfig {
  baseCurrencies: string[];
  maxSymbols: number;
  includeStablecoins?: boolean;
  exchanges?: string[];
  futuresOnly?: boolean;
}

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
  baseCurrencies: ['USDT'],
  maxSymbols: 50,
  includeStablecoins: false,
  exchanges: ['binance'],
  futuresOnly: false
};

export async function getUsdtSymbols(): Promise<string[]> {
  return getTradingSymbols(DEFAULT_SCAN_CONFIG);
}

// Get Binance futures symbols
async function getBinanceFuturesSymbols(config: ScanConfig): Promise<string[]> {
  try {
    const response = await fetch(BINANCE_FUTURES_URL);
    const data = await response.json();
    
    if (response.ok) {
      return data.symbols
        .filter((symbol: any) => {
          const isTrading = symbol.status === 'TRADING';
          const isContract = symbol.contractType === 'PERPETUAL';
          const hasBaseCurrency = config.baseCurrencies.includes(symbol.quoteAsset);
          
          if (!config.includeStablecoins) {
            const stablecoins = ['USDC', 'BUSD', 'DAI', 'TUSD', 'PAX', 'USDD'];
            const isStablecoin = stablecoins.some(stable => symbol.baseAsset === stable);
            return isTrading && isContract && hasBaseCurrency && !isStablecoin;
          }
          
          return isTrading && isContract && hasBaseCurrency;
        })
        .map((symbol: any) => symbol.symbol)
        .sort();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch Binance futures symbols:', error);
    return [];
  }
}

// Get Binance spot symbols
async function getBinanceSpotSymbols(config: ScanConfig): Promise<string[]> {
  try {
    const response = await fetch(BINANCE_SYMBOLS_URL);
    const data = await response.json();
    
    if (response.ok) {
      return data.symbols
        .filter((symbol: any) => {
          const isTrading = symbol.status === 'TRADING';
          const hasBaseCurrency = config.baseCurrencies.includes(symbol.quoteAsset);
          
          if (!config.includeStablecoins) {
            const stablecoins = ['USDC', 'BUSD', 'DAI', 'TUSD', 'PAX', 'USDD'];
            const isStablecoin = stablecoins.some(stable => symbol.baseAsset === stable);
            return isTrading && hasBaseCurrency && !isStablecoin;
          }
          
          return isTrading && hasBaseCurrency;
        })
        .map((symbol: any) => symbol.symbol)
        .sort();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch Binance spot symbols:', error);
    return [];
  }
}

// Get Phemex symbols (futures) - Enhanced with better error handling and debugging
async function getPhemexSymbols(config: ScanConfig): Promise<string[]> {
  try {
    console.log('🔄 Fetching Phemex symbols...', { config });
    
    const response = await fetchWithRetry(withProxy(PHEMEX_SYMBOLS_URL), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }, 3, 1000); // 3 retries with 1 second base delay
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error('❌ Phemex API HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 200)
      });
      throw new Error(`Phemex API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Phemex API response structure:', {
      hasData: !!data.data,
      dataLength: data.data?.length || 0,
      sampleProduct: data.data?.[0]
    });
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('⚠️ Invalid Phemex API response structure:', data);
      return [];
    }
    
    // Filter and process products with enhanced logging
    const allProducts = data.data;
    console.log(`📋 Total Phemex products: ${allProducts.length}`);
    
    const filteredProducts = allProducts.filter((product: any) => {
      const rawStatus = product.status;
      const isActive = rawStatus ? (String(rawStatus).toLowerCase() === 'listed' || String(rawStatus).toLowerCase() === 'trading') : true;
      const isFutures = product.type === 'Perpetual';
      const quoteCurrency = product.quoteCurrency;
      const baseCurrency = product.baseCurrency;
      
      // Log a few sample products for debugging
      if (allProducts.indexOf(product) < 3) {
        console.log('🔍 Sample product:', {
          symbol: product.symbol,
          status: product.status,
          type: product.type,
          quoteCurrency,
          baseCurrency,
          isActive,
          isFutures
        });
      }
      
      // Enhanced base currency matching
      const hasBaseCurrency = config.baseCurrencies.some(base => 
        quoteCurrency === base || (base === 'USDT' && quoteCurrency === 'USD')
      );
      
      if (!config.includeStablecoins) {
        const stablecoins = ['USDC', 'BUSD', 'DAI', 'TUSD', 'PAX', 'USDD', 'FDUSD'];
        const isStablecoin = stablecoins.some(stable => baseCurrency === stable);
        return isActive && isFutures && hasBaseCurrency && !isStablecoin;
      }
      
      return isActive && isFutures && hasBaseCurrency;
    });
    
    console.log(`✅ Filtered products: ${filteredProducts.length} from ${allProducts.length}`);
    
    const symbols = filteredProducts
      .map((product: any) => {
        // Keep original Phemex symbol format for proper API compatibility
        const originalSymbol = product.symbol;
        
        // For internal consistency, we can normalize but keep track of original
        let normalizedSymbol = originalSymbol;
        
        // Only normalize if absolutely necessary for display
        if (false && originalSymbol.endsWith('USD') && !originalSymbol.endsWith('USDT')) {
          // For display purposes, convert USD to USDT but keep original for API calls
          normalizedSymbol = originalSymbol.replace(/USD$/, 'USDT');
        }
        
        return normalizedSymbol;
      })
      .sort();
    
    console.log(`✅ Retrieved ${symbols.length} Phemex symbols:`, symbols.slice(0, 10));
    return symbols;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        console.error('Phemex API request timeout');
      } else if (error.name === 'AbortError') {
        console.error('Phemex API request aborted');
      } else {
        console.error('Failed to fetch Phemex symbols:', error.message);
      }
    } else {
      console.error('Unknown error fetching Phemex symbols:', error);
    }
    return [];
  }
}

export async function getTradingSymbols(config: ScanConfig = DEFAULT_SCAN_CONFIG): Promise<string[]> {
  let allSymbols: string[] = [];
  
  try {
    const exchanges = config.exchanges || ['binance'];
    console.log('🔄 Fetching symbols for exchanges:', exchanges);
    
    for (const exchange of exchanges) {
      let exchangeSymbols: string[] = [];
      
      console.log(`📡 Processing exchange: ${exchange}`);
      
      try {
        switch (exchange) {
          case 'binance':
            if (config.futuresOnly) {
              exchangeSymbols = await getBinanceFuturesSymbols(config);
            } else {
              exchangeSymbols = await getBinanceSpotSymbols(config);
            }
            break;
          case 'binance-futures':
            exchangeSymbols = await getBinanceFuturesSymbols(config);
            break;
          case 'phemex':
            exchangeSymbols = await getPhemexSymbols(config);
            break;
          default:
            console.warn(`⚠️ Unknown exchange: ${exchange}`);
        }
        
        console.log(`✅ ${exchange}: Retrieved ${exchangeSymbols.length} symbols`);
        allSymbols.push(...exchangeSymbols);
        
      } catch (exchangeError) {
        console.error(`❌ Error fetching symbols from ${exchange}:`, exchangeError);
        // Continue with other exchanges even if one fails
        continue;
      }
    }
    
    // Remove duplicates and sort
    const uniqueSymbols = [...new Set(allSymbols)].sort();
    console.log(`🔄 Total unique symbols: ${uniqueSymbols.length}`);
    
    // Apply symbol limit
    let symbols = uniqueSymbols;
    if (config.maxSymbols > 0) {
      symbols = symbols.slice(0, config.maxSymbols);
      console.log(`📊 Limited to ${symbols.length} symbols (max: ${config.maxSymbols})`);
    }
    
    SYMBOLS.length = 0;
    SYMBOLS.push(...symbols);
    
    console.log('✅ Final symbol list ready:', { count: symbols.length, sample: symbols.slice(0, 5) });
    return symbols;
    
  } catch (error) {
    console.error('❌ Failed to fetch symbol list:', error);
    return [];
  }
}

// Preset configurations for different scan types
export const SCAN_PRESETS: Record<string, ScanConfig> = {
  usdt_only: {
    baseCurrencies: ['USDT'],
    maxSymbols: 50,
    includeStablecoins: false,
    exchanges: ['binance']
  },
  major_pairs: {
    baseCurrencies: ['USDT', 'BTC', 'ETH'],
    maxSymbols: 100,
    includeStablecoins: false,
    exchanges: ['binance']
  },
  comprehensive: {
    baseCurrencies: ['USDT', 'BTC', 'ETH', 'BNB'],
    maxSymbols: 200,
    includeStablecoins: true,
    exchanges: ['binance']
  },
  binance_futures_all: {
    baseCurrencies: ['USDT'],
    maxSymbols: 300,
    includeStablecoins: false,
    exchanges: ['binance-futures'],
    futuresOnly: true
  },
  phemex_futures_all: {
    baseCurrencies: ['USDT', 'USD'],
    maxSymbols: 200,
    includeStablecoins: false,
    exchanges: ['phemex'],
    futuresOnly: true
  },
  all_futures_combined: {
    baseCurrencies: ['USDT', 'USD'],
    maxSymbols: 500,
    includeStablecoins: false,
    exchanges: ['binance-futures', 'phemex'],
    futuresOnly: true
  },
  btc_pairs: {
    baseCurrencies: ['BTC'],
    maxSymbols: 50,
    includeStablecoins: false,
    exchanges: ['binance']
  },
  eth_pairs: {
    baseCurrencies: ['ETH'],
    maxSymbols: 50,
    includeStablecoins: false,
    exchanges: ['binance']
  }
};

export async function fetchHistoricalData(symbol: string, interval: string = '1d'): Promise<CandleData[] | null> {
  const limit = SENKOU_PERIOD + CHIKOU_PERIOD + RSI_PERIOD + 20;
  
  // Extract base and quote currency from symbol
  const baseCurrency = symbol.replace('USDT', '').replace('USD', '');
  const quoteCurrency = symbol.includes('USDT') ? 'USDT' : 'USD';
  
  try {
    // Apply rate limiting to prevent API abuse
    await rateLimiter.throttle();
    
    // Strategy 1: Try CryptoCompare API first (free, reliable, no auth needed)
    try {
      console.log(`📊 Trying CryptoCompare API for ${symbol}...`);
      const ccResponse = await fetchWithRetry(
        `${CRYPTOCOMPARE_API_URL}?fsym=${baseCurrency}&tsym=${quoteCurrency}&limit=${limit}`,
        { method: 'GET' },
        2, 1000
      );
      
      if (ccResponse.ok) {
        const ccData = await ccResponse.json();
        
        if (ccData.Response === 'Success' && ccData.Data?.Data) {
          console.log(`✅ CryptoCompare: Retrieved ${ccData.Data.Data.length} candles for ${symbol}`);
          
          return ccData.Data.Data.map((candle: any) => ({
            timestamp: candle.time * 1000, // Convert to milliseconds
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volumeto || 0
          }));
        }
      }
    } catch (ccError) {
      console.warn(`⚠️ CryptoCompare failed for ${symbol}, trying Binance...`);
    }
    
    // Strategy 2: Fallback to Binance API
    const isPhemexSymbol = symbol.includes('USD') && !symbol.includes('USDT');
    
    if (!isPhemexSymbol) {
      try {
        console.log(`📈 Trying Binance API for ${symbol}...`);
        const binanceUrl = `${BINANCE_API_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        
        const binanceResponse = await fetchWithRetry(binanceUrl, { method: 'GET' }, 3, 2000);
        
        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json();
          console.log(`✅ Binance: Retrieved ${binanceData.length} candles for ${symbol}`);
          
          return binanceData.map((row: any[]) => ({
            timestamp: row[0],
            open: parseFloat(row[1]),
            high: parseFloat(row[2]),
            low: parseFloat(row[3]),
            close: parseFloat(row[4]),
            volume: parseFloat(row[5])
          }));
        }
      } catch (binanceError) {
        console.warn(`⚠️ Binance failed for ${symbol}, trying Phemex...`);
      }
    }
    
    // Strategy 3: Fallback to Phemex API for USD symbols
    if (isPhemexSymbol || quoteCurrency === 'USD') {
      try {
        const phemexSymbol = symbol.replace('USDT', 'USD');
        const phemexInterval = interval === '1d' ? '86400' : (interval === '4h' ? '14400' : '3600');
        
        console.log(`📈 Trying Phemex API for ${phemexSymbol}...`);
        
        const phemexResponse = await fetchWithRetry(
          withProxy(`https://api.phemex.com/md/kline?symbol=${phemexSymbol}&resolution=${phemexInterval}&limit=${limit}`),
          { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          },
          3, 2000
        );
        
        if (phemexResponse.ok) {
          const phemexData = await phemexResponse.json();
          
          if (phemexData.data?.rows && Array.isArray(phemexData.data.rows)) {
            console.log(`✅ Phemex: Retrieved ${phemexData.data.rows.length} candles for ${phemexSymbol}`);
            
            return phemexData.data.rows.map((row: any[]) => ({
              timestamp: row[0] * 1000,
              open: row[1] / Math.pow(10, 8),
              high: row[2] / Math.pow(10, 8),
              low: row[3] / Math.pow(10, 8),
              close: row[4] / Math.pow(10, 8),
              volume: row[5] || 0
            }));
          }
        }
      } catch (phemexError) {
        console.warn(`⚠️ Phemex failed for ${symbol}, trying BloFin...`);
      }
    }

    // Strategy 4: Try BloFin as final fallback
    try {
      const blofinSymbol = symbol.replace('USDT', '-USDT');
      const blofinInterval = interval === '1d' ? '1D' : (interval === '4h' ? '4H' : '1H');
      
      console.log(`📈 Trying BloFin API for ${blofinSymbol}...`);
      
      const blofinResponse = await fetchWithRetry(
        `${BLOFIN_API_URL}/api/v1/market/candles?instId=${blofinSymbol}&bar=${blofinInterval}&limit=${limit}`,
        { method: 'GET' },
        2, 1000
      );
      
      if (blofinResponse.ok) {
        const blofinData = await blofinResponse.json();
        
        if (blofinData.code === '0' && blofinData.data && Array.isArray(blofinData.data)) {
          console.log(`✅ BloFin: Retrieved ${blofinData.data.length} candles for ${blofinSymbol}`);
          
          return blofinData.data.map((candle: any[]) => ({
            timestamp: parseInt(candle[0]),
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]) || 0
          }));
        }
      }
    } catch (blofinError) {
      console.error(`❌ All API sources failed for ${symbol}`);
    }
    
    console.error(`❌ No data sources available for ${symbol}`);
    return null;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        console.error(`⏱️ Timeout fetching data for ${symbol} (${interval})`);
      } else {
        console.error(`❌ Error fetching data for ${symbol} (${interval}):`, error.message);
      }
    } else {
      console.error(`❌ Unknown error fetching data for ${symbol} (${interval}):`, error);
    }
    return null;
  }
}

export async function fetchEnhancedHistoricalData(symbol: string, interval: string = '1d'): Promise<ChartDataPoint[] | null> {
  const limit = Math.max(SENKOU_PERIOD + CHIKOU_PERIOD + RSI_PERIOD + 30, 100); // Get more data for charts
  const url = `${BINANCE_API_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      const candleData: CandleData[] = data.map((row: any[]) => ({
        timestamp: row[0],
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4]),
        volume: parseFloat(row[5])
      }));

      // Calculate Ichimoku indicators for each point
      const chartData: ChartDataPoint[] = candleData.map((candle, index) => {
        if (index < SENKOU_PERIOD) {
          return { ...candle };
        }

        const dataSlice = candleData.slice(0, index + 1);
        const highs = dataSlice.map(d => d.high);
        const lows = dataSlice.map(d => d.low);
        const closes = dataSlice.map(d => d.close);

        const getHighestHigh = (arr: number[], periods: number) => 
          Math.max(...arr.slice(-Math.min(periods, arr.length)));
        const getLowestLow = (arr: number[], periods: number) => 
          Math.min(...arr.slice(-Math.min(periods, arr.length)));

        // Calculate Ichimoku components
        const tenkan = index >= TENKAN_PERIOD ? 
          (getHighestHigh(highs, TENKAN_PERIOD) + getLowestLow(lows, TENKAN_PERIOD)) / 2 : undefined;
        
        const kijun = index >= KIJUN_PERIOD ? 
          (getHighestHigh(highs, KIJUN_PERIOD) + getLowestLow(lows, KIJUN_PERIOD)) / 2 : undefined;

        const senkouA = tenkan && kijun ? (tenkan + kijun) / 2 : undefined;
        
        const senkouB = index >= SENKOU_PERIOD ? 
          (getHighestHigh(highs, SENKOU_PERIOD) + getLowestLow(lows, SENKOU_PERIOD)) / 2 : undefined;

        const chikou = index >= CHIKOU_PERIOD ? closes[index - CHIKOU_PERIOD] : undefined;

        // RSI calculation for last 14 periods
        let rsi: number | undefined;
        if (index >= RSI_PERIOD) {
          const rsiData = dataSlice.slice(index - RSI_PERIOD, index + 1);
          let gains = 0;
          let losses = 0;
          
          for (let i = 1; i < rsiData.length; i++) {
            const change = rsiData[i].close - rsiData[i-1].close;
            if (change > 0) {
              gains += change;
            } else {
              losses -= change;
            }
          }

          const avgGain = gains / RSI_PERIOD;
          const avgLoss = losses / RSI_PERIOD;
          const rs = avgGain / avgLoss;
          rsi = 100 - (100 / (1 + rs));
          rsi = isNaN(rsi) ? 50 : rsi;
        }

        return {
          ...candle,
          tenkan,
          kijun,
          senkouA,
          senkouB,
          chikou,
          rsi
        };
      });

      return chartData;
    } else {
      console.error(`Error fetching enhanced data for ${symbol} (${interval}):`, data);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch enhanced data for ${symbol} (${interval}):`, error);
    return null;
  }
}

export function calculateIchimokuAndRSI(data: CandleData[]): IchimokuData {
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const closes = data.map(d => d.close);
  
  const getHighestHigh = (arr: number[], periods: number) => 
    Math.max(...arr.slice(-periods));
  const getLowestLow = (arr: number[], periods: number) => 
    Math.min(...arr.slice(-periods));

  // Tenkan-sen
  const tenkan = (getHighestHigh(highs, TENKAN_PERIOD) + getLowestLow(lows, TENKAN_PERIOD)) / 2;
  
  // Kijun-sen
  const kijun = (getHighestHigh(highs, KIJUN_PERIOD) + getLowestLow(lows, KIJUN_PERIOD)) / 2;

  // Senkou Span A
  const senkouA = (tenkan + kijun) / 2;
  
  // Senkou Span B
  const senkouB = (getHighestHigh(highs, SENKOU_PERIOD) + getLowestLow(lows, SENKOU_PERIOD)) / 2;

  // Chikou Span
  const chikou = closes[closes.length - 1];
  const chikouCompare = closes[closes.length - 1 - CHIKOU_PERIOD];

  // RSI calculation
  const rsiData = data.slice(-RSI_PERIOD - 1);
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < rsiData.length; i++) {
    const change = rsiData[i].close - rsiData[i-1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  const avgGain = gains / RSI_PERIOD;
  const avgLoss = losses / RSI_PERIOD;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return {
    tenkan,
    kijun,
    senkouA,
    senkouB,
    chikou,
    chikouCompare,
    currentPrice: closes[closes.length - 1],
    rsi: isNaN(rsi) ? 50 : rsi
  };
}

export function generateTradingSignal(
  symbol: string, 
  dailyIchimoku: IchimokuData, 
  fourHourIchimoku: IchimokuData,
  priceChange24h?: number,
  volume24h?: number
): TradingSignal {
  let signal: 'Long Signal' | 'Short Signal' | 'Neutral' = 'Neutral';
  let signalGrade: 'A' | 'B' | 'C' = 'C';
  let cloudStatus = '';
  let tkCross = '';
  let chikouSpanStatus = '';

  // Check Cloud Status
  if (dailyIchimoku.currentPrice > Math.max(dailyIchimoku.senkouA, dailyIchimoku.senkouB)) {
    cloudStatus = 'Above Cloud';
  } else if (dailyIchimoku.currentPrice < Math.min(dailyIchimoku.senkouA, dailyIchimoku.senkouB)) {
    cloudStatus = 'Below Cloud';
  } else {
    cloudStatus = 'In Cloud';
  }

  // Check Tenkan/Kijun Cross
  if (dailyIchimoku.tenkan > dailyIchimoku.kijun) {
    tkCross = 'Bullish Cross';
  } else if (dailyIchimoku.tenkan < dailyIchimoku.kijun) {
    tkCross = 'Bearish Cross';
  } else {
    tkCross = 'No Cross';
  }

  // Check Chikou Span Status
  if (dailyIchimoku.chikou > dailyIchimoku.chikouCompare) {
    chikouSpanStatus = 'Above';
  } else if (dailyIchimoku.chikou < dailyIchimoku.chikouCompare) {
    chikouSpanStatus = 'Below';
  } else {
    chikouSpanStatus = 'Equal';
  }

  // Higher timeframe trend analysis
  const higherTimeframeTrend = fourHourIchimoku.currentPrice > Math.max(fourHourIchimoku.senkouA, fourHourIchimoku.senkouB) ? 'Bullish' : 
                               fourHourIchimoku.currentPrice < Math.min(fourHourIchimoku.senkouA, fourHourIchimoku.senkouB) ? 'Bearish' : 'Neutral';

  // RSI conditions
  const isRsiBullish = dailyIchimoku.rsi > 50 && dailyIchimoku.rsi < 70;
  const isRsiBearish = dailyIchimoku.rsi < 50 && dailyIchimoku.rsi > 30;

  // Generate Signal and Grade based on confluence
  if (cloudStatus === 'Above Cloud' && tkCross === 'Bullish Cross' && chikouSpanStatus === 'Above') {
    signal = 'Long Signal';
    if (higherTimeframeTrend === 'Bullish' && isRsiBullish) {
      signalGrade = 'A';
    } else {
      signalGrade = 'B';
    }
  } else if (cloudStatus === 'Below Cloud' && tkCross === 'Bearish Cross' && chikouSpanStatus === 'Below') {
    signal = 'Short Signal';
    if (higherTimeframeTrend === 'Bearish' && isRsiBearish) {
      signalGrade = 'A';
    } else {
      signalGrade = 'B';
    }
  }

  // Calculate price change percentage
  const priceChangePercent24h = priceChange24h ? (priceChange24h / (dailyIchimoku.currentPrice - priceChange24h)) * 100 : 0;

  return {
    symbol,
    currentPrice: dailyIchimoku.currentPrice,
    signal,
    cloudStatus,
    tkCross,
    chikouSpanStatus,
    rsi: dailyIchimoku.rsi,
    signalGrade,
    priceChange24h,
    priceChangePercent24h,
    volume24h
  };
}

// Notification function
export function sendNotification(symbol: string, signal: string) {
  if (Notification.permission === "granted") {
    new Notification('Ichimoku Signal Found!', {
      body: `A Grade A ${signal} has been found for ${symbol}.`,
      icon: '/favicon.ico'
    });
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return Promise.reject("This browser does not support desktop notifications.");
  }
  return Notification.requestPermission();
}