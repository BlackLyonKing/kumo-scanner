import React from "react";
import { TradingSignal } from "@/types/trading";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Volume2 } from "lucide-react";

interface PriceMetricsProps {
  signal: TradingSignal;
}

const PriceMetrics = ({ signal }: PriceMetricsProps) => {
  const priceChange = signal.priceChange24h || 0;
  const priceChangePercent = signal.priceChangePercent24h || 0;
  const volume24h = signal.volume24h || 0;
  
  const formatPrice = (price: number) => {
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return price.toFixed(8);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toFixed(0);
  };

  const getTrendIcon = () => {
    if (priceChangePercent > 0) return <TrendingUp className="h-4 w-4" />;
    if (priceChangePercent < 0) return <TrendingDown className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (priceChangePercent > 0) return "text-signal-long";
    if (priceChangePercent < 0) return "text-signal-short";
    return "text-muted-foreground";
  };

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Price Metrics</h3>
          <p className="text-xs text-muted-foreground">24-hour performance</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="font-mono text-lg font-bold text-foreground">
            ${formatPrice(signal.currentPrice)}
          </span>
        </div>

        {/* Price Change */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">24h Change</span>
          <div className="flex items-center gap-1">
            <div className={cn("flex items-center gap-1", getTrendColor())}>
              {getTrendIcon()}
              <span className="font-mono font-semibold">
                {priceChange >= 0 ? '+' : ''}${formatPrice(Math.abs(priceChange))}
              </span>
            </div>
          </div>
        </div>

        {/* Percentage Change */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">24h Change %</span>
          <div className={cn(
            "px-2 py-1 rounded-md text-sm font-bold",
            priceChangePercent > 0 && "bg-signal-long/20 text-signal-long",
            priceChangePercent < 0 && "bg-signal-short/20 text-signal-short",
            priceChangePercent === 0 && "bg-muted/20 text-muted-foreground"
          )}>
            {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </div>
        </div>

        {/* Volume (if available) */}
        {volume24h > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              <span>24h Volume</span>
            </div>
            <span className="font-mono text-sm font-semibold text-foreground">
              ${formatVolume(volume24h)}
            </span>
          </div>
        )}

        {/* Price Movement Indicator */}
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Price Momentum</span>
            <span className={cn("text-xs font-medium", getTrendColor())}>
              {Math.abs(priceChangePercent) > 5 ? 'High' : 
               Math.abs(priceChangePercent) > 2 ? 'Moderate' : 'Low'}
            </span>
          </div>
          
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute top-0 h-full rounded-full transition-all duration-500",
                priceChangePercent > 0 && "bg-signal-long left-1/2",
                priceChangePercent < 0 && "bg-signal-short right-1/2",
                priceChangePercent === 0 && "bg-muted-foreground left-1/2"
              )}
              style={{ 
                width: `${Math.min(Math.abs(priceChangePercent) * 2, 50)}%`
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Bearish</span>
            <span>Neutral</span>
            <span>Bullish</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceMetrics;