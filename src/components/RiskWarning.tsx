import { AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RiskWarning = () => {
  return (
    <Card className="glass-card border-destructive/30 bg-destructive/5 mb-8 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent to-warning/10" />
      <CardContent className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="p-3 bg-destructive/20 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="h-7 w-7 text-destructive animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-warning rounded-full animate-ping" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-bold text-destructive">
                HIGH-LEVERAGE TRADING RISK
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-destructive/90 leading-relaxed font-medium">
                ⚠️ This tool is for <span className="font-semibold">educational and analytical purposes only</span>
              </p>
              <p className="text-sm text-destructive/80 leading-relaxed">
                Trading on margin with high leverage is <span className="font-semibold text-destructive">extremely risky</span> and 
                can lead to rapid and substantial losses. The signals provided are based on technical analysis 
                and do <span className="font-semibold">not guarantee profitable trades</span>.
              </p>
              <p className="text-xs text-warning font-medium mt-3 p-2 bg-warning/10 rounded-lg">
                💡 Always perform your own research and implement proper risk management
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskWarning;