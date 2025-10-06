import { TradingSignal } from "./trading";

export type Timeframe = '1h' | '4h' | '1d';

export interface TimeframeSignal {
  timeframe: Timeframe;
  signal: TradingSignal;
}

export interface MultiTimeframeAnalysis {
  symbol: string;
  signals: {
    '1h': TradingSignal | null;
    '4h': TradingSignal | null;
    '1d': TradingSignal | null;
  };
  alignment: TimeframeAlignment;
  conflictWarning: string | null;
  overallStrength: number; // 0-100
  recommendation: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell' | 'conflicted';
}

export interface TimeframeAlignment {
  aligned: boolean;
  alignedTimeframes: Timeframe[];
  conflictingTimeframes: Timeframe[];
  dominantTrend: 'bullish' | 'bearish' | 'neutral';
  alignmentScore: number; // 0-100
}

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1h': '1 Hour',
  '4h': '4 Hours',
  '1d': '1 Day'
};

export const TIMEFRAME_PRIORITY: Record<Timeframe, number> = {
  '1d': 3, // Highest priority
  '4h': 2,
  '1h': 1  // Lowest priority
};
