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
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Last updated:</span>
        <span className="font-mono text-foreground">
          {lastUpdated || '...'}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AutoRefreshToggle onAutoScan={onScan} isScanning={isScanning} />
        
        <Button 
          onClick={onScan}
          disabled={isScanning}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none"
        >
          {isScanning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Markets
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScanControls;