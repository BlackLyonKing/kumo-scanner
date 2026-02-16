import React from "react";

interface MeshStatusProps {
  isScanning: boolean;
  signalCount: number;
}

const MeshStatus = ({ isScanning, signalCount }: MeshStatusProps) => {
  const statuses = [
    {
      label: "Alpha",
      sublabel: isScanning ? "Sniper_Scanning" : signalCount > 0 ? "Sniper_Ready" : "Sniper_Idle",
      active: isScanning,
    },
    {
      label: "Gamma",
      sublabel: signalCount > 0 ? "Sentinel_Live" : "Sentinel_Standby",
      active: signalCount > 0,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {statuses.map((status) => (
        <div
          key={status.label}
          className={`glass-card px-4 py-2.5 flex flex-col items-center min-w-[110px] transition-all ${
            status.active ? "border-primary/30" : ""
          }`}
        >
          <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted-foreground">
            {status.label}
          </span>
          <span
            className={`font-mono text-xs font-bold ${
              status.active ? "text-primary" : "text-foreground/60"
            }`}
          >
            {status.sublabel}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MeshStatus;
