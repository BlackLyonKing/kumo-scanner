import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ScanProgressProps {
  currentSymbol: string;
  progress: number;
  totalSymbols: number;
  isVisible: boolean;
}

const ScanProgress = ({ currentSymbol, progress, totalSymbols, isVisible }: ScanProgressProps) => {
  if (!isVisible) return null;

  return (
    <Card className="mb-6 animate-fade-in bg-card/50 backdrop-blur-sm border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                Scanning {currentSymbol}...
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% ({Math.floor(progress * totalSymbols / 100)}/{totalSymbols})
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 animate-progress"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanProgress;