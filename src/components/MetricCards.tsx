import { Card, CardContent } from "@/components/ui/card";
import { TradingSignal } from "@/types/trading";
import { TrendingUp, TrendingDown, Activity, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FearGreedGauge } from "./FearGreedGauge";
import { AltcoinSeasonMeter } from "./AltcoinSeasonMeter";
import { useFearGreedIndex } from "@/hooks/useFearGreedIndex";

interface MetricCardsProps {
  signals: TradingSignal[];
}

export const MetricCards = ({ signals }: MetricCardsProps) => {
  const { data: fearGreedValue, isLoading: isFearGreedLoading } = useFearGreedIndex();
  
  const longSignals = signals.filter(s => s.signal === 'Long Signal').length;
  const shortSignals = signals.filter(s => s.signal === 'Short Signal').length;
  const gradeASignals = signals.filter(s => s.signalGrade === 'A').length;
  const totalVolume = signals.reduce((acc, s) => acc + (s.volume24h || 0), 0);
  const totalSignals = signals.length;
  
  // Calculate percentages
  const longPercent = totalSignals > 0 ? Math.round((longSignals / totalSignals) * 100) : 0;
  const shortPercent = totalSignals > 0 ? Math.round((shortSignals / totalSignals) * 100) : 0;

  const metrics = [
    {
      label: "Long Signals",
      value: longSignals,
      subtitle: `${longPercent}% of total`,
      icon: TrendingUp,
      trend: ArrowUpRight,
      color: "text-signal-long",
      bgGradient: "from-signal-long/20 to-signal-long/5",
      iconBg: "bg-signal-long/15",
    },
    {
      label: "Short Signals",
      value: shortSignals,
      subtitle: `${shortPercent}% of total`,
      icon: TrendingDown,
      trend: ArrowDownRight,
      color: "text-signal-short",
      bgGradient: "from-signal-short/20 to-signal-short/5",
      iconBg: "bg-signal-short/15",
    },
    {
      label: "Grade A",
      value: gradeASignals,
      subtitle: "High conviction",
      icon: Target,
      trend: null,
      color: "text-primary",
      bgGradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15",
    },
    {
      label: "24h Volume",
      value: `$${(totalVolume / 1000000).toFixed(1)}M`,
      subtitle: "Total scanned",
      icon: Activity,
      trend: null,
      color: "text-foreground",
      bgGradient: "from-muted/30 to-transparent",
      iconBg: "bg-muted",
    },
  ];

  // Calculate market sentiment
  const calculateMarketSentiment = () => {
    if (signals.length === 0) return 50;
    const gradeALongs = signals.filter(s => s.signal === 'Long Signal' && s.signalGrade === 'A').length;
    const gradeAShorts = signals.filter(s => s.signal === 'Short Signal' && s.signalGrade === 'A').length;
    const longRatio = (longSignals / totalSignals) * 100;
    const gradeABoost = ((gradeALongs - gradeAShorts) / Math.max(gradeASignals, 1)) * 15;
    return Math.max(0, Math.min(100, Math.round(longRatio + gradeABoost)));
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={cn(
            "metric-card border-0 overflow-hidden group",
            "bg-gradient-to-b",
            metric.bgGradient
          )}
        >
          <CardContent className="p-4 relative">
            {/* Background icon */}
            <div className="absolute -right-3 -bottom-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <metric.icon className={cn("h-20 w-20", metric.color)} />
            </div>
            
            <div className="relative flex flex-col gap-2">
              {/* Icon and label row */}
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-lg", metric.iconBg)}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
                {metric.trend && (
                  <metric.trend className={cn("h-4 w-4", metric.color)} />
                )}
              </div>
              
              {/* Value */}
              <div className={cn("text-2xl sm:text-3xl font-bold tracking-tight", metric.color)}>
                {metric.value}
              </div>
              
              {/* Label and subtitle */}
              <div>
                <p className="text-sm font-medium text-foreground/90">{metric.label}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Fear & Greed Gauge */}
      <FearGreedGauge 
        value={fearGreedValue ?? calculateMarketSentiment()} 
        isLoading={isFearGreedLoading}
      />
      
      {/* Altcoin Season Meter */}
      <AltcoinSeasonMeter signals={signals} />
    </div>
  );
};
