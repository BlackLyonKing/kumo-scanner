import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RiskWarning = () => {
  return (
    <Card className="border-destructive/50 bg-destructive/5 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-destructive mb-2">
              WARNING: High-Leverage Trading
            </h3>
            <p className="text-sm text-destructive/80 leading-relaxed">
              This tool is for educational and analytical purposes only. Trading on margin 
              with 20x leverage is extremely risky and can lead to rapid and substantial losses. 
              The signals provided are based on a simple Ichimoku strategy and do not guarantee 
              profitable trades. Always perform your own research and risk management before 
              entering any position.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskWarning;