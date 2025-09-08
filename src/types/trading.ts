export interface IchimokuData {
  tenkan: number;
  kijun: number;
  senkouA: number;
  senkouB: number;
  chikou: number;
  chikouCompare: number;
  currentPrice: number;
  rsi: number;
}

export interface TradingSignal {
  symbol: string;
  currentPrice: number;
  signal: 'Long Signal' | 'Short Signal' | 'Neutral';
  cloudStatus: string;
  tkCross: string;
  chikouSpanStatus: string;
  rsi: number;
  signalGrade: 'A' | 'B' | 'C';
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}