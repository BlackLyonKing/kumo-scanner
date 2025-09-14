import { CandleData, IchimokuData, TradingSignal, ChartDataPoint } from "@/types/trading";

// Constants for Ichimoku calculations
export const TENKAN_PERIOD = 9;
export const KIJUN_PERIOD = 26;
export const SENKOU_PERIOD = 52;
export const CHIKOU_PERIOD = 26;
export const RSI_PERIOD = 14;

// API configuration for multiple exchanges
const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';
const BINANCE_SYMBOLS_URL = 'https://api.binance.com/api/v3/exchangeInfo';
const BINANCE_FUTURES_URL = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
const PHEMEX_SYMBOLS_URL = 'https://api.phemex.com/exchange/public/products';

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

// Get Phemex symbols (futures)
async function getPhemexSymbols(config: ScanConfig): Promise<string[]> {
  try {
    const response = await fetch(PHEMEX_SYMBOLS_URL);
    const data = await response.json();
    
    if (response.ok && data.data) {
      return data.data
        .filter((product: any) => {
          const isActive = product.status === 'Listed';
          const isFutures = product.type === 'Perpetual';
          const quoteCurrency = product.quoteCurrency;
          const hasBaseCurrency = config.baseCurrencies.some(base => 
            quoteCurrency === base || (base === 'USDT' && quoteCurrency === 'USD')
          );
          
          if (!config.includeStablecoins) {
            const stablecoins = ['USDC', 'BUSD', 'DAI', 'TUSD', 'PAX', 'USDD'];
            const baseCurrency = product.baseCurrency;
            const isStablecoin = stablecoins.some(stable => baseCurrency === stable);
            return isActive && isFutures && hasBaseCurrency && !isStablecoin;
          }
          
          return isActive && isFutures && hasBaseCurrency;
        })
        .map((product: any) => {
          // Convert Phemex symbol format to Binance-like format for consistency
          return product.symbol.replace('USD', 'USDT');
        })
        .sort();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch Phemex symbols:', error);
    return [];
  }
}

export async function getTradingSymbols(config: ScanConfig = DEFAULT_SCAN_CONFIG): Promise<string[]> {
  let allSymbols: string[] = [];
  
  try {
    const exchanges = config.exchanges || ['binance'];
    
    for (const exchange of exchanges) {
      let exchangeSymbols: string[] = [];
      
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
          console.warn(`Unknown exchange: ${exchange}`);
      }
      
      allSymbols.push(...exchangeSymbols);
    }
    
    // Remove duplicates and sort
    const uniqueSymbols = [...new Set(allSymbols)].sort();
    
    // Apply symbol limit
    let symbols = uniqueSymbols;
    if (config.maxSymbols > 0) {
      symbols = symbols.slice(0, config.maxSymbols);
    }
    
    SYMBOLS.length = 0;
    SYMBOLS.push(...symbols);
    return symbols;
    
  } catch (error) {
    console.error('Failed to fetch symbol list:', error);
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
  const url = `${BINANCE_API_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return data.map((row: any[]) => ({
        timestamp: row[0],
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4]),
        volume: parseFloat(row[5]) // Add volume data
      }));
    } else {
      console.error(`Error fetching data for ${symbol} (${interval}):`, data);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch data for ${symbol} (${interval}):`, error);
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