import { useState, useEffect } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AutoRefreshToggleProps {
  onAutoScan: () => void;
  isScanning: boolean;
}

const AutoRefreshToggle = ({ onAutoScan, isScanning }: AutoRefreshToggleProps) => {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [interval, setInterval] = useState("300"); // 5 minutes default
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoRefresh && !isScanning && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isAutoRefresh && !isScanning && countdown === 0) {
      onAutoScan();
      setCountdown(parseInt(interval));
    }

    return () => clearTimeout(timer);
  }, [isAutoRefresh, isScanning, countdown, interval, onAutoScan]);

  const toggleAutoRefresh = () => {
    if (!isAutoRefresh) {
      setCountdown(parseInt(interval));
    } else {
      setCountdown(0);
    }
    setIsAutoRefresh(!isAutoRefresh);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="glass-card px-3 py-2 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/20 rounded-lg">
            <RotateCcw className={cn(
              "h-4 w-4 text-primary transition-transform duration-300",
              isAutoRefresh && "animate-spin"
            )} />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Auto-refresh:</span>
            <Select value={interval} onValueChange={setInterval} disabled={isAutoRefresh}>
              <SelectTrigger className="w-[90px] h-8 text-xs border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="60">1 min</SelectItem>
                <SelectItem value="300">5 min</SelectItem>
                <SelectItem value="600">10 min</SelectItem>
                <SelectItem value="1800">30 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleAutoRefresh}
        disabled={isScanning}
        className={cn(
          "glass-card border-primary/30 hover:bg-primary/10 transition-all duration-300",
          isAutoRefresh && "bg-primary/20 border-primary/50 animate-pulse-glow"
        )}
      >
        {isAutoRefresh ? (
          <>
            <Pause className="mr-2 h-4 w-4" />
            <span className="font-mono text-xs">
              {countdown > 0 ? formatTime(countdown) : "Active"}
            </span>
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Start Auto
          </>
        )}
      </Button>
    </div>
  );
};

export default AutoRefreshToggle;