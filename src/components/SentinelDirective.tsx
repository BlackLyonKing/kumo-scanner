import React from "react";
import { TradingSignal } from "@/types/trading";

interface SentinelDirectiveProps {
  signals: TradingSignal[];
  isScanning: boolean;
}

const getDirective = (signals: TradingSignal[], isScanning: boolean): string => {
  if (isScanning) {
    return "SCANNING MARKETS: NEURAL MESH ACTIVE — IDENTIFYING HIGH-CONVICTION CONFLUENCES...";
  }
  if (signals.length === 0) {
    return "STANDBY: AWAITING MARKET SCAN — INITIATE SCANNER TO DEPLOY SENTINEL GRID.";
  }

  const gradeA = signals.filter((s) => s.signalGrade === "A");
  const longA = gradeA.filter((s) => s.signal === "Long Signal").length;
  const shortA = gradeA.filter((s) => s.signal === "Short Signal").length;

  if (gradeA.length >= 5) {
    return `FULL DEPLOYMENT: ${gradeA.length} GRADE-A CONFLUENCES DETECTED — ${longA} LONG / ${shortA} SHORT. MAXIMUM CONVICTION ENGAGED.`;
  }
  if (gradeA.length >= 2) {
    return `ACTIVE SCAN: ${gradeA.length} HIGH-GRADE TARGETS ACQUIRED — SELECTIVE DEPLOYMENT RECOMMENDED.`;
  }
  if (gradeA.length === 1) {
    const top = gradeA[0];
    return `SINGLE TARGET: $${top.symbol.replace("USDT", "")} — ${top.signal.toUpperCase()} CONFIRMED AT ${top.signalStrength || 0}% STRENGTH.`;
  }
  return "LOW CONVICTION: NO GRADE-A CONFLUENCES — SENTINEL ON PASSIVE SURVEILLANCE.";
};

const SentinelDirective = ({ signals, isScanning }: SentinelDirectiveProps) => {
  const directive = getDirective(signals, isScanning);

  return (
    <div className="glass-card p-4 border-l-2 border-l-destructive/70">
      <span className="font-mono text-2xs tracking-[0.2em] uppercase text-destructive font-bold block mb-1.5">
        Sentinel Directive
      </span>
      <p className="font-mono text-xs leading-relaxed text-foreground/80">
        "{directive}"
      </p>
    </div>
  );
};

export default SentinelDirective;
