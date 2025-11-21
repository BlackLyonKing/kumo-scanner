import React, { useState } from "react";
import { TradingSignal, ChartDataPoint } from "@/types/trading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IchimokuChart from "./IchimokuChart";
import CandlestickChart from "./CandlestickChart";
import SignalStrengthIndicator from "./SignalStrengthIndicator";
import PriceMetrics from "./PriceMetrics";
import { Eye, TrendingUp, BarChart3, Target } from "lucide-react";

interface DetailedSignalViewProps {
  signal: TradingSignal;
  onFetchChartData?: (symbol: string) => Promise<ChartDataPoint[]>;
}

const DetailedSignalView = ({ signal, onFetchChartData }: DetailedSignalViewProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChart = async () => {
    if (!onFetchChartData || chartData.length > 0) return;
    
    setIsLoadingChart(true);
    try {
      const data = await onFetchChartData(signal.symbol);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleOpenChart}
          className="group relative overflow-hidden bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
        >
          <div className="flex items-center gap-2 relative z-10">
            <Eye className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
            <span className="font-medium">View Details</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 pointer-events-none" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold">{signal.symbol}</span>
              <div className="text-sm text-muted-foreground font-normal">
                Detailed Analysis • ${signal.currentPrice.toFixed(2)}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Metrics and Signal Strength */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceMetrics signal={signal} />
            <SignalStrengthIndicator signal={signal} showDetailed={true} />
          </div>

          {/* Charts */}
          {isLoadingChart ? (
            <div className="glass-card p-12 rounded-xl">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-primary text-lg font-semibold">
                  Loading Chart Data...
                </div>
                <div className="text-muted-foreground">
                  Fetching historical price data and indicators
                </div>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <Tabs defaultValue="ichimoku" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ichimoku" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ichimoku Cloud
                </TabsTrigger>
                <TabsTrigger value="candlestick" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Candlestick
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ichimoku" className="space-y-4">
                <IchimokuChart 
                  data={chartData} 
                  symbol={signal.symbol}
                  height={500}
                />
              </TabsContent>
              
              <TabsContent value="candlestick" className="space-y-4">
                <CandlestickChart 
                  data={chartData} 
                  symbol={signal.symbol}
                  height={500}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="glass-card p-12 rounded-xl text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="text-muted-foreground">
                Chart data will be loaded when you open the detailed view
              </div>
            </div>
          )}

          {/* Signal Details */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Signal Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Ichimoku Components
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cloud Status:</span>
                    <span className="font-medium">{signal.cloudStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TK Cross:</span>
                    <span className="font-medium">{signal.tkCross}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chikou Span:</span>
                    <span className="font-medium">{signal.chikouSpanStatus}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Technical Indicators
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>RSI (14):</span>
                    <span className="font-mono font-medium">{signal.rsi.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Grade:</span>
                    <span className="font-bold text-lg">{signal.signalGrade}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Trading Signal
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Direction:</span>
                    <span className="font-medium">{signal.signal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entry Price:</span>
                    <span className="font-mono font-medium">${signal.currentPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedSignalView;