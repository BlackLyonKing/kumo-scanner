import { useEffect } from "react";
import { TradingSignal } from "@/types/trading";
import { useToast } from "@/hooks/use-toast";

export const useSignalAlerts = (signals: TradingSignal[], enabled: boolean = true) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled || signals.length === 0) return;

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check for Grade A signals
    const gradeASignals = signals.filter(
      (s) => s.signalGrade === "A" && s.signal !== "Neutral"
    );

    if (gradeASignals.length > 0) {
      // Show toast notification
      gradeASignals.forEach((signal) => {
        toast({
          title: `🚨 Grade A ${signal.signal}`,
          description: `${signal.symbol} at $${signal.currentPrice.toFixed(2)}`,
          duration: 10000,
        });

        // Show browser notification if permitted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Grade A ${signal.signal}`, {
            body: `${signal.symbol} at $${signal.currentPrice.toFixed(2)}`,
            icon: "/lovable-uploads/b1afa972-7ed7-4b6c-8fa9-e150b28a48e3.png",
            tag: signal.symbol,
          });
        }
      });
    }
  }, [signals, enabled, toast]);
};
