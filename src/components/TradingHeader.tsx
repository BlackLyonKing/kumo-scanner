import WalletConnect from "./WalletConnect";
import ApiHealthIndicator from "./ApiHealthIndicator";
import { TrialCountdown } from "./TrialCountdown";
import MeshStatus from "./MeshStatus";
import ThemeToggle from "./ThemeToggle";
import blkLogo from "/lovable-uploads/b1afa972-7ed7-4b6c-8fa9-e150b28a48e3.png";

interface TradingHeaderProps {
  isScanning?: boolean;
  signalCount?: number;
}

const TradingHeader = ({ isScanning = false, signalCount = 0 }: TradingHeaderProps) => {
  return (
    <header className="relative animate-fade-in mb-4">
      {/* Subtle ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl pointer-events-none opacity-60" />

      {/* Single unified command bar */}
      <div className="relative glass-card px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 p-1.5 bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl">
            <img
              src={blkLogo}
              alt="B.L.K Trading Tools"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight leading-none">
                <span className="text-gradient">B.L.K</span>
                <span className="text-foreground ml-1.5">Trading</span>
              </h1>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider text-primary uppercase">Live</span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-tight mt-0.5 hidden sm:block">
              Ichimoku analysis · <span className="text-primary">high-probability</span> signals
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <ApiHealthIndicator />
          <MeshStatus isScanning={isScanning} signalCount={signalCount} />
          <TrialCountdown />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default TradingHeader;
