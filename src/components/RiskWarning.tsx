import { AlertTriangle } from "lucide-react";

const RiskWarning = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-destructive/20 bg-destructive/5 text-2xs">
      <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
      <span className="font-mono uppercase tracking-wider text-destructive font-bold">Risk</span>
      <span className="text-muted-foreground truncate">
        Educational use only · High-leverage trading involves substantial risk
      </span>
    </div>
  );
};

export default RiskWarning;
