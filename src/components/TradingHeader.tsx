import { Activity, TrendingUp, Sparkles } from "lucide-react";

const TradingHeader = () => {
  return (
    <header className="relative text-center mb-8 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="relative p-4 glass-card rounded-2xl">
            <TrendingUp className="h-10 w-10 text-primary animate-pulse-glow" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
              Ichimoku Scanner
            </h1>
            <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          <div className="relative p-4 glass-card rounded-2xl">
            <Activity className="h-10 w-10 text-signal-long animate-pulse-glow" />
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-success rounded-full animate-ping" />
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-lg font-medium">
          Advanced Ichimoku analysis for{" "}
          <span className="text-primary font-semibold">high-probability</span> trading signals
        </p>
      </div>
    </header>
  );
};

export default TradingHeader;