import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TradingSignal } from "@/types/trading";
import { useToast } from "@/hooks/use-toast";

interface ExportSignalsProps {
  signals: TradingSignal[];
}

const ExportSignals = ({ signals }: ExportSignalsProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (signals.length === 0) {
      toast({
        title: "No Data",
        description: "No signals to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Symbol",
      "Signal Type",
      "Grade",
      "Current Price",
      "Cloud Status",
      "TK Cross",
      "Chikou Status",
      "RSI",
      "Price Change 24h%",
      "Volume 24h",
      "Signal Strength",
      "Timestamp",
    ];

    const rows = signals.map((signal) => [
      signal.symbol,
      signal.signal,
      signal.signalGrade,
      signal.currentPrice,
      signal.cloudStatus,
      signal.tkCross,
      signal.chikouSpanStatus,
      signal.rsi,
      signal.priceChangePercent24h || "N/A",
      signal.volume24h || "N/A",
      signal.signalStrength || "N/A",
      new Date().toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `trading-signals-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${signals.length} signals exported to CSV`,
    });
  };

  return (
    <Button
      onClick={exportToCSV}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};

export default ExportSignals;
