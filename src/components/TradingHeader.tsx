import { Activity, TrendingUp, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import blkLogo from "/lovable-uploads/b1afa972-7ed7-4b6c-8fa9-e150b28a48e3.png";

const TradingHeader = () => {
  return (
    <header className="relative text-center mb-8 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-3xl" />
      <div className="relative">
        {/* Top row with navigation and wallet connection */}
        <div className="flex justify-between items-center mb-4">
          <Link to="/education">
            <Button variant="outline" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Trading Education
            </Button>
          </Link>
          <WalletConnect />
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative p-2 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
            <TrendingUp className="h-6 w-6 sm:h-10 sm:w-10 text-primary animate-pulse-glow" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-accent animate-pulse" />
            </div>
          </div>
          <div className="text-center flex items-center gap-4">
            <img 
              src={blkLogo} 
              alt="B.L.K Trading Tools Logo" 
              className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain animate-pulse-glow"
            />
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                B.L.K Trading Tools
              </h1>
              <div className="h-1 w-16 sm:w-24 mx-auto rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
          </div>
          <div className="relative p-2 sm:p-4 glass-card rounded-xl sm:rounded-2xl">
            <Activity className="h-6 w-6 sm:h-10 sm:w-10 text-signal-long animate-pulse-glow" />
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-success rounded-full animate-ping" />
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm sm:text-lg font-medium px-4 text-center">
          Advanced Ichimoku analysis for{" "}
          <span className="text-primary font-semibold">high-probability</span> trading signals
        </p>
      </div>
    </header>
  );
};

export default TradingHeader;