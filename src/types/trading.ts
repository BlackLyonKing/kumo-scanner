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
  priceChange24h?: number;
  priceChangePercent24h?: number;
  volume24h?: number;
  signalStrength?: number; // 0-100 confidence level
  chartData?: ChartDataPoint[];
  ichimokuData?: IchimokuChartData;
}

export interface ChartDataPoint extends CandleData {
  tenkan?: number;
  kijun?: number;
  senkouA?: number;
  senkouB?: number;
  chikou?: number;
  rsi?: number;
  volume?: number;
}

export interface IchimokuChartData {
  tenkanSen: number[];
  kijunSen: number[];
  senkouSpanA: number[];
  senkouSpanB: number[];
  chikouSpan: number[];
  timestamps: number[];
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}