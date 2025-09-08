import { TradingSignal } from "@/types/trading";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HelpTooltip from "@/components/HelpTooltip";

interface SignalsTableProps {
  signals: TradingSignal[];
  isLoading: boolean;
  statusMessage: string;
}

const SignalsTable = ({ signals, isLoading, statusMessage }: SignalsTableProps) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'Long Signal':
        return <TrendingUp className="h-4 w-4 text-signal-long" />;
      case 'Short Signal':
        return <TrendingDown className="h-4 w-4 text-signal-short" />;
      default:
        return <Minus className="h-4 w-4 text-signal-neutral" />;
    }
  };

  const getSignalClassName = (signal: string) => {
    switch (signal) {
      case 'Long Signal':
        return 'text-signal-long font-bold';
      case 'Short Signal':
        return 'text-signal-short font-bold';
      default:
        return 'text-signal-neutral';
    }
  };

  const getRowClassName = (signal: string) => {
    switch (signal) {
      case 'Long Signal':
        return 'hover:bg-signal-long/5 border-l-2 border-l-signal-long/30';
      case 'Short Signal':
        return 'hover:bg-signal-short/5 border-l-2 border-l-signal-short/30';
      default:
        return 'hover:bg-accent/50';
    }
  };

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Create a simple beep sound
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  // Play sound when strong signals are detected
  const strongSignals = signals.filter(s => s.signal !== 'Neutral');
  if (strongSignals.length > 0 && soundEnabled && !isLoading) {
    setTimeout(playNotificationSound, 500);
  }

  if (isLoading || signals.length === 0) {
    return (
      <Card className="glass-card animate-fade-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardContent className="relative p-12">
          <div className="text-center space-y-4">
            {isLoading ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-primary text-lg font-semibold">
                  Analyzing Markets...
                </div>
                <div className="text-muted-foreground">
                  {statusMessage || 'Scanning trading pairs for signals'}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground text-lg">
                  {statusMessage || 'Click "Scan Markets" to begin analysis'}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <CardContent className="relative p-0">
        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Live Market Signals
            </h3>
            <p className="text-sm text-muted-foreground">
              {signals.length} pairs analyzed • Updated in real-time
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="premium-button gap-2 border-primary/30"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50 bg-muted/20">
                <th className="py-4 px-6 font-semibold">Symbol</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    Signal
                    <HelpTooltip content="Trading signal based on confluence of all Ichimoku indicators. Long/Short signals require all three conditions to align." />
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    Cloud Status
                    <HelpTooltip content="Price position relative to the Ichimoku cloud. Above cloud = bullish zone, below cloud = bearish zone, in cloud = neutral/consolidation." />
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    TK Cross
                    <HelpTooltip content="Tenkan-sen (9) vs Kijun-sen (26) relationship. Bullish when Tenkan above Kijun, bearish when below." />
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    Chikou Span
                    <HelpTooltip content="Current price compared to price 26 periods ago. Above = bullish momentum, below = bearish momentum." />
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    RSI (14)
                    <HelpTooltip content="Relative Strength Index. Values above 70 indicate overbought conditions, below 30 indicate oversold conditions." />
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2">
                    Grade
                    <HelpTooltip content="Signal quality: A = All conditions + multi-timeframe alignment, B = Basic conditions met, C = No signal or conflicting conditions." />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {signals.map((signal, index) => (
                <tr 
                  key={signal.symbol} 
                  className={cn(
                    "data-row animate-fade-in",
                    getRowClassName(signal.signal)
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                      <span className="font-mono font-bold text-foreground">
                        {signal.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-foreground font-semibold">
                      ${signal.currentPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getSignalIcon(signal.signal)}
                      <span className={cn(
                        getSignalClassName(signal.signal),
                        signal.signal === 'Long Signal' && "signal-badge-long",
                        signal.signal === 'Short Signal' && "signal-badge-short",
                        signal.signal === 'Neutral' && "signal-badge-neutral"
                      )}>
                        {signal.signal}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "text-sm font-medium",
                      signal.cloudStatus === 'Above Cloud' && "text-signal-long",
                      signal.cloudStatus === 'Below Cloud' && "text-signal-short",
                      signal.cloudStatus === 'In Cloud' && "text-muted-foreground"
                    )}>
                      {signal.cloudStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "text-sm font-medium",
                      signal.tkCross === 'Bullish Cross' && "text-signal-long",
                      signal.tkCross === 'Bearish Cross' && "text-signal-short",
                      signal.tkCross === 'No Cross' && "text-muted-foreground"
                    )}>
                      {signal.tkCross}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "text-sm font-medium",
                      signal.chikouSpanStatus === 'Above' && "text-signal-long",
                      signal.chikouSpanStatus === 'Below' && "text-signal-short",
                      signal.chikouSpanStatus === 'Equal' && "text-muted-foreground"
                    )}>
                      {signal.chikouSpanStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        signal.rsi > 70 && "bg-signal-short animate-pulse",
                        signal.rsi < 30 && "bg-signal-long animate-pulse",
                        signal.rsi >= 30 && signal.rsi <= 70 && "bg-muted-foreground"
                      )} />
                      <span className="font-mono text-foreground font-medium">
                        {signal.rsi.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      signal.signalGrade === 'A' && "bg-signal-long/20 text-signal-long border border-signal-long/30",
                      signal.signalGrade === 'B' && "bg-warning/20 text-warning border border-warning/30",
                      signal.signalGrade === 'C' && "bg-muted/20 text-muted-foreground border border-muted/30"
                    )}>
                      {signal.signalGrade}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalsTable;