import { Shield } from "lucide-react";

const VpnNotice = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-warning/20 bg-warning/5 text-2xs">
      <Shield className="h-3 w-3 text-warning shrink-0" />
      <span className="font-mono uppercase tracking-wider text-warning font-bold">VPN</span>
      <span className="text-muted-foreground truncate">
        Binance API may be geo-blocked · Use a VPN if you see connection issues
      </span>
    </div>
  );
};

export default VpnNotice;
