import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { TradingSignal } from "@/types/trading";

interface WatchlistManagerProps {
  signals: TradingSignal[];
}

interface WatchlistItem {
  id: string;
  wallet_address: string;
  symbol: string;
  blockchain: string;
  added_at: string;
}

const WatchlistManager = ({ signals }: WatchlistManagerProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: watchlist } = useQuery({
    queryKey: ["watchlist", wallet?.address],
    queryFn: async () => {
      if (!wallet?.address) return [];
      const { data, error } = await supabase
        .from("user_watchlists")
        .select("*")
        .eq("wallet_address", wallet.address)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data as WatchlistItem[];
    },
    enabled: !!wallet?.address,
  });

  const addToWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      if (!wallet?.address) throw new Error("Wallet not connected");
      
      const { error } = await supabase.from("user_watchlists").insert({
        wallet_address: wallet.address,
        symbol,
        blockchain: "Binance",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "Signal added to your watchlist",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_watchlists")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({
        title: "Removed from Watchlist",
        description: "Signal removed from your watchlist",
      });
    },
  });

  const isInWatchlist = (symbol: string) => {
    return watchlist?.some((item) => item.symbol === symbol);
  };

  if (!wallet?.address) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Watchlist
          </CardTitle>
          <CardDescription>Connect your wallet to save favorites</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-warning" />
          Your Watchlist ({watchlist?.length || 0})
        </CardTitle>
        <CardDescription>Track your favorite trading pairs</CardDescription>
      </CardHeader>
      <CardContent>
        {watchlist && watchlist.length > 0 ? (
          <div className="space-y-2">
            {watchlist.map((item) => {
              const signal = signals.find((s) => s.symbol === item.symbol);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-muted/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <div>
                      <p className="font-semibold">{item.symbol}</p>
                      {signal && (
                        <div className="flex gap-2 mt-1">
                          <Badge
                            variant={
                              signal.signal === "Long Signal"
                                ? "default"
                                : signal.signal === "Short Signal"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {signal.signal}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Grade {signal.signalGrade}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWatchlist.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No signals in watchlist yet</p>
            <p className="text-sm mt-1">Add signals using the star button</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistManager;
