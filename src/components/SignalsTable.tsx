import { TradingSignal } from "@/types/trading";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SignalsTableProps {
  signals: TradingSignal[];
  isLoading: boolean;
  statusMessage: string;
}

const SignalsTable = ({ signals, isLoading, statusMessage }: SignalsTableProps) => {
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

  if (isLoading || signals.length === 0) {
    return (
      <Card className="bg-card border-border">
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
    <Card className="bg-card border-border">
      <CardContent className="p-0">
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
              {signals.map((signal) => (
                <tr key={signal.symbol} className="hover:bg-accent/50 transition-colors">
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