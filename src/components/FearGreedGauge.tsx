import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface FearGreedGaugeProps {
  value?: number; // 0-100
}

export const FearGreedGauge = ({ value = 16 }: FearGreedGaugeProps) => {
  // Calculate sentiment level and color
  const sentiment = useMemo(() => {
    if (value <= 20) return { label: "Extreme Fear", color: "text-signal-short" };
    if (value <= 40) return { label: "Fear", color: "text-orange-500" };
    if (value <= 60) return { label: "Neutral", color: "text-muted-foreground" };
    if (value <= 80) return { label: "Greed", color: "text-yellow-500" };
    return { label: "Extreme Greed", color: "text-signal-long" };
  }, [value]);

  // Calculate rotation angle for the needle (0-180 degrees)
  const needleRotation = (value / 100) * 180;

  // Generate gradient colors for the gauge arc
  const getGaugeColor = (position: number) => {
    if (position <= 20) return "hsl(0, 84%, 60%)"; // Red
    if (position <= 40) return "hsl(25, 90%, 55%)"; // Orange
    if (position <= 60) return "hsl(45, 90%, 60%)"; // Yellow
    if (position <= 80) return "hsl(100, 70%, 50%)"; // Light green
    return "hsl(142, 76%, 48%)"; // Green
  };

  return (
    <Card className="metric-card border-border/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Fear & Greed</p>
          </div>
          
          {/* Gauge */}
          <div className="relative flex justify-center items-center">
            <svg 
              width="180" 
              height="110" 
              viewBox="0 0 180 110" 
              className="overflow-visible"
            >
              {/* Background arc */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={getGaugeColor(0)} />
                  <stop offset="25%" stopColor={getGaugeColor(25)} />
                  <stop offset="50%" stopColor={getGaugeColor(50)} />
                  <stop offset="75%" stopColor={getGaugeColor(75)} />
                  <stop offset="100%" stopColor={getGaugeColor(100)} />
                </linearGradient>
              </defs>
              
              {/* Gauge arc */}
              <path
                d="M 20 90 A 70 70 0 0 1 160 90"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              
              {/* Background dim arc */}
              <path
                d="M 20 90 A 70 70 0 0 1 160 90"
                fill="none"
                stroke="hsl(0 0% 20%)"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.3"
              />
              
              {/* Needle */}
              <g transform={`rotate(${needleRotation - 90} 90 90)`}>
                <line
                  x1="90"
                  y1="90"
                  x2="90"
                  y2="30"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Needle tip */}
                <circle
                  cx="90"
                  cy="30"
                  r="4"
                  fill="hsl(var(--foreground))"
                />
              </g>
              
              {/* Center circle */}
              <circle
                cx="90"
                cy="90"
                r="8"
                fill="hsl(var(--card))"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
            </svg>
          </div>
          
          {/* Value and Label */}
          <div className="text-center space-y-1">
            <div className={cn("text-3xl font-bold", sentiment.color)}>
              {value}
            </div>
            <div className={cn("text-xs font-medium", sentiment.color)}>
              {sentiment.label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
