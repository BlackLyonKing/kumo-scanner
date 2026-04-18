import { useEffect, useState } from "react";
import { TradingSignal } from "@/types/trading";
import { Volume2 } from "lucide-react";

interface TerminalSidebarProps {
  signals: TradingSignal[];
  isScanning: boolean;
}

const TerminalSidebar = ({ signals, isScanning }: TerminalSidebarProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Aggregate "market gauge" from signal strengths
  const avgStrength =
    signals.length > 0
      ? Math.round(
          signals.reduce((s, x) => s + (x.signalStrength || 0), 0) /
            signals.length
        )
      : 0;

  const topMover = [...signals]
    .filter((s) => s.signal !== "Neutral")
    .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))[0];

  const recentMovers = [...signals]
    .filter((s) => s.signal !== "Neutral")
    .sort((a, b) => (b.signalStrength || 0) - (a.signalStrength || 0))
    .slice(0, 6);

  // Gauge geometry (semi-circle)
  const gaugeAngle = (avgStrength / 100) * 180 - 90; // -90 to +90

  return (
    <aside className="space-y-3 font-mono">
      {/* Live clock card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-long opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-long" />
          </span>
          <span className="text-2xs tracking-[0.25em] uppercase text-signal-long font-bold">
            {isScanning ? "Scanning Market" : "Live Market Data"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {now.toLocaleDateString()}
        </div>
        <div className="text-3xl font-bold text-signal-long tabular-nums tracking-tight mt-1">
          {now.toLocaleTimeString([], { hour12: false })}
        </div>
      </div>

      {/* Market gauge */}
      <div className="glass-card p-4">
        <div className="text-2xs tracking-[0.25em] uppercase text-muted-foreground text-center mb-3">
          Market Gauge
        </div>
        <div className="relative h-24 flex items-end justify-center">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Segments */}
            <path
              d="M 20 100 A 80 80 0 0 1 73 28"
              fill="none"
              stroke="hsl(var(--signal-short))"
              strokeWidth="14"
              opacity="0.85"
            />
            <path
              d="M 73 28 A 80 80 0 0 1 127 28"
              fill="none"
              stroke="#eab308"
              strokeWidth="14"
              opacity="0.85"
            />
            <path
              d="M 127 28 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--signal-long))"
              strokeWidth="14"
              opacity="0.85"
            />
            {/* Needle */}
            <g transform={`rotate(${gaugeAngle} 100 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="hsl(var(--foreground))"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
            </g>
          </svg>
        </div>
        <div className="text-center text-2xl font-bold mt-1">{avgStrength}%</div>
        <div className="text-center text-2xs text-muted-foreground mt-0.5">
          {signals.length} pairs analyzed
        </div>
      </div>

      {/* Most recent high */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-md bg-muted/50 border border-border/40">
            <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-2xs tracking-[0.25em] uppercase text-muted-foreground">
            Top Mover
          </span>
        </div>
        {topMover ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  topMover.signal === "Long Signal"
                    ? "text-signal-long"
                    : "text-signal-short"
                }`}
              >
                {topMover.symbol.replace("USDT", "")}
              </span>
              <span className="text-lg text-foreground">
                ${topMover.currentPrice?.toFixed(topMover.currentPrice < 1 ? 4 : 2)}
              </span>
            </div>
            <div
              className={`text-sm font-bold mt-1 ${
                topMover.signal === "Long Signal"
                  ? "text-signal-long"
                  : "text-signal-short"
              }`}
            >
              {topMover.signal === "Long Signal" ? "▲" : "▼"}{" "}
              {topMover.signalStrength}% Strength · Grade {topMover.signalGrade}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Awaiting scan…</div>
        )}
      </div>

      {/* Recent signals ticker */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-3 gap-2 text-2xs tracking-[0.2em] uppercase text-muted-foreground border-b border-border/40 pb-2 mb-2">
          <span>Ticker</span>
          <span className="text-right">Strength</span>
          <span className="text-right">Grade</span>
        </div>
        {recentMovers.length > 0 ? (
          <div className="space-y-1.5">
            {recentMovers.map((s) => (
              <div
                key={s.symbol}
                className="grid grid-cols-3 gap-2 text-xs items-center"
              >
                <span className="font-bold text-foreground truncate">
                  {s.symbol.replace("USDT", "")}
                </span>
                <span
                  className={`text-right font-bold ${
                    s.signal === "Long Signal"
                      ? "text-signal-long"
                      : "text-signal-short"
                  }`}
                >
                  {s.signalStrength}%
                </span>
                <span className="text-right text-muted-foreground">
                  {s.signalGrade}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground py-2">
            No signals yet
          </div>
        )}
      </div>
    </aside>
  );
};

export default TerminalSidebar;
