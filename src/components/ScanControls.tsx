import { RefreshCw, Clock, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutoRefreshToggle from "./AutoRefreshToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScanControlsProps {
  onScan: (scanType?: string) => Promise<void>;
  isScanning: boolean;
  lastUpdated: string | null;
  scansRemaining?: number;
  scanLimit?: number;
  isPaid?: boolean;
  limitReached?: boolean;
}

const ScanControls = ({
  onScan,
  isScanning,
  lastUpdated,
  scansRemaining,
  scanLimit,
  isPaid,
  limitReached,
}: ScanControlsProps) => {
  const [selectedScanType, setSelectedScanType] = useState('binance_spot');

  const scanOptions = [
    { 
      value: 'binance_spot', 
      label: 'Binance Spot', 
      description: 'Top 50 USDT spot pairs',
      tokens: '50'
    },
    { 
      value: 'binance_futures', 
      label: 'Binance Futures', 
      description: 'Top 50 perpetual futures',
      tokens: '50'
    },
    { 
      value: 'phemex_futures', 
      label: 'Phemex Futures', 
      description: 'Top 50 USD perpetuals',
      tokens: '50'
    }
  ];

  const handleScan = () => {
    onScan(selectedScanType);
  };

  const selectedOption = scanOptions.find(opt => opt.value === selectedScanType);

  return (
    <div className="w-full animate-fade-in">
      <div className="glass-card p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground leading-tight">Market Scanner</h3>
              <p className="text-xs text-muted-foreground">Real-time opportunity analysis</p>
            </div>
          </div>

          {/* Right side: quota + last scan */}
          <div className="flex items-center gap-2">
            {!isPaid && typeof scansRemaining === 'number' && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md border",
                limitReached
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : scansRemaining <= 3
                    ? "bg-warning/10 border-warning/30 text-warning"
                    : "bg-primary/10 border-primary/30 text-primary"
              )}>
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-mono font-semibold">
                  {scansRemaining}/{scanLimit} trial scans left
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border border-border/30 rounded-md">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Last:</span>
              <span className="text-xs font-mono font-medium text-foreground">
                {lastUpdated || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Single-row controls — aligned heights */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={selectedScanType} onValueChange={setSelectedScanType}>
            <SelectTrigger className="h-11 w-full sm:w-56 bg-card border-border/50 hover:border-border transition-colors">
              <SelectValue placeholder="Select exchange" />
            </SelectTrigger>
            <SelectContent>
              {scanOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between gap-6 py-0.5">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                      {option.tokens}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-11 flex items-center">
            <AutoRefreshToggle
              onAutoScan={() => handleScan()}
              isScanning={isScanning}
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={isScanning}
            className={cn(
              "h-11 flex-1 min-w-[180px] text-sm font-bold rounded-lg transition-all duration-300",
              "bg-gradient-to-r from-primary to-primary/80",
              "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",
              "disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            )}
          >
            {isScanning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan {selectedOption?.tokens} Tokens
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanControls;
