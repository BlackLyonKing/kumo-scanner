import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

interface MarketStats {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

export const MarketData = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Top 50 cryptocurrencies by market cap - simplified list
  const TOP_50_LIMIT = 50;

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        // Fetch top 50 coins data
        const coinsResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${TOP_50_LIMIT}&page=1&sparkline=false`
        );
        
        if (!coinsResponse.ok) {
          throw new Error('Failed to fetch coins data');
        }
        
        const coinsData = await coinsResponse.json();
        
        // Fetch global market stats
        const globalResponse = await fetch(
          'https://api.coingecko.com/api/v3/global'
        );
        
        if (!globalResponse.ok) {
          throw new Error('Failed to fetch global data');
        }
        
        const globalData = await globalResponse.json();
        
        setCoins(coinsData);
        setMarketStats(globalData.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | null) => {
    if (price == null) return '$—';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number | null) => {
    if (marketCap == null) return '$—';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatChange = (val: number | null) => {
    if (val == null) return '0.00';
    return val.toFixed(2);
  };

  const getTopGainers = () => coins
    .filter(coin => (coin.price_change_percentage_24h ?? 0) > 0)
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, 10);

  const getTopLosers = () => coins
    .filter(coin => (coin.price_change_percentage_24h ?? 0) < 0)
    .sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive">Error loading market data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-2xl font-bold">
                    {formatMarketCap(marketStats.total_market_cap.usd)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <p className={cn(
                "text-sm flex items-center mt-2",
                marketStats.market_cap_change_percentage_24h_usd >= 0 
                  ? "text-green-600" 
                  : "text-red-600"
              )}>
                {marketStats.market_cap_change_percentage_24h_usd >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(marketStats.market_cap_change_percentage_24h_usd ?? 0).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-2xl font-bold">
                    {formatMarketCap(marketStats.total_volume.usd)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  <p className="text-2xl font-bold">
                    {(marketStats.market_cap_percentage?.btc ?? 0).toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ETH Dominance</p>
                  <p className="text-2xl font-bold">
                    {(marketStats.market_cap_percentage?.eth ?? 0).toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Data Tabs */}
      <Tabs defaultValue="top" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="top">Top Coins</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 50 Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coins.map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-muted-foreground w-8">
                        #{coin.market_cap_rank}
                      </div>
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <div className="flex items-center justify-end">
                        <Badge 
                          variant={(coin.price_change_percentage_24h ?? 0) >= 0 ? "default" : "destructive"}
                          className={cn(
                            "text-xs",
                            (coin.price_change_percentage_24h ?? 0) >= 0 
                              ? "bg-green-100 text-green-700 hover:bg-green-100" 
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          )}
                        >
                          {(coin.price_change_percentage_24h ?? 0) >= 0 ? '+' : ''}
                          {formatChange(coin.price_change_percentage_24h)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gainers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Top Gainers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTopGainers().map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        +{formatChange(coin.price_change_percentage_24h)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="losers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Top Losers (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTopLosers().map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        {formatChange(coin.price_change_percentage_24h)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};