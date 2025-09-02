export interface IchimokuData {
  tenkan: number;
  kijun: number;
  senkouA: number;
  senkouB: number;
  chikou: number;
  chikouCompare: number;
  currentPrice: number;
}

export interface TradingSignal {
  symbol: string;
  currentPrice: number;
  signal: 'Long Signal' | 'Short Signal' | 'Neutral';
  cloudStatus: string;
  tkCross: string;
  chikouSpanStatus: string;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}