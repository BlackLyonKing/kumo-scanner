import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import TradingHeader from "@/components/TradingHeader";
import RiskWarning from "@/components/RiskWarning";
import ScanControls from "@/components/ScanControls";
import SignalsTable from "@/components/SignalsTable";
import ScanProgress from "@/components/ScanProgress";
import SignalFilters from "@/components/SignalFilters";
import IchimokuEducation from "@/components/IchimokuEducation";
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
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [signalFilter, setSignalFilter] = useState("all");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Filter and sort signals
  const filteredAndSortedSignals = useMemo(() => {
    let filtered = signals;
    
    // Apply signal filter
    if (signalFilter !== "all") {
      filtered = signals.filter(signal => signal.signal === signalFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'signal':
          const signalOrder = { 'Long Signal': 2, 'Short Signal': 1, 'Neutral': 0 };
          comparison = signalOrder[a.signal] - signalOrder[b.signal];
          break;
        case 'symbol':
        default:
          comparison = a.symbol.localeCompare(b.symbol);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [signals, signalFilter, sortBy, sortOrder]);

  const scanMarkets = async () => {
    setIsScanning(true);
    setStatusMessage('Initializing scan...');
    setSignals([]);
    setScanProgress(0);
    
    try {
      const results: TradingSignal[] = [];
      
      for (let i = 0; i < SYMBOLS.length; i++) {
        const symbol = SYMBOLS[i];
        setCurrentSymbol(symbol);
        setStatusMessage(`Scanning ${symbol}...`);
        setScanProgress((i / SYMBOLS.length) * 100);
        
        const data = await fetchHistoricalData(symbol);
        
        if (data && data.length > 0) {
          const ichimoku = calculateIchimoku(data);
          const signal = generateTradingSignal(symbol, ichimoku);
          results.push(signal);
          
          // Update results progressively for better UX
          setSignals([...results]);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setScanProgress(100);
      setSignals(results);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatusMessage('');
      
      const longSignals = results.filter(r => r.signal === 'Long Signal').length;
      const shortSignals = results.filter(r => r.signal === 'Short Signal').length;
      
      toast({
        title: "Scan Complete! 🎯",
        description: `Found ${longSignals} long signals and ${shortSignals} short signals across ${results.length} pairs`,
      });
      
    } catch (error) {
      console.error('Scanning error:', error);
      setStatusMessage('Error scanning markets. Please try again.');
      toast({
        title: "Scan Failed ❌",
        description: "Unable to fetch market data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setCurrentSymbol("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <TradingHeader />
        <RiskWarning />
        <ScanControls 
          onScan={scanMarkets}
          isScanning={isScanning}
          lastUpdated={lastUpdated}
        />
        
        <ScanProgress 
          currentSymbol={currentSymbol}
          progress={scanProgress}
          totalSymbols={SYMBOLS.length}
          isVisible={isScanning}
        />
        
        {signals.length > 0 && (
          <SignalFilters
            signalFilter={signalFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSignalFilterChange={setSignalFilter}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        )}
        
        <SignalsTable 
          signals={filteredAndSortedSignals}
          isLoading={isScanning && signals.length === 0}
          statusMessage={statusMessage}
        />
        
        <div className="mt-8">
          <IchimokuEducation />
        </div>
      </div>
    </div>
  );
};

export default Index;
