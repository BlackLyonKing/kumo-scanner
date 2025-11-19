import { Card, CardContent } from "@/components/ui/card";
import { TradingSignal } from "@/types/trading";
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { FearGreedGauge } from "./FearGreedGauge";
import { AltcoinSeasonMeter } from "./AltcoinSeasonMeter";

interface MetricCardsProps {
  signals: TradingSignal[];
}

export const MetricCards = ({ signals }: MetricCardsProps) => {
  const longSignals = signals.filter(s => s.signal === 'Long Signal').length;
  const shortSignals = signals.filter(s => s.signal === 'Short Signal').length;
  const gradeASignals = signals.filter(s => s.signalGrade === 'A').length;
  const totalVolume = signals.reduce((acc, s) => acc + (s.volume24h || 0), 0);

  const metrics = [
    {
      label: "Long Signals",
      value: longSignals,
      icon: TrendingUp,
      color: "text-signal-long",
      bgColor: "bg-signal-long/10",
    },
    {
      label: "Short Signals",
      value: shortSignals,
      icon: TrendingDown,
      color: "text-signal-short",
      bgColor: "bg-signal-short/10",
    },
    {
      label: "Grade A Signals",
      value: gradeASignals,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "24h Volume",
      value: `$${(totalVolume / 1000000).toFixed(1)}M`,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  // Calculate market sentiment based on signals
  const calculateMarketSentiment = () => {
    if (signals.length === 0) return 50;
    
    // Base sentiment on signal distribution and grades
    const longCount = longSignals;
    const shortCount = shortSignals;
    const totalSignals = signals.length;
    
    // Higher grade signals carry more weight
    const gradeALongs = signals.filter(s => s.signal === 'Long Signal' && s.signalGrade === 'A').length;
    const gradeAShorts = signals.filter(s => s.signal === 'Short Signal' && s.signalGrade === 'A').length;
    
    // Calculate weighted sentiment (0-100)
    const longRatio = (longCount / totalSignals) * 100;
    const gradeABoost = ((gradeALongs - gradeAShorts) / Math.max(gradeASignals, 1)) * 15;
    
    const sentiment = Math.max(0, Math.min(100, longRatio + gradeABoost));
    return Math.round(sentiment);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="metric-card border-border/50 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className={cn("text-2xl font-bold", metric.color)}>
                  {metric.value}
                </p>
              </div>
              <div className={cn("p-3 rounded-lg", metric.bgColor)}>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Fear & Greed Gauge */}
      <FearGreedGauge value={calculateMarketSentiment()} />
      
      {/* Altcoin Season Meter */}
      <AltcoinSeasonMeter signals={signals} />
    </div>
  );
};
