import React from "react";
import { TradingSignal } from "@/types/trading";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Target, Zap } from "lucide-react";

interface SignalStrengthIndicatorProps {
  signal: TradingSignal;
  showDetailed?: boolean;
}

const SignalStrengthIndicator = ({ signal, showDetailed = false }: SignalStrengthIndicatorProps) => {
  // Calculate signal strength based on multiple factors
  const calculateSignalStrength = (signal: TradingSignal): number => {
    let strength = 0;
    
    // Base signal strength
    if (signal.signal === 'Long Signal' || signal.signal === 'Short Signal') {
      strength += 30;
    }
    
    // Grade-based strength
    if (signal.signalGrade === 'A') strength += 40;
    else if (signal.signalGrade === 'B') strength += 25;
    else if (signal.signalGrade === 'C') strength += 10;
    
    // Cloud position strength
    if (signal.cloudStatus === 'Above Cloud' && signal.signal === 'Long Signal') strength += 15;
    if (signal.cloudStatus === 'Below Cloud' && signal.signal === 'Short Signal') strength += 15;
    if (signal.cloudStatus === 'In Cloud') strength -= 10;
    
    // TK Cross strength
    if ((signal.tkCross === 'Bullish Cross' && signal.signal === 'Long Signal') ||
        (signal.tkCross === 'Bearish Cross' && signal.signal === 'Short Signal')) {
      strength += 10;
    }
    
    // RSI confirmation
    if (signal.signal === 'Long Signal' && signal.rsi > 50 && signal.rsi < 70) strength += 5;
    if (signal.signal === 'Short Signal' && signal.rsi < 50 && signal.rsi > 30) strength += 5;
    if (signal.rsi > 80 || signal.rsi < 20) strength -= 5; // Extreme levels reduce strength
    
    return Math.max(0, Math.min(100, strength));
  };

  const strength = signal.signalStrength || calculateSignalStrength(signal);
  
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-signal-long";
    if (strength >= 60) return "text-warning";
    if (strength >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return "Very Strong";
    if (strength >= 60) return "Strong";
    if (strength >= 40) return "Moderate";
    if (strength >= 20) return "Weak";
    return "Very Weak";
  };

  const getSignalIcon = () => {
    switch (signal.signal) {
      case 'Long Signal':
        return <TrendingUp className="h-4 w-4" />;
      case 'Short Signal':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const priceChangePercent = signal.priceChangePercent24h || 0;
  
  if (!showDetailed) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
              strength >= 80 && "bg-signal-long",
              strength >= 60 && strength < 80 && "bg-warning", 
              strength >= 40 && strength < 60 && "bg-accent",
              strength < 40 && "bg-muted-foreground"
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className={cn("text-xs font-medium", getStrengthColor(strength))}>
          {strength}%
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            signal.signal === 'Long Signal' && "bg-signal-long/20",
            signal.signal === 'Short Signal' && "bg-signal-short/20", 
            signal.signal === 'Neutral' && "bg-muted/20"
          )}>
            {getSignalIcon()}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Signal Strength</h4>
            <p className="text-xs text-muted-foreground">Confidence Analysis</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={cn("text-2xl font-bold", getStrengthColor(strength))}>
            {strength}%
          </div>
          <div className={cn("text-sm font-medium", getStrengthColor(strength))}>
            {getStrengthLabel(strength)}
          </div>
        </div>
      </div>

      {/* Strength Progress Bar */}
      <div className="space-y-2">
        <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out",
              strength >= 80 && "bg-gradient-to-r from-signal-long to-signal-long-glow",
              strength >= 60 && strength < 80 && "bg-gradient-to-r from-warning to-yellow-400", 
              strength >= 40 && strength < 60 && "bg-gradient-to-r from-accent to-purple-400",
              strength < 40 && "bg-gradient-to-r from-muted-foreground to-gray-400"
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Weak</span>
          <span>Moderate</span>
          <span>Strong</span>
          <span>Very Strong</span>
        </div>
      </div>

      {/* Signal Components Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Grade:</span>
            <span className={cn(
              "font-bold",
              signal.signalGrade === 'A' && "text-signal-long",
              signal.signalGrade === 'B' && "text-warning",
              signal.signalGrade === 'C' && "text-muted-foreground"
            )}>
              {signal.signalGrade}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">RSI:</span>
            <span className={cn(
              "font-mono font-medium",
              signal.rsi > 70 && "text-signal-short",
              signal.rsi < 30 && "text-signal-long",
              signal.rsi >= 30 && signal.rsi <= 70 && "text-foreground"
            )}>
              {signal.rsi.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cloud:</span>
            <span className={cn(
              "text-xs font-medium",
              signal.cloudStatus === 'Above Cloud' && "text-signal-long",
              signal.cloudStatus === 'Below Cloud' && "text-signal-short",
              signal.cloudStatus === 'In Cloud' && "text-muted-foreground"
            )}>
              {signal.cloudStatus.replace(' Cloud', '')}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">24h:</span>
            <span className={cn(
              "font-mono font-medium",
              priceChangePercent >= 0 ? "text-signal-long" : "text-signal-short"
            )}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Action indicators */}
      {strength >= 70 && (
        <div className="flex items-center gap-2 p-2 bg-signal-long/10 rounded-lg border border-signal-long/30">
          <Zap className="h-4 w-4 text-signal-long" />
          <span className="text-sm font-medium text-signal-long">High Confidence Signal</span>
        </div>
      )}
      
      {strength >= 40 && strength < 70 && (
        <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg border border-warning/30">
          <Target className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-warning">Moderate Signal - Monitor Closely</span>
        </div>
      )}
    </div>
  );
};

export default SignalStrengthIndicator;