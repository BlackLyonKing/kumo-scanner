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
      <Card className="bg-card border-border animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-muted-foreground text-lg">
              {statusMessage || 'Click "Scan Markets" to begin.'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Market Signals ({signals.length} pairs)
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="gap-2"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-4 px-6 font-semibold">Symbol</th>
                <th className="py-4 px-6 font-semibold">Current Price</th>
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
            <tbody className="divide-y divide-border">
              {signals.map((signal, index) => (
                <tr 
                  key={signal.symbol} 
                  className={cn(
                    "transition-all duration-300 animate-fade-in",
                    getRowClassName(signal.signal)
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6">
                    <span className="font-mono font-semibold text-foreground">
                      {signal.symbol}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-foreground">
                      ${signal.currentPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getSignalIcon(signal.signal)}
                      <span className={getSignalClassName(signal.signal)}>
                        {signal.signal}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {signal.cloudStatus}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {signal.tkCross}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {signal.chikouSpanStatus}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-foreground">
                      {signal.rsi.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "font-bold",
                      signal.signalGrade === 'A' && "text-green-500",
                      signal.signalGrade === 'B' && "text-yellow-500",
                      signal.signalGrade === 'C' && "text-gray-500"
                    )}>
                      {signal.signalGrade}
                    </span>
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