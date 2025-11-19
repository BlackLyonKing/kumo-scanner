import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TradingSignal } from "@/types/trading";
import { useMemo } from "react";

interface AltcoinSeasonMeterProps {
  signals: TradingSignal[];
}

export const AltcoinSeasonMeter = ({ signals }: AltcoinSeasonMeterProps) => {
  // Calculate altcoin season index (0-100)
  const altcoinIndex = useMemo(() => {
    if (signals.length === 0) return 31; // Default value
    
    // Count BTC-related pairs vs altcoin pairs
    const btcPairs = signals.filter(s => 
      s.symbol.includes('BTC') && !s.symbol.startsWith('BTC')
    ).length;
    
    const altcoinPairs = signals.filter(s => 
      !s.symbol.includes('BTC') || s.symbol.startsWith('BTC')
    ).length;
    
    // Count strong altcoin signals (Long signals for altcoins)
    const strongAltcoinSignals = signals.filter(s => 
      (!s.symbol.includes('BTC') || s.symbol.startsWith('BTC')) && 
      s.signal === 'Long Signal' &&
      (s.signalGrade === 'A' || s.signalGrade === 'B')
    ).length;
    
    const totalStrong = signals.filter(s => 
      s.signal === 'Long Signal' && 
      (s.signalGrade === 'A' || s.signalGrade === 'B')
    ).length;
    
    // Calculate index (higher = more altcoin season)
    const pairRatio = (altcoinPairs / Math.max(signals.length, 1)) * 60;
    const signalBoost = totalStrong > 0 ? (strongAltcoinSignals / totalStrong) * 40 : 20;
    
    const index = Math.max(0, Math.min(100, pairRatio + signalBoost));
    return Math.round(index);
  }, [signals]);

  // Determine if it's Bitcoin or Altcoin season
  const season = altcoinIndex < 50 ? "Bitcoin" : "Altcoin";
  const sliderPosition = `${altcoinIndex}%`;

  return (
    <Card className="metric-card border-border/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Altcoin Season</p>
          </div>
          
          {/* Index Value */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {altcoinIndex}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
          
          {/* Slider Bar */}
          <div className="relative">
            {/* Labels */}
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className={cn(
                "transition-colors",
                altcoinIndex < 50 ? "text-foreground" : "text-muted-foreground"
              )}>
                Bitcoin
              </span>
              <span className={cn(
                "transition-colors",
                altcoinIndex >= 50 ? "text-foreground" : "text-muted-foreground"
              )}>
                Altcoin
              </span>
            </div>
            
            {/* Track */}
            <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
              {/* Gradient Fill */}
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-signal-long transition-all duration-700 ease-out"
                style={{ width: sliderPosition }}
              />
              
              {/* Slider Indicator */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-background border-2 border-foreground rounded-full shadow-lg transition-all duration-700 ease-out z-10"
                style={{ left: sliderPosition }}
              />
            </div>
          </div>
          
          {/* Current Status */}
          <div className="text-center">
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              altcoinIndex < 50 
                ? "bg-orange-500/20 text-orange-500" 
                : "bg-signal-long/20 text-signal-long"
            )}>
              {season} Season
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
