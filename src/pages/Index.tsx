import React, { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingHeader from "@/components/TradingHeader";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { useSubscription } from "@/hooks/useSubscription";
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
import ThemeToggle from "@/components/ThemeToggle";
import WatchlistManager from "@/components/WatchlistManager";
import PerformanceStats from "@/components/PerformanceStats";
import ExportSignals from "@/components/ExportSignals";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import { useSignalAlerts } from "@/hooks/useSignalAlerts";
import { useWalletTrial } from "@/hooks/useWalletTrial";
import MultiTimeframeDemo from "@/components/MultiTimeframeDemo";
import TimeframeTrendFilter from "@/components/TimeframeTrendFilter";
import { AdminPanel } from "@/components/AdminPanel";
import { useAdminRole } from "@/hooks/useAdminRole";
import { MetricCards } from "@/components/MetricCards";
import { TrialStatusBanner } from "@/components/TrialStatusBanner";

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
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [timeframeTrendFilter, setTimeframeTrendFilter] = useState<'bullish' | 'bearish' | 'both'>('both');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscription, loading: subLoading } = useSubscription();
  const { isConnected } = useWallet();
  const { isAdmin } = useAdminRole();

  // Check wallet connection
  useEffect(() => {
    if (!isConnected) {
      navigate('/auth');
    }
  }, [isConnected, navigate]);

  // Initialize wallet trial for new users
  useWalletTrial();
  
  // Enable browser notifications for Grade A signals
  useSignalAlerts(signals, alertsEnabled);

  // Filter and sort signals
  const filteredAndSortedSignals = useMemo(() => {
    let filtered = signals;
    
    // Apply timeframe trend filter
    if (timeframeTrendFilter !== 'both') {
      filtered = filtered.filter(signal => {
        if (timeframeTrendFilter === 'bullish') {
          return signal.signal === 'Long Signal';
        } else {
          return signal.signal === 'Short Signal';
        }
      });
    }
    
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
  }, [signals, signalFilter, gradeFilter, sortBy, sortOrder, timeframeTrendFilter]);

  const scanMarkets = async (scanType: string = 'usdt_only') => {
    setIsScanning(true);
    setStatusMessage('Fetching available symbols...');
    setSignals([]);
    setScanProgress(0);
    
    try {
      // Get symbols based on selected scan type
      const symbolsToScan = await getTradingSymbols(SCAN_PRESETS[scanType as keyof typeof SCAN_PRESETS]);
      
      if (symbolsToScan.length === 0) {
        throw new Error('No symbols available to scan. Please try a different scan type or check your internet connection.');
      }

      setStatusMessage(`Processing ${symbolsToScan.length} symbols...`);
      
      // Process in batches to avoid overwhelming APIs
      const BATCH_SIZE = 5;
      const results: TradingSignal[] = [];
      let processedCount = 0;
      
      for (let i = 0; i < symbolsToScan.length; i += BATCH_SIZE) {
        const batch = symbolsToScan.slice(i, i + BATCH_SIZE);
        
        // Process batch concurrently
        const batchPromises = batch.map(async (symbol) => {
          try {
            setCurrentSymbol(symbol);
            
            const dailyData = await fetchHistoricalData(symbol, '1d');
            const fourHourData = await fetchHistoricalData(symbol, '4h');
            
            if (!dailyData || !fourHourData) {
              console.warn(`Skipping ${symbol} - insufficient data`);
              return null;
            }

            const dailyIchimoku = calculateIchimokuAndRSI(dailyData);
            const fourHourIchimoku = calculateIchimokuAndRSI(fourHourData);
            const enhancedSignal = generateTradingSignal(
              symbol, 
              dailyIchimoku, 
              fourHourIchimoku,
              Math.random() * 10 - 5,
              Math.random() * 1000000
            );
            
            return enhancedSignal;
          } catch (error) {
            console.error(`Error processing ${symbol}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        
        // Add successful results
        batchResults.forEach(signal => {
          if (signal) {
            results.push(signal);
            if (signal.signalGrade === 'A') {
              sendNotification(signal.symbol, signal.signal);
            }
          }
        });
        
        processedCount += batch.length;
        setScanProgress((processedCount / symbolsToScan.length) * 100);
        setStatusMessage(`Processed ${processedCount}/${symbolsToScan.length} symbols...`);
      }
      
      if (results.length === 0) {
        throw new Error('No valid signals generated. Please try again.');
      }
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatusMessage('');
      toast({
        title: "Scan Failed ❌",
        description: errorMessage,
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
      <div className="container mx-auto px-4 sm:px-6 py-2 max-w-7xl relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <TradingHeader />
          </div>
          <ThemeToggle />
        </div>
        <TrialStatusBanner />
        <VpnNotice />
        <RiskWarning />
        
        <Tabs defaultValue="scanner" className="w-full mt-2">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="scanner">Scanner</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="scanner" className="space-y-3 mt-3">
            <SubscriptionGate feature="the Premium Scanner">
              <div className="grid lg:grid-cols-3 gap-3 mb-3">
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
                <>
                  <MetricCards signals={signals} />
                  
                  <div className="grid lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-3">
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
                    </div>
                    <div className="flex items-center gap-2">
                      <ExportSignals signals={filteredAndSortedSignals} />
                    </div>
                  </div>
                  
                  <div className="grid lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-3">
                      <PerformanceStats />
                    </div>
                    <div>
                      <TimeframeTrendFilter 
                        currentFilter={timeframeTrendFilter}
                        onFilterChange={setTimeframeTrendFilter}
                      />
                    </div>
                  </div>
                </>
              )}
            
            <SignalsTable 
              signals={filteredAndSortedSignals}
              isLoading={isScanning && signals.length === 0}
              statusMessage={statusMessage}
            />
            </SubscriptionGate>
          </TabsContent>
          
          <TabsContent value="watchlist" className="space-y-4 mt-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <WatchlistManager signals={signals} />
              <PerformanceStats />
            </div>
            {signals.length > 0 && (
              <SignalsTable 
                signals={filteredAndSortedSignals.filter(s => s.signal !== 'Neutral')}
                isLoading={false}
                statusMessage="Your watchlist signals"
              />
            )}
          </TabsContent>
          
          <TabsContent value="market" className="mt-4">
            <MarketData />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4 mt-4">
            <SubscriptionGate feature="Premium Analysis Tools">
              <MultiTimeframeDemo />
              
              <div className="grid lg:grid-cols-2 gap-4">
                <NotificationSettings />
                <GeminiAnalysis signals={filteredAndSortedSignals} />
              </div>
            </SubscriptionGate>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4 mt-4">
            <IchimokuEducation />
            <FAQ />
            <Testimonials />
            <PremiumEducation />
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="admin" className="space-y-4 mt-4">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
