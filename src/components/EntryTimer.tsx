import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import HelpTooltip from "@/components/HelpTooltip";

interface MarketSession {
  name: string;
  timezone: string;
  start: number; // Hour in UTC (0-23)
  end: number; // Hour in UTC (0-23)
  color: string;
  isActive: boolean;
  volume: 'Low' | 'Medium' | 'High';
}

const EntryTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessions, setSessions] = useState<MarketSession[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const utcHour = now.getUTCHours();
      
      // Define market sessions (crypto markets are 24/7 but institutional activity varies)
      const marketSessions: MarketSession[] = [
        {
          name: "Asian Session",
          timezone: "Asia/Tokyo",
          start: 23, // 23:00 UTC (Asia morning)
          end: 8,   // 08:00 UTC (Asia close)
          color: "text-blue-500",
          isActive: (utcHour >= 23 || utcHour < 8),
          volume: (utcHour >= 0 && utcHour < 4) ? 'High' : 'Medium'
        },
        {
          name: "European Session",
          timezone: "Europe/London",
          start: 7,  // 07:00 UTC (Europe morning)
          end: 16,  // 16:00 UTC (Europe close)
          color: "text-green-500",
          isActive: (utcHour >= 7 && utcHour < 16),
          volume: (utcHour >= 8 && utcHour < 12) ? 'High' : 'Medium'
        },
        {
          name: "US Session",
          timezone: "America/New_York",
          start: 13, // 13:00 UTC (US morning)
          end: 22,  // 22:00 UTC (US close)
          color: "text-orange-500",
          isActive: (utcHour >= 13 && utcHour < 22),
          volume: (utcHour >= 14 && utcHour < 18) ? 'High' : 'Medium'
        }
      ];

      setSessions(marketSessions);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getOptimalEntryAdvice = () => {
    const activeSessions = sessions.filter(s => s.isActive);
    const highVolumeSessions = sessions.filter(s => s.volume === 'High');
    
    if (activeSessions.length >= 2) {
      return {
        status: "Optimal",
        message: "Multiple sessions overlap - highest volume and volatility",
        color: "text-signal-long",
        bgColor: "bg-signal-long/10",
        icon: TrendingUp
      };
    } else if (highVolumeSessions.some(s => s.isActive)) {
      return {
        status: "Good",
        message: "High volume session active - good entry conditions",
        color: "text-warning",
        bgColor: "bg-warning/10",
        icon: Clock
      };
    } else if (activeSessions.length === 1) {
      return {
        status: "Fair",
        message: "Single session active - moderate conditions",
        color: "text-muted-foreground",
        bgColor: "bg-muted/10",
        icon: Globe
      };
    } else {
      return {
        status: "Caution",
        message: "Low activity period - wait for session overlap",
        color: "text-signal-short",
        bgColor: "bg-signal-short/10",
        icon: AlertCircle
      };
    }
  };

  const advice = getOptimalEntryAdvice();
  const IconComponent = advice.icon;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Entry Timing
          <HelpTooltip content="Based on Ichimoku principles, entries are most effective during high-volume periods when market sessions overlap. Ichimoku works best when institutional traders are active." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="text-center p-3 rounded-lg bg-muted/20">
          <div className="text-sm text-muted-foreground">Current UTC Time</div>
          <div className="text-xl font-mono font-bold text-foreground">
            {currentTime.toUTCString().split(' ')[4]}
          </div>
        </div>

        {/* Entry Recommendation */}
        <div className={cn("p-4 rounded-lg border", advice.bgColor)}>
          <div className="flex items-center gap-3 mb-2">
            <IconComponent className={cn("h-5 w-5", advice.color)} />
            <span className={cn("font-bold", advice.color)}>
              {advice.status} Entry Conditions
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{advice.message}</p>
        </div>

        {/* Market Sessions */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground mb-3">Market Sessions</h4>
          {sessions.map((session) => (
            <div
              key={session.name}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                session.isActive 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-muted/5 border-muted/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  session.isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/50"
                )} />
                <div>
                  <div className={cn(
                    "font-medium",
                    session.isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {session.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {String(session.start).padStart(2, '0')}:00 - {String(session.end).padStart(2, '0')}:00 UTC
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-sm font-medium",
                  session.isActive ? session.color : "text-muted-foreground"
                )}>
                  {session.isActive ? 'Active' : 'Closed'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.volume} Volume
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ichimoku Entry Tips */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <h5 className="font-semibold text-foreground mb-2">📈 Ichimoku Entry Guidelines</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Best entries during session overlaps (higher volume)</li>
            <li>• Wait for price above cloud + TK cross + Chikou clear</li>
            <li>• Avoid entries during low-volume periods</li>
            <li>• European-US overlap (13:00-16:00 UTC) often optimal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntryTimer;