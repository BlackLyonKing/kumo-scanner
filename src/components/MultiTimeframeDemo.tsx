import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MultiTimeframeAnalysis from "./MultiTimeframeAnalysis";
import { TradingSignal } from "@/types/trading";

// Demo data for showcase
const demoSignals = {
  '1h': {
    symbol: 'BTC/USDT',
    currentPrice: 43250,
    signal: 'Long Signal' as const,
    cloudStatus: 'Above Cloud (Bullish)',
    tkCross: 'Bullish Cross',
    chikouSpanStatus: 'Above Price',
    rsi: 58.5,
    signalGrade: 'B' as const,
    signalStrength: 72,
    priceChangePercent24h: 2.3
  } as TradingSignal,
  '4h': {
    symbol: 'BTC/USDT',
    currentPrice: 43250,
    signal: 'Long Signal' as const,
    cloudStatus: 'Above Cloud (Bullish)',
    tkCross: 'Bullish Cross',
    chikouSpanStatus: 'Above Price',
    rsi: 62.1,
    signalGrade: 'A' as const,
    signalStrength: 85,
    priceChangePercent24h: 2.3
  } as TradingSignal,
  '1d': {
    symbol: 'BTC/USDT',
    currentPrice: 43250,
    signal: 'Long Signal' as const,
    cloudStatus: 'Above Cloud (Bullish)',
    tkCross: 'Bullish Cross',
    chikouSpanStatus: 'Above Price',
    rsi: 55.8,
    signalGrade: 'A' as const,
    signalStrength: 88,
    priceChangePercent24h: 2.3
  } as TradingSignal
};

const demoConflictingSignals = {
  '1h': {
    symbol: 'ETH/USDT',
    currentPrice: 2280,
    signal: 'Short Signal' as const,
    cloudStatus: 'Below Cloud (Bearish)',
    tkCross: 'Bearish Cross',
    chikouSpanStatus: 'Below Price',
    rsi: 42.3,
    signalGrade: 'C' as const,
    signalStrength: 45,
    priceChangePercent24h: -0.8
  } as TradingSignal,
  '4h': {
    symbol: 'ETH/USDT',
    currentPrice: 2280,
    signal: 'Long Signal' as const,
    cloudStatus: 'Above Cloud (Bullish)',
    tkCross: 'Bullish Cross',
    chikouSpanStatus: 'Above Price',
    rsi: 58.7,
    signalGrade: 'B' as const,
    signalStrength: 68,
    priceChangePercent24h: -0.8
  } as TradingSignal,
  '1d': {
    symbol: 'ETH/USDT',
    currentPrice: 2280,
    signal: 'Long Signal' as const,
    cloudStatus: 'Above Cloud (Bullish)',
    tkCross: 'Bullish Cross',
    chikouSpanStatus: 'Above Price',
    rsi: 64.2,
    signalGrade: 'A' as const,
    signalStrength: 82,
    priceChangePercent24h: -0.8
  } as TradingSignal
};

const MultiTimeframeDemo = () => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Multi-Timeframe Analysis</CardTitle>
            <Badge className="bg-primary">New Feature</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Analyze trading signals across multiple timeframes simultaneously to increase your win rate. 
              See alignment scores, detect conflicting signals, and get clear recommendations based on all timeframes.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4 not-prose">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-semibold">Aligned Timeframes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When all timeframes show the same signal, confidence is high. Perfect for entries.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-semibold">Conflicting Signals</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When timeframes disagree, risk increases. Wait for alignment or trade smaller.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example 1: Aligned Timeframes */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Example 1: Perfect Alignment (High Confidence)
        </h3>
        <MultiTimeframeAnalysis
          symbol="BTC/USDT"
          signals={demoSignals}
        />
      </div>

      {/* Example 2: Conflicting Timeframes */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Example 2: Conflicting Signals (Exercise Caution)
        </h3>
        <MultiTimeframeAnalysis
          symbol="ETH/USDT"
          signals={demoConflictingSignals}
        />
      </div>

      {/* How to Use */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Multi-Timeframe Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <Badge variant="outline" className="shrink-0">1</Badge>
              <span>
                <strong className="text-foreground">Check Overall Signal:</strong> Look at the recommendation badge 
                (Strong Buy, Buy, Conflicted, etc.)
              </span>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="shrink-0">2</Badge>
              <span>
                <strong className="text-foreground">Review Alignment Score:</strong> Higher scores (80%+) indicate 
                all timeframes agree
              </span>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="shrink-0">3</Badge>
              <span>
                <strong className="text-foreground">Read Conflict Warnings:</strong> If timeframes conflict, 
                understand the specific disagreement
              </span>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="shrink-0">4</Badge>
              <span>
                <strong className="text-foreground">Expand for Details:</strong> Click to see individual 
                timeframe analysis and trading guidelines
              </span>
            </li>
            <li className="flex gap-3">
              <Badge variant="outline" className="shrink-0">5</Badge>
              <span>
                <strong className="text-foreground">Follow the Daily Trend:</strong> The 1D timeframe has 
                highest priority - trade with this bias
              </span>
            </li>
          </ol>

          <div className="mt-4 p-4 rounded-lg bg-muted/30">
            <p className="text-sm font-semibold mb-2">Pro Tip:</p>
            <p className="text-sm text-muted-foreground">
              Best entries occur when all three timeframes align with Grade A signals on 4H and 1D. 
              This gives you the highest probability setups with clear risk/reward.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiTimeframeDemo;
