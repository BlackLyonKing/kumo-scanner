import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AutoRefreshToggle from "./AutoRefreshToggle";

interface ScanControlsProps {
  onScan: () => Promise<void>;
  isScanning: boolean;
  lastUpdated: string | null;
}

const ScanControls = ({ onScan, isScanning, lastUpdated }: ScanControlsProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 animate-fade-in">
      <div className="glass-card px-4 py-3 rounded-xl">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium">Last Market Scan:</span>
            <div className="font-mono text-foreground font-semibold">
              {lastUpdated || 'Not scanned yet'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AutoRefreshToggle onAutoScan={onScan} isScanning={isScanning} />
        
        <Button 
          onClick={onScan}
          disabled={isScanning}
          className="premium-button text-white font-bold py-3 px-8 rounded-xl text-lg hover:scale-105 transition-all duration-300 disabled:hover:scale-100 disabled:opacity-60"
        >
          {isScanning ? (
            <>
              <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
              Scanning Markets...
            </>
          ) : (
            <>
              <RefreshCw className="mr-3 h-5 w-5" />
              Scan Markets
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScanControls;