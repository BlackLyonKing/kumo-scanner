import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Activity } from "lucide-react";

interface SignalStats {
  total_signals: number;
  active_signals: number;
  closed_signals: number;
  win_rate: number;
  avg_pnl: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
}

const PerformanceStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["performance-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("signal_history").select("*");

      if (error) throw error;

      const total = data.length;
      const active = data.filter((s) => s.status === "active").length;
      const closed = data.filter((s) => s.status === "closed").length;
      const winners = data.filter((s) => s.status === "closed" && (s.pnl_percentage || 0) > 0).length;
      const avgPnl = closed > 0 
        ? data
            .filter((s) => s.status === "closed")
            .reduce((sum, s) => sum + (s.pnl_percentage || 0), 0) / closed
        : 0;

      return {
        total_signals: total,
        active_signals: active,
        closed_signals: closed,
        win_rate: closed > 0 ? (winners / closed) * 100 : 0,
        avg_pnl: avgPnl,
        grade_a_count: data.filter((s) => s.grade === "A").length,
        grade_b_count: data.filter((s) => s.grade === "B").length,
        grade_c_count: data.filter((s) => s.grade === "C").length,
      } as SignalStats;
    },
  });

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Loading performance stats...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!stats || stats.total_signals === 0) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Performance Statistics
          </CardTitle>
          <CardDescription>
            No historical data available yet. Signal tracking will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Performance Statistics
        </CardTitle>
        <CardDescription>
          Historical signal performance and accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Signals</p>
            <p className="text-3xl font-bold">{stats.total_signals}</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Active: {stats.active_signals}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Closed: {stats.closed_signals}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              {stats.win_rate.toFixed(1)}%
              {stats.win_rate >= 50 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </p>
            <Badge
              variant={stats.win_rate >= 50 ? "default" : "destructive"}
              className="text-xs"
            >
              {stats.closed_signals} completed
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average P&L</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              {stats.avg_pnl >= 0 ? "+" : ""}
              {stats.avg_pnl.toFixed(2)}%
              {stats.avg_pnl >= 0 ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </p>
            <Badge
              variant={stats.avg_pnl >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              Per closed signal
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Signal Distribution</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{stats.grade_a_count}</p>
                <Badge variant="outline" className="text-xs">Grade A</Badge>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{stats.grade_b_count}</p>
                <Badge variant="outline" className="text-xs">Grade B</Badge>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{stats.grade_c_count}</p>
                <Badge variant="outline" className="text-xs">Grade C</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceStats;
