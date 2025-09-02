import { TradingSignal } from "@/types/trading";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
                <th className="py-4 px-6 font-semibold">Signal</th>
                <th className="py-4 px-6 font-semibold">Cloud Status</th>
                <th className="py-4 px-6 font-semibold">TK Cross</th>
                <th className="py-4 px-6 font-semibold">Chikou Span</th>
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