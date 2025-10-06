import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { MultiTimeframeAnalysis as MTFAnalysis, TIMEFRAME_LABELS } from "@/types/multiTimeframe";
import { analyzeMultiTimeframe } from "@/utils/multiTimeframeAnalysis";
import { TradingSignal } from "@/types/trading";

interface MultiTimeframeAnalysisProps {
  symbol: string;
  signals: {
    '1h': TradingSignal | null;
    '4h': TradingSignal | null;
    '1d': TradingSignal | null;
  };
}

const MultiTimeframeAnalysis = ({ symbol, signals }: MultiTimeframeAnalysisProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const analysis: MTFAnalysis = analyzeMultiTimeframe(
    signals['1h'],
    signals['4h'],
    signals['1d']
  );

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'strong_buy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'buy': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'strong_sell': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'sell': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'conflicted': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSignalIcon = (signal: string) => {
    if (signal === 'Long Signal') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (signal === 'Short Signal') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-green-500';
    if (strength >= 40) return 'text-yellow-500';
    if (strength >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Multi-Timeframe Analysis: {symbol}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Recommendation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Signal:</span>
            <Badge className={getRecommendationColor(analysis.recommendation)}>
              {analysis.recommendation.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Signal Strength:</span>
              <span className={`font-bold ${getStrengthColor(analysis.overallStrength)}`}>
                {analysis.overallStrength}%
              </span>
            </div>
            <Progress value={analysis.overallStrength} className="h-2" />
          </div>
        </div>

        {/* Timeframe Alignment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {analysis.alignment.aligned ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm font-medium">
              {analysis.alignment.aligned ? 'Timeframes Aligned' : 'Timeframes Conflicting'}
            </span>
            <Badge variant="outline" className="ml-auto">
              {analysis.alignment.alignmentScore}% Alignment
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dominant Trend:</span>
            <Badge variant={
              analysis.alignment.dominantTrend === 'bullish' ? 'default' : 
              analysis.alignment.dominantTrend === 'bearish' ? 'destructive' : 
              'secondary'
            }>
              {analysis.alignment.dominantTrend.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Conflict Warning */}
        {analysis.conflictWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {analysis.conflictWarning}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Timeframe Summary */}
        <div className="grid grid-cols-3 gap-2">
          {(['1h', '4h', '1d'] as const).map(tf => {
            const signal = analysis.signals[tf];
            return (
              <div
                key={tf}
                className={`p-3 rounded-lg border ${
                  !signal ? 'opacity-50' : ''
                } ${
                  analysis.alignment.alignedTimeframes.includes(tf)
                    ? 'border-primary bg-primary/5'
                    : analysis.alignment.conflictingTimeframes.includes(tf)
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border'
                }`}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {TIMEFRAME_LABELS[tf]}
                </div>
                <div className="flex items-center gap-1">
                  {signal ? getSignalIcon(signal.signal) : <BarChart3 className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-xs font-bold">
                    {signal?.signalGrade || 'N/A'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Analysis (Expandable) */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            {(['1d', '4h', '1h'] as const).map(tf => {
              const signal = analysis.signals[tf];
              if (!signal) return null;

              return (
                <div key={tf} className="space-y-2 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{TIMEFRAME_LABELS[tf]}</Badge>
                      {getSignalIcon(signal.signal)}
                      <span className="text-sm font-medium">{signal.signal}</span>
                    </div>
                    <Badge className={
                      signal.signalGrade === 'A' ? 'bg-green-600' :
                      signal.signalGrade === 'B' ? 'bg-yellow-600' :
                      'bg-orange-600'
                    }>
                      Grade {signal.signalGrade}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Cloud Status:</span>
                      <span className="ml-1 font-medium">{signal.cloudStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">TK Cross:</span>
                      <span className="ml-1 font-medium">{signal.tkCross}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chikou:</span>
                      <span className="ml-1 font-medium">{signal.chikouSpanStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">RSI:</span>
                      <span className={`ml-1 font-medium ${
                        signal.rsi > 70 ? 'text-red-500' :
                        signal.rsi < 30 ? 'text-green-500' :
                        ''
                      }`}>
                        {signal.rsi.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {signal.signalStrength && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Strength:</span>
                        <span className={`font-bold ${getStrengthColor(signal.signalStrength)}`}>
                          {signal.signalStrength}%
                        </span>
                      </div>
                      <Progress value={signal.signalStrength} className="h-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Trading Guidelines */}
        {isExpanded && (
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <div className="text-sm font-medium">Trading Guidelines:</div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              {analysis.alignment.aligned && (
                <li className="text-green-600">✓ All timeframes aligned - High confidence setup</li>
              )}
              {!analysis.alignment.aligned && (
                <li className="text-orange-600">⚠ Wait for timeframe alignment for best entries</li>
              )}
              {analysis.signals['1d'] && (
                <li>Daily trend: {analysis.signals['1d'].signal} - Trade with this bias</li>
              )}
              {analysis.overallStrength < 50 && (
                <li className="text-orange-600">⚠ Low strength signal - Consider smaller position size</li>
              )}
              {analysis.overallStrength >= 80 && (
                <li className="text-green-600">✓ High strength signal - Favorable risk/reward</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiTimeframeAnalysis;
