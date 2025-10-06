import { TradingSignal } from "@/types/trading";
import { MultiTimeframeAnalysis, TimeframeAlignment, Timeframe, TIMEFRAME_PRIORITY } from "@/types/multiTimeframe";

export const analyzeMultiTimeframe = (
  signal1h: TradingSignal | null,
  signal4h: TradingSignal | null,
  signal1d: TradingSignal | null
): MultiTimeframeAnalysis => {
  const signals = {
    '1h': signal1h,
    '4h': signal4h,
    '1d': signal1d
  };

  const alignment = calculateTimeframeAlignment(signals);
  const conflictWarning = generateConflictWarning(signals, alignment);
  const overallStrength = calculateOverallStrength(signals, alignment);
  const recommendation = generateRecommendation(signals, alignment, overallStrength);

  return {
    symbol: signal1h?.symbol || signal4h?.symbol || signal1d?.symbol || '',
    signals,
    alignment,
    conflictWarning,
    overallStrength,
    recommendation
  };
};

const calculateTimeframeAlignment = (signals: Record<Timeframe, TradingSignal | null>): TimeframeAlignment => {
  const timeframes: Timeframe[] = ['1h', '4h', '1d'];
  const validSignals = timeframes.filter(tf => signals[tf] !== null);
  
  if (validSignals.length === 0) {
    return {
      aligned: false,
      alignedTimeframes: [],
      conflictingTimeframes: [],
      dominantTrend: 'neutral',
      alignmentScore: 0
    };
  }

  // Count bullish and bearish signals
  let bullishCount = 0;
  let bearishCount = 0;
  let bullishTimeframes: Timeframe[] = [];
  let bearishTimeframes: Timeframe[] = [];

  validSignals.forEach(tf => {
    const signal = signals[tf];
    if (signal) {
      if (signal.signal === 'Long Signal') {
        bullishCount++;
        bullishTimeframes.push(tf);
      } else if (signal.signal === 'Short Signal') {
        bearishCount++;
        bearishTimeframes.push(tf);
      }
    }
  });

  const aligned = (bullishCount === validSignals.length) || (bearishCount === validSignals.length);
  const dominantTrend = bullishCount > bearishCount ? 'bullish' : bearishCount > bullishCount ? 'bearish' : 'neutral';
  
  // Calculate alignment score with higher timeframe weight
  let alignmentScore = 0;
  if (aligned) {
    alignmentScore = 100;
  } else {
    const maxScore = validSignals.reduce((sum, tf) => sum + TIMEFRAME_PRIORITY[tf], 0);
    const trendTimeframes = dominantTrend === 'bullish' ? bullishTimeframes : bearishTimeframes;
    const trendScore = trendTimeframes.reduce((sum, tf) => sum + TIMEFRAME_PRIORITY[tf], 0);
    alignmentScore = Math.round((trendScore / maxScore) * 100);
  }

  return {
    aligned,
    alignedTimeframes: dominantTrend === 'bullish' ? bullishTimeframes : bearishTimeframes,
    conflictingTimeframes: dominantTrend === 'bullish' ? bearishTimeframes : bullishTimeframes,
    dominantTrend,
    alignmentScore
  };
};

const generateConflictWarning = (
  signals: Record<Timeframe, TradingSignal | null>,
  alignment: TimeframeAlignment
): string | null => {
  if (alignment.aligned) return null;
  
  const conflicts: string[] = [];
  
  // Check for higher timeframe conflicts
  if (signals['1d'] && signals['1h']) {
    if (signals['1d'].signal === 'Long Signal' && signals['1h'].signal === 'Short Signal') {
      conflicts.push('⚠️ Daily timeframe shows bullish but 1H shows bearish - High risk counter-trend trade');
    } else if (signals['1d'].signal === 'Short Signal' && signals['1h'].signal === 'Long Signal') {
      conflicts.push('⚠️ Daily timeframe shows bearish but 1H shows bullish - Trading against daily trend');
    }
  }

  if (signals['4h'] && signals['1h']) {
    if (signals['4h'].signal === 'Long Signal' && signals['1h'].signal === 'Short Signal') {
      conflicts.push('⚠️ 4H timeframe bullish but 1H bearish - Wait for alignment');
    } else if (signals['4h'].signal === 'Short Signal' && signals['1h'].signal === 'Long Signal') {
      conflicts.push('⚠️ 4H timeframe bearish but 1H bullish - Counter-trend scalp only');
    }
  }

  if (conflicts.length === 0 && !alignment.aligned) {
    conflicts.push('⚠️ Mixed signals across timeframes - Exercise caution');
  }

  return conflicts.join(' | ');
};

const calculateOverallStrength = (
  signals: Record<Timeframe, TradingSignal | null>,
  alignment: TimeframeAlignment
): number => {
  let strength = 0;
  const timeframes: Timeframe[] = ['1h', '4h', '1d'];
  
  timeframes.forEach(tf => {
    const signal = signals[tf];
    if (signal && signal.signalStrength) {
      // Weight by timeframe priority
      const weight = TIMEFRAME_PRIORITY[tf];
      strength += signal.signalStrength * weight;
    }
  });

  // Normalize to 0-100
  const maxPossibleStrength = timeframes.reduce((sum, tf) => 
    signals[tf] ? sum + (100 * TIMEFRAME_PRIORITY[tf]) : sum, 0
  );

  if (maxPossibleStrength === 0) return 0;

  let normalizedStrength = Math.round((strength / maxPossibleStrength) * 100);

  // Apply alignment bonus
  if (alignment.aligned) {
    normalizedStrength = Math.min(100, normalizedStrength + 15);
  }

  return normalizedStrength;
};

const generateRecommendation = (
  signals: Record<Timeframe, TradingSignal | null>,
  alignment: TimeframeAlignment,
  overallStrength: number
): 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell' | 'conflicted' => {
  if (!alignment.aligned) {
    return 'conflicted';
  }

  const dominantSignal = signals['1d'] || signals['4h'] || signals['1h'];
  if (!dominantSignal) return 'neutral';

  const isBullish = dominantSignal.signal === 'Long Signal';
  
  if (isBullish) {
    // Check for strong buy conditions
    if (overallStrength >= 80 && alignment.aligned && signals['1d']?.signal === 'Long Signal') {
      return 'strong_buy';
    }
    if (overallStrength >= 60) {
      return 'buy';
    }
    return 'neutral';
  } else {
    // Check for strong sell conditions
    if (overallStrength >= 80 && alignment.aligned && signals['1d']?.signal === 'Short Signal') {
      return 'strong_sell';
    }
    if (overallStrength >= 60) {
      return 'sell';
    }
    return 'neutral';
  }
};

export const filterByHigherTimeframeTrend = (
  signals: TradingSignal[],
  higherTimeframeTrend: 'bullish' | 'bearish' | 'both'
): TradingSignal[] => {
  if (higherTimeframeTrend === 'both') return signals;
  
  return signals.filter(signal => {
    if (higherTimeframeTrend === 'bullish') {
      return signal.signal === 'Long Signal';
    } else {
      return signal.signal === 'Short Signal';
    }
  });
};
