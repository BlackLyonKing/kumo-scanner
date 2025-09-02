import { CandleData, IchimokuData, TradingSignal } from "@/types/trading";

// Constants for Ichimoku calculations
export const TENKAN_PERIOD = 9;
export const KIJUN_PERIOD = 26;
export const SENKOU_PERIOD = 52;
export const CHIKOU_PERIOD = 26;

// Symbols to scan on Phemex
export const SYMBOLS = [
  'ETHUSD', 'BTCUSD', 'XRPUSD', 'SOLUSD', 'BNBUSD',
  'ADAUSD', 'DOGEUSD', 'AVAXUSD', 'LTCUSD', 'TRXUSD'
];

// CORS proxy and API configuration
const PROXY_URL = 'https://corsproxy.io/?';
const API_URL = 'https://api.phemex.com/v1/public/kline';

export async function fetchHistoricalData(symbol: string): Promise<CandleData[] | null> {
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - (SENKOU_PERIOD + CHIKOU_PERIOD + 10) * 60 * 60 * 24;
  
  const url = PROXY_URL + encodeURIComponent(`${API_URL}?symbol=${symbol}&type=1D&from=${startTime}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 0 && data.data && data.data.rows) {
      return data.data.rows.map((row: any[]) => ({
        timestamp: row[0],
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4])
      }));
    }
    
    console.error(`Error fetching data for ${symbol}:`, data);
    return null;
  } catch (error) {
    console.error(`Failed to fetch data for ${symbol}:`, error);
    return null;
  }
}

export function calculateIchimoku(data: CandleData[]): IchimokuData {
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

  return {
    tenkan,
    kijun,
    senkouA,
    senkouB,
    chikou,
    chikouCompare,
    currentPrice: closes[closes.length - 1]
  };
}

export function generateTradingSignal(symbol: string, ichimoku: IchimokuData): TradingSignal {
  let signal: 'Long Signal' | 'Short Signal' | 'Neutral' = 'Neutral';
  let cloudStatus = '';
  let tkCross = '';
  let chikouSpanStatus = '';

  // Check Cloud Status
  if (ichimoku.currentPrice > Math.max(ichimoku.senkouA, ichimoku.senkouB)) {
    cloudStatus = 'Above Cloud (Bullish)';
  } else if (ichimoku.currentPrice < Math.min(ichimoku.senkouA, ichimoku.senkouB)) {
    cloudStatus = 'Below Cloud (Bearish)';
  } else {
    cloudStatus = 'In Cloud (Neutral)';
  }

  // Check Tenkan/Kijun Cross
  if (ichimoku.tenkan > ichimoku.kijun) {
    tkCross = 'Bullish Cross';
  } else if (ichimoku.tenkan < ichimoku.kijun) {
    tkCross = 'Bearish Cross';
  } else {
    tkCross = 'No Cross';
  }

  // Check Chikou Span Status
  if (ichimoku.chikou > ichimoku.chikouCompare) {
    chikouSpanStatus = 'Above (Bullish)';
  } else if (ichimoku.chikou < ichimoku.chikouCompare) {
    chikouSpanStatus = 'Below (Bearish)';
  } else {
    chikouSpanStatus = 'Equal';
  }

  // Generate Signal based on confluence
  if (cloudStatus === 'Above Cloud (Bullish)' && tkCross === 'Bullish Cross' && chikouSpanStatus === 'Above (Bullish)') {
    signal = 'Long Signal';
  } else if (cloudStatus === 'Below Cloud (Bearish)' && tkCross === 'Bearish Cross' && chikouSpanStatus === 'Below (Bearish)') {
    signal = 'Short Signal';
  }

  return {
    symbol,
    currentPrice: ichimoku.currentPrice,
    signal,
    cloudStatus,
    tkCross,
    chikouSpanStatus
  };
}