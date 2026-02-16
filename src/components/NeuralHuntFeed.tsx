import React, { useState, useEffect, useRef } from "react";
import { TradingSignal } from "@/types/trading";

interface FeedEntry {
  id: string;
  type: "sentinel" | "sniper";
  message: string;
  timestamp: Date;
}

const generateFeedEntry = (signal: TradingSignal): FeedEntry[] => {
  const entries: FeedEntry[] = [];
  const confidence = signal.signalGrade === "A" ? 95 : signal.signalGrade === "B" ? 88 : 78;

  entries.push({
    id: `${signal.symbol}-sentinel-${Date.now()}-${Math.random()}`,
    type: "sentinel",
    message: `Confluence Found: $${signal.symbol.replace("USDT", "")} (${confidence}%)`,
    timestamp: new Date(),
  });

  if (signal.signal !== "Neutral" && signal.signalGrade !== "C") {
    const action = signal.signal === "Long Signal" ? "Buying" : "Shorting";
    entries.push({
      id: `${signal.symbol}-sniper-${Date.now()}-${Math.random()}`,
      type: "sniper",
      message: `STRIKE AUTHORIZED: ${action} $${signal.symbol.replace("USDT", "")} via Ichimoku Scan`,
      timestamp: new Date(),
    });
  }

  return entries;
};

interface NeuralHuntFeedProps {
  signals: TradingSignal[];
  isScanning: boolean;
}

const NeuralHuntFeed = ({ signals, isScanning }: NeuralHuntFeedProps) => {
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(0);

  // Generate feed entries from signals as they come in
  useEffect(() => {
    if (signals.length > processedRef.current) {
      const newSignals = signals.slice(processedRef.current);
      const newEntries = newSignals.flatMap(generateFeedEntry);
      setFeed((prev) => [...newEntries, ...prev].slice(0, 50));
      processedRef.current = signals.length;
    }
  }, [signals]);

  // Reset when scanning starts
  useEffect(() => {
    if (isScanning) {
      setFeed([]);
      processedRef.current = 0;
    }
  }, [isScanning]);

  return (
    <div className="glass-card p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Neural Hunt Feed
        </h3>
        <span className="font-mono text-2xs tracking-widest uppercase text-primary/60">
          Live_Mesh
        </span>
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        className="max-h-[320px] overflow-y-auto p-2 space-y-0.5"
      >
        {feed.length === 0 && !isScanning && (
          <div className="flex items-center justify-center py-8 text-muted-foreground/40">
            <span className="font-mono text-xs">Awaiting scan data...</span>
          </div>
        )}
        {isScanning && feed.length === 0 && (
          <div className="flex items-center justify-center py-8 gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary/70">Mesh connecting...</span>
          </div>
        )}
        {feed.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex items-start gap-2 px-3 py-1.5 rounded-sm transition-colors ${
              i === 0 ? "animate-fade-in" : ""
            }`}
          >
            {/* Accent bar */}
            <div
              className={`w-0.5 h-4 mt-0.5 rounded-full flex-shrink-0 ${
                entry.type === "sniper" ? "bg-warning" : "bg-primary/60"
              }`}
            />
            {/* Tag */}
            <span
              className={`font-mono text-2xs font-bold uppercase tracking-wider flex-shrink-0 ${
                entry.type === "sniper"
                  ? "text-warning"
                  : "text-muted-foreground"
              }`}
            >
              [{entry.type}]
            </span>
            {/* Message */}
            <span className="font-mono text-xs text-foreground/80 leading-relaxed">
              {entry.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralHuntFeed;
