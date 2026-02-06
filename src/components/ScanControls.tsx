import { RefreshCw, Clock, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutoRefreshToggle from "./AutoRefreshToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScanControlsProps {
  onScan: (scanType?: string) => Promise<void>;
  isScanning: boolean;
  lastUpdated: string | null;
}

const ScanControls = ({ onScan, isScanning, lastUpdated }: ScanControlsProps) => {
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
      <div className="glass-card p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Market Scanner</h3>
            <p className="text-sm text-muted-foreground">Analyze market opportunities in real-time</p>
          </div>
        </div>

        {/* Controls grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scan Type Select */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Exchange
            </label>
            <Select value={selectedScanType} onValueChange={setSelectedScanType}>
              <SelectTrigger className="w-full h-11 bg-card border-border/50 hover:border-border transition-colors">
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
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-3 px-4 py-3 bg-card/50 border border-border/30 rounded-xl">
            <div className="p-2 bg-muted rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Last scan</p>
              <p className="text-sm font-mono font-medium text-foreground truncate">
                {lastUpdated || 'Not scanned'}
              </p>
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="flex items-center">
            <AutoRefreshToggle 
              onAutoScan={() => handleScan()} 
              isScanning={isScanning} 
            />
          </div>

          {/* Scan Button */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Button 
              onClick={handleScan}
              disabled={isScanning}
              className={cn(
                "w-full h-11 text-base font-bold rounded-xl transition-all duration-300",
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
    </div>
  );
};

export default ScanControls;
