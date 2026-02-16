import { Activity } from "lucide-react";
import WalletConnect from "./WalletConnect";
import ApiHealthIndicator from "./ApiHealthIndicator";
import { TrialCountdown } from "./TrialCountdown";
import blkLogo from "/lovable-uploads/b1afa972-7ed7-4b6c-8fa9-e150b28a48e3.png";

const TradingHeader = () => {
  return (
    <header className="relative animate-fade-in">
      {/* Subtle ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl pointer-events-none opacity-60" />
      
      <div className="relative">
        {/* Top bar with status indicators */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <ApiHealthIndicator />
          <TrialCountdown />
          <WalletConnect />
        </div>
        
        {/* Main branding */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-3 bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-2xl">
              <img 
                src={blkLogo} 
                alt="B.L.K Trading Tools" 
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
              />
            </div>
          </div>
          
          {/* Title and tagline */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                <span className="text-gradient">B.L.K</span>
                <span className="text-foreground ml-2">Trading Tools</span>
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase">Mesh Live</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Advanced Ichimoku analysis for{" "}
              <span className="text-primary font-medium">high-probability</span> signals
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TradingHeader;
