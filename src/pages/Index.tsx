import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TradingHeader from "@/components/TradingHeader";
import RiskWarning from "@/components/RiskWarning";
import ScanControls from "@/components/ScanControls";
import SignalsTable from "@/components/SignalsTable";
import { TradingSignal } from "@/types/trading";
import { 
  fetchHistoricalData, 
  calculateIchimoku, 
  generateTradingSignal, 
  SYMBOLS 
} from "@/utils/ichimoku";

const Index = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Click 'Scan Markets' to begin.");
  const { toast } = useToast();

  const scanMarkets = async () => {
    setIsScanning(true);
    setStatusMessage('Scanning markets... Please wait.');
    setSignals([]);
    
    try {
      const results: TradingSignal[] = [];
      
      for (const symbol of SYMBOLS) {
        setStatusMessage(`Scanning ${symbol}...`);
        
        const data = await fetchHistoricalData(symbol);
        
        if (data && data.length > 0) {
          const ichimoku = calculateIchimoku(data);
          const signal = generateTradingSignal(symbol, ichimoku);
          results.push(signal);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setSignals(results);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatusMessage('');
      
      const longSignals = results.filter(r => r.signal === 'Long Signal').length;
      const shortSignals = results.filter(r => r.signal === 'Short Signal').length;
      
      toast({
        title: "Scan Complete",
        description: `Found ${longSignals} long signals and ${shortSignals} short signals`,
      });
      
    } catch (error) {
      console.error('Scanning error:', error);
      setStatusMessage('Error scanning markets. Please try again.');
      toast({
        title: "Scan Failed",
        description: "Unable to fetch market data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <TradingHeader />
        <RiskWarning />
        <ScanControls 
          onScan={scanMarkets}
          isScanning={isScanning}
          lastUpdated={lastUpdated}
        />
        <SignalsTable 
          signals={signals}
          isLoading={isScanning}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
};

export default Index;
