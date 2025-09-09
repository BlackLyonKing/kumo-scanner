import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

const VpnNotice = () => {
  return (
    <Alert className="mb-6 border-warning/50 bg-warning/10">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertDescription className="text-sm">
        <div className="flex items-center gap-2 font-medium text-warning mb-2">
          <Shield className="h-4 w-4" />
          VPN Required for API Access
        </div>
        <p className="text-muted-foreground">
          This app uses live Binance API data which may be geo-blocked in some regions. 
          If you're experiencing connection issues, please use a VPN to access the real-time trading data.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default VpnNotice;