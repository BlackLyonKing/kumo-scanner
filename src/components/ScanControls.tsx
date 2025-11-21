import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AutoRefreshToggle from "./AutoRefreshToggle";
import { useState } from "react";

interface ScanControlsProps {
  onScan: (scanType?: string) => Promise<void>;
  isScanning: boolean;
  lastUpdated: string | null;
}

const ScanControls = ({ onScan, isScanning, lastUpdated }: ScanControlsProps) => {
  const [selectedScanType, setSelectedScanType] = useState('usdt_only');

  const scanOptions = [
    { 
      value: 'usdt_only', 
      label: 'USDT Pairs Only', 
      description: '~50 tokens - Standard USDT trading pairs',
      tokens: '50'
    },
    { 
      value: 'major_pairs', 
      label: 'Major Pairs', 
      description: '~100 tokens - USDT, BTC, ETH pairs',
      tokens: '100'
    },
    { 
      value: 'binance_futures_all', 
      label: 'Binance Futures (All)', 
      description: '~300 tokens - All Binance perpetual futures',
      tokens: '300'
    },
    { 
      value: 'phemex_futures_all', 
      label: 'Phemex Futures (All)', 
      description: '~200 tokens - All Phemex perpetual futures',
      tokens: '200'
    },
    { 
      value: 'all_futures_combined', 
      label: 'All Futures Combined', 
      description: '~500 tokens - Binance + Phemex futures',
      tokens: '500'
    },
    { 
      value: 'comprehensive', 
      label: 'Comprehensive Spot', 
      description: '~200 tokens - All major base currencies',
      tokens: '200'
    },
    { 
      value: 'btc_pairs', 
      label: 'BTC Pairs Only', 
      description: '~50 tokens - Bitcoin trading pairs',
      tokens: '50'
    },
    { 
      value: 'eth_pairs', 
      label: 'ETH Pairs Only', 
      description: '~50 tokens - Ethereum trading pairs',
      tokens: '50'
    }
  ];

  const handleScan = () => {
    onScan(selectedScanType);
  };

  return (
    <div className="w-full animate-fade-in">
      <Card className="glass-card border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            Market Scanner Controls
          </CardTitle>
          <CardDescription>
            Choose your scan type and start analyzing market opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scan Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Scan Configuration
            </label>
            <Select value={selectedScanType} onValueChange={setSelectedScanType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                {scanOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col py-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          {option.tokens} tokens
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Last Updated Info */}
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
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <AutoRefreshToggle 
                onAutoScan={() => handleScan()} 
                isScanning={isScanning} 
              />
              
              <Button 
                onClick={handleScan}
                disabled={isScanning}
                className="premium-button text-white font-bold py-3 px-6 sm:px-8 rounded-xl text-base sm:text-lg hover:scale-105 transition-all duration-300 disabled:hover:scale-100 disabled:opacity-60 min-h-[44px]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                    Scanning Markets...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-3 h-5 w-5" />
                    Scan {scanOptions.find(opt => opt.value === selectedScanType)?.tokens} Tokens
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanControls;