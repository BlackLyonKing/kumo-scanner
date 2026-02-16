import React from "react";
import { TradingSignal } from "@/types/trading";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AutonomousNetWorthProps {
  signals: TradingSignal[];
}

const AutonomousNetWorth = ({ signals }: AutonomousNetWorthProps) => {
  const longCount = signals.filter((s) => s.signal === "Long Signal").length;
  const shortCount = signals.filter((s) => s.signal === "Short Signal").length;
  const gradeA = signals.filter((s) => s.signalGrade === "A").length;
  const avgStrength =
    signals.length > 0
      ? Math.round(
          signals.reduce((sum, s) => sum + (s.signalStrength || 0), 0) /
            signals.length
        )
      : 0;

  const dominantDirection =
    longCount > shortCount ? "bullish" : shortCount > longCount ? "bearish" : "neutral";

  return (
    <div className="glass-card p-0 overflow-hidden">
      {/* Top label */}
      <div className="px-5 pt-4 pb-2">
        <span className="font-mono text-2xs tracking-[0.25em] uppercase text-muted-foreground">
          Autonomous Signal Index
        </span>
      </div>

      {/* Big number */}
      <div className="px-5 pb-2 text-center">
        <div className="font-mono text-5xl font-bold tracking-tight text-foreground">
          {signals.length > 0 ? avgStrength : "—"}
          <span className="text-lg text-muted-foreground font-normal ml-1">%</span>
        </div>
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
            {gradeA} Grade A · {signals.length} Total
          </span>
        </div>
      </div>

      {/* Direction indicator */}
      <div className="px-5 pb-4 flex justify-center">
        <div
          className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider ${
            dominantDirection === "bullish"
              ? "text-signal-long"
              : dominantDirection === "bearish"
              ? "text-signal-short"
              : "text-muted-foreground"
          }`}
        >
          {dominantDirection === "bullish" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : dominantDirection === "bearish" ? (
            <TrendingDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          {dominantDirection}
        </div>
      </div>
    </div>
  );
};

export default AutonomousNetWorth;
