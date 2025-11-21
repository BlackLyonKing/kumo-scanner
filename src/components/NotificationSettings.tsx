import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestNotificationPermission } from "@/utils/ichimoku";
import { cn } from "@/lib/utils";

const NotificationSettings = () => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled! 🔔",
          description: "You will now receive alerts for Grade A trading signals.",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "You will not receive signal alerts. You can enable them in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
    }
  };

  const getPermissionStatus = () => {
    switch (notificationPermission) {
      case "granted":
        return {
          text: "Notifications Enabled",
          description: "You'll receive alerts for Grade A signals",
          icon: Bell,
          variant: "default" as const
        };
      case "denied":
        return {
          text: "Notifications Blocked",
          description: "Enable in browser settings to receive alerts",
          icon: BellOff,
          variant: "destructive" as const
        };
      default:
        return {
          text: "Enable Notifications",
          description: "Get alerted for high-probability signals",
          icon: Bell,
          variant: "secondary" as const
        };
    }
  };

  const status = getPermissionStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-success/5 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            notificationPermission === "granted" && "bg-success/20",
            notificationPermission === "denied" && "bg-destructive/20",
            notificationPermission === "default" && "bg-warning/20"
          )}>
            <StatusIcon className={cn(
              "h-5 w-5",
              notificationPermission === "granted" && "text-success",
              notificationPermission === "denied" && "text-destructive",
              notificationPermission === "default" && "text-warning"
            )} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Signal Notifications</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Real-time alerts for Grade A signals
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {status.description}
          </p>
        </div>
        
        {notificationPermission !== "granted" && (
          <Button 
            onClick={handleRequestPermission}
            variant={status.variant}
            className="w-full premium-button text-white font-semibold py-3 rounded-xl"
          >
            <Bell className="mr-2 h-4 w-4" />
            {status.text}
          </Button>
        )}

        {notificationPermission === "granted" && (
          <div className="glass-card border-success/30 bg-success/5 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-xl">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-success mb-1">
                  Notifications Active
                </p>
                <p className="text-xs text-success/80">
                  You'll receive instant alerts for Grade A trading signals
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;