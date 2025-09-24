import React, { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingHeader from "@/components/TradingHeader";
import RiskWarning from "@/components/RiskWarning";
import ScanControls from "@/components/ScanControls";
import SignalsTable from "@/components/SignalsTable";
import ScanProgress from "@/components/ScanProgress";
import SignalFilters from "@/components/SignalFilters";
import IchimokuEducation from "@/components/IchimokuEducation";
import PremiumEducation from "@/components/PremiumEducation";
import EntryTimer from "@/components/EntryTimer";
import { TradingSignal } from "@/types/trading";
import { 
  fetchHistoricalData, 
  calculateIchimokuAndRSI, 
  generateTradingSignal, 
  getTradingSymbols,
  SCAN_PRESETS,
  sendNotification,
  SYMBOLS 
} from "@/utils/ichimoku";
import GeminiAnalysis from "@/components/GeminiAnalysis";
import NotificationSettings from "@/components/NotificationSettings";
import VpnNotice from "@/components/VpnNotice";
import { MarketData } from "@/components/MarketData";

const Index = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Click 'Scan Markets' to begin.");
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [signalFilter, setSignalFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Filter and sort signals
  const filteredAndSortedSignals = useMemo(() => {
    let filtered = signals;
    
    // Apply signal filter
    if (signalFilter !== "all") {
      filtered = filtered.filter(signal => signal.signal === signalFilter);
    }
    
    // Apply grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter(signal => signal.signalGrade === gradeFilter);
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
  }, [signals, signalFilter, gradeFilter, sortBy, sortOrder]);

  const scanMarkets = async (scanType: string = 'usdt_only') => {
    setIsScanning(true);
    setStatusMessage('Fetching available symbols...');
    setSignals([]);
    setScanProgress(0);
    
    try {
      // Get symbols based on selected scan type
      const symbolsToScan = await getTradingSymbols(SCAN_PRESETS[scanType as keyof typeof SCAN_PRESETS]);
      
      if (symbolsToScan.length === 0) {
        throw new Error('No symbols available to scan');
      }

      setStatusMessage(`Fetching historical data for ${symbolsToScan.length} symbols...`);
      
      // Fetch all data concurrently for better performance
      const promises = symbolsToScan.map(async (symbol, index) => {
        setCurrentSymbol(symbol);
        setScanProgress((index / symbolsToScan.length) * 50);
        
        const dailyData = await fetchHistoricalData(symbol, '1d');
        const fourHourData = await fetchHistoricalData(symbol, '4h');
        return { symbol, dailyData, fourHourData };
      });

      const fetchedData = await Promise.all(promises);
      setStatusMessage('Analyzing and grading signals...');

      // Process fetched data
      const results: TradingSignal[] = [];
      
      fetchedData.forEach(({ symbol, dailyData, fourHourData }, index) => {
        setScanProgress(50 + (index / fetchedData.length) * 50);
        
        if (!dailyData || !fourHourData) {
          return;
        }

        const dailyIchimoku = calculateIchimokuAndRSI(dailyData);
        const fourHourIchimoku = calculateIchimokuAndRSI(fourHourData);
        const enhancedSignal = generateTradingSignal(
          symbol, 
          dailyIchimoku, 
          fourHourIchimoku,
          Math.random() * 10 - 5, // Mock 24h price change
          Math.random() * 1000000 // Mock volume
        );
        
        // Send notification for Grade A signals
        if (enhancedSignal.signalGrade === 'A') {
          sendNotification(enhancedSignal.symbol, enhancedSignal.signal);
        }
        
        results.push(enhancedSignal);
      });
      
      setScanProgress(100);
      setSignals(results);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatusMessage('');
      
      const longSignals = results.filter(r => r.signal === 'Long Signal').length;
      const shortSignals = results.filter(r => r.signal === 'Short Signal').length;
      const gradeA = results.filter(r => r.signalGrade === 'A').length;
      
      toast({
        title: "Scan Complete! 🎯",
        description: `Found ${gradeA} Grade A signals (${longSignals} long, ${shortSignals} short) across ${results.length} pairs`,
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
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-4 max-w-7xl relative z-10">
        <TradingHeader />
        <VpnNotice />
        <RiskWarning />
        
        <Tabs defaultValue="scanner" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner" className="space-y-4 mt-4">
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <ScanControls 
                  onScan={scanMarkets}
                  isScanning={isScanning}
                  lastUpdated={lastUpdated}
                />
              </div>
              <div>
                <EntryTimer />
              </div>
            </div>
            
            <ScanProgress 
              currentSymbol={currentSymbol}
              progress={scanProgress}
              totalSymbols={SYMBOLS.length}
              isVisible={isScanning}
            />
            
            {signals.length > 0 && (
              <SignalFilters
                signalFilter={signalFilter}
                gradeFilter={gradeFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSignalFilterChange={setSignalFilter}
                onGradeFilterChange={setGradeFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
              />
            )}
            
            <SignalsTable 
              signals={filteredAndSortedSignals}
              isLoading={isScanning && signals.length === 0}
              statusMessage={statusMessage}
            />
          </TabsContent>
          
          <TabsContent value="market" className="mt-4">
            <MarketData />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4 mt-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <NotificationSettings />
              <GeminiAnalysis signals={filteredAndSortedSignals} />
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4 mt-4">
            <IchimokuEducation />
            <PremiumEducation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
