import { Activity, TrendingUp } from "lucide-react";

const TradingHeader = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Ichimoku Scanner
        </h1>
        <div className="p-3 bg-signal-long/10 rounded-xl">
          <Activity className="h-8 w-8 text-signal-long" />
        </div>
      </div>
      <p className="text-muted-foreground text-lg">
        Scanning Phemex pairs for high-probability Ichimoku signals
      </p>
    </header>
  );
};

export default TradingHeader;