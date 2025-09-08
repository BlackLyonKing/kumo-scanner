import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestNotificationPermission } from "@/utils/ichimoku";

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
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <StatusIcon className="h-5 w-5" />
          Signal Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {status.description}
          </p>
          
          {notificationPermission !== "granted" && (
            <Button 
              onClick={handleRequestPermission}
              variant={status.variant}
              className="w-full"
            >
              <Bell className="mr-2 h-4 w-4" />
              {status.text}
            </Button>
          )}

          {notificationPermission === "granted" && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✅ Notifications are enabled for Grade A signals
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;