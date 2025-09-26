import { TradingSignal } from "@/types/trading";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HelpTooltip from "@/components/HelpTooltip";
import DetailedSignalView from "@/components/DetailedSignalView";
import SignalStrengthIndicator from "@/components/SignalStrengthIndicator";

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

  const getTradeButtonConfig = (signal: TradingSignal) => {
    const phemexUrl = `https://phemex.com/account/referral/invite-friends-entry?referralCode=H2JMW2&symbol=${signal.symbol}`;
    
    switch (signal.signal) {
      case 'Long Signal':
        return {
          text: '🚀 LONG NOW',
          className: 'bg-gradient-to-r from-signal-long to-signal-long/80 hover:from-signal-long/90 hover:to-signal-long/70 text-white shadow-lg hover:shadow-signal-long/20',
          disabled: false,
          pulse: signal.signalGrade === 'A',
          url: phemexUrl
        };
      case 'Short Signal':
        return {
          text: '📉 SHORT NOW',
          className: 'bg-gradient-to-r from-signal-short to-signal-short/80 hover:from-signal-short/90 hover:to-signal-short/70 text-white shadow-lg hover:shadow-signal-short/20',
          disabled: false,
          pulse: signal.signalGrade === 'A',
          url: phemexUrl
        };
      default:
        return {
          text: '⏸️ NO SIGNAL',
          className: 'bg-muted/20 text-muted-foreground cursor-not-allowed',
          disabled: true,
          pulse: false,
          url: phemexUrl
        };
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Live Market Signals
            </h3>
            <p className="text-sm text-muted-foreground">
              {signals.length} pairs analyzed • Updated in real-time
            </p>
          </div>
            <Button
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "relative overflow-hidden transition-all duration-300 border-primary/20 shadow-lg min-h-[36px]",
              "hover:shadow-primary/20 hover:scale-105 hover:border-primary/40",
              soundEnabled 
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-primary/30" 
                : "bg-background/50 backdrop-blur-sm hover:bg-primary/5"
            )}
          >
            <div className="flex items-center gap-2 relative z-10">
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 animate-pulse" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </div>
            {soundEnabled && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            )}
          </Button>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
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
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                        <span className="font-mono font-bold text-foreground">
                          {signal.symbol}
                        </span>
                      </div>
                      <DetailedSignalView 
                        signal={signal}
                        onFetchChartData={async (symbol) => {
                          // You can pass this as a prop or implement here
                          return [];
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-foreground font-semibold">
                      ${signal.currentPrice.toFixed(2)}
                      {signal.priceChangePercent24h !== undefined && (
                        <div className={cn(
                          "text-xs font-medium ml-2",
                          signal.priceChangePercent24h >= 0 ? "text-signal-long" : "text-signal-short"
                        )}>
                          {signal.priceChangePercent24h >= 0 ? '+' : ''}{signal.priceChangePercent24h.toFixed(2)}%
                        </div>
                      )}
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
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        signal.signalGrade === 'A' && "bg-signal-long/20 text-signal-long border border-signal-long/30",
                        signal.signalGrade === 'B' && "bg-warning/20 text-warning border border-warning/30",
                        signal.signalGrade === 'C' && "bg-muted/20 text-muted-foreground border border-muted/30"
                      )}>
                        {signal.signalGrade}
                      </div>
                      <SignalStrengthIndicator signal={signal} />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      {(() => {
                        const config = getTradeButtonConfig(signal);
                        return (
                          <Button
                            size="sm"
                            disabled={config.disabled}
                            className={cn(
                              "min-w-[120px] font-bold text-sm transition-all duration-300 hover:scale-105",
                              config.className,
                              config.pulse && "animate-pulse"
                            )}
                            onClick={() => {
                              if (!config.disabled) {
                                window.open(config.url, '_blank');
                              }
                            }}
                          >
                            {config.text}
                          </Button>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 p-4">
          {signals.map((signal, index) => (
            <div 
              key={signal.symbol}
              className={cn(
                "relative p-4 rounded-xl border glass-card animate-fade-in",
                signal.signal === 'Long Signal' && "border-l-4 border-l-signal-long bg-signal-long/5",
                signal.signal === 'Short Signal' && "border-l-4 border-l-signal-short bg-signal-short/5",
                signal.signal === 'Neutral' && "border-l-4 border-l-muted bg-muted/5"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header with Symbol, Price and Grade */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse" />
                  <span className="font-mono font-bold text-lg text-foreground">
                    {signal.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    signal.signalGrade === 'A' && "bg-signal-long/20 text-signal-long border border-signal-long/30",
                    signal.signalGrade === 'B' && "bg-warning/20 text-warning border border-warning/30",
                    signal.signalGrade === 'C' && "bg-muted/20 text-muted-foreground border border-muted/30"
                  )}>
                    {signal.signalGrade}
                  </div>
                  <DetailedSignalView 
                    signal={signal}
                    onFetchChartData={async (symbol) => {
                      return [];
                    }}
                  />
                </div>
              </div>

              {/* Price and Price Change */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-foreground">
                    ${signal.currentPrice.toFixed(2)}
                  </span>
                  {signal.priceChangePercent24h !== undefined && (
                    <span className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full",
                      signal.priceChangePercent24h >= 0 
                        ? "text-signal-long bg-signal-long/10" 
                        : "text-signal-short bg-signal-short/10"
                    )}>
                      {signal.priceChangePercent24h >= 0 ? '+' : ''}{signal.priceChangePercent24h.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Main Signal */}
              <div className="flex items-center gap-3 mb-4">
                {getSignalIcon(signal.signal)}
                <span className={cn(
                  "text-lg font-bold",
                  getSignalClassName(signal.signal)
                )}>
                  {signal.signal}
                </span>
                <SignalStrengthIndicator signal={signal} />
              </div>

              {/* Indicator Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground font-medium">Cloud Status</div>
                  <div className={cn(
                    "font-semibold",
                    signal.cloudStatus === 'Above Cloud' && "text-signal-long",
                    signal.cloudStatus === 'Below Cloud' && "text-signal-short",
                    signal.cloudStatus === 'In Cloud' && "text-muted-foreground"
                  )}>
                    {signal.cloudStatus}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground font-medium">TK Cross</div>
                  <div className={cn(
                    "font-semibold",
                    signal.tkCross === 'Bullish Cross' && "text-signal-long",
                    signal.tkCross === 'Bearish Cross' && "text-signal-short",
                    signal.tkCross === 'No Cross' && "text-muted-foreground"
                  )}>
                    {signal.tkCross}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground font-medium">Chikou Span</div>
                  <div className={cn(
                    "font-semibold",
                    signal.chikouSpanStatus === 'Above' && "text-signal-long",
                    signal.chikouSpanStatus === 'Below' && "text-signal-short",
                    signal.chikouSpanStatus === 'Equal' && "text-muted-foreground"
                  )}>
                    {signal.chikouSpanStatus}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-muted-foreground font-medium">RSI (14)</div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      signal.rsi > 70 && "bg-signal-short animate-pulse",
                      signal.rsi < 30 && "bg-signal-long animate-pulse",
                      signal.rsi >= 30 && signal.rsi <= 70 && "bg-muted-foreground"
                    )} />
                    <span className="font-mono font-semibold">
                      {signal.rsi.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trade Now Button */}
              <div className="mt-4 pt-4 border-t border-border/50">
                {(() => {
                  const config = getTradeButtonConfig(signal);
                  return (
                    <Button
                      size="lg"
                      disabled={config.disabled}
                      className={cn(
                        "w-full font-bold text-base h-12 transition-all duration-300 hover:scale-[1.02]",
                        config.className,
                        config.pulse && "animate-pulse"
                      )}
                      onClick={() => {
                        if (!config.disabled) {
                          window.open(config.url, '_blank');
                        }
                      }}
                    >
                      {config.text}
                    </Button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignalsTable;