import React, { useState, useEffect } from "react";
import { Clock, TrendingUp, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import HelpTooltip from "@/components/HelpTooltip";

interface MarketSession {
  name: string;
  short: string;
  start: number;
  end: number;
  isActive: boolean;
  volume: "Low" | "Medium" | "High";
}

const EntryTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessions, setSessions] = useState<MarketSession[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      const utcHour = now.getUTCHours();

      setSessions([
        {
          name: "Asian Session",
          short: "ASIA",
          start: 23,
          end: 8,
          isActive: utcHour >= 23 || utcHour < 8,
          volume: utcHour >= 0 && utcHour < 4 ? "High" : "Medium",
        },
        {
          name: "European Session",
          short: "EU",
          start: 7,
          end: 16,
          isActive: utcHour >= 7 && utcHour < 16,
          volume: utcHour >= 8 && utcHour < 12 ? "High" : "Medium",
        },
        {
          name: "US Session",
          short: "US",
          start: 13,
          end: 22,
          isActive: utcHour >= 13 && utcHour < 22,
          volume: utcHour >= 14 && utcHour < 18 ? "High" : "Medium",
        },
      ]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAdvice = () => {
    const active = sessions.filter((s) => s.isActive);
    const highVolActive = sessions.some((s) => s.isActive && s.volume === "High");

    if (active.length >= 2)
      return { status: "OPTIMAL", color: "text-signal-long", dot: "bg-signal-long", icon: TrendingUp };
    if (highVolActive)
      return { status: "GOOD", color: "text-warning", dot: "bg-warning", icon: Clock };
    if (active.length === 1)
      return { status: "FAIR", color: "text-muted-foreground", dot: "bg-muted-foreground", icon: Globe };
    return { status: "CAUTION", color: "text-signal-short", dot: "bg-signal-short", icon: AlertCircle };
  };

  const advice = getAdvice();
  const Icon = advice.icon;

  return (
    <div className="glass-card p-3 font-mono animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        {/* UTC clock */}
        <div className="flex items-center gap-2 pr-3 border-r border-border/40">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">UTC</span>
            <span className="text-sm font-bold tabular-nums text-foreground">
              {currentTime.toUTCString().split(" ")[4]}
            </span>
          </div>
        </div>

        {/* Condition pill */}
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 border border-border/40", advice.color)}>
          <Icon className="h-3.5 w-3.5" />
          <span className="text-2xs font-bold tracking-wider">{advice.status}</span>
        </div>

        {/* Session dots */}
        <div className="flex items-center gap-3 ml-auto">
          {sessions.map((s) => (
            <div key={s.short} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  s.isActive ? `${advice.dot} animate-pulse` : "bg-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  "text-2xs font-bold tracking-wider",
                  s.isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.short}
              </span>
              {s.isActive && s.volume === "High" && (
                <span className="text-[9px] text-signal-long font-bold">▲</span>
              )}
            </div>
          ))}
          <HelpTooltip content="Best entries occur during session overlaps when institutional volume is highest. EU/US overlap (13:00–16:00 UTC) is often optimal for Ichimoku entries." />
        </div>
      </div>
    </div>
  );
};

export default EntryTimer;
