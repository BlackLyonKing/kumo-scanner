import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: string;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ 
  children, 
  feature = "this feature" 
}) => {
  const { subscription, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription.isActive) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="border-primary text-primary">
              Premium Feature
            </Badge>
          </div>
          <CardTitle className="text-2xl">Unlock {feature}</CardTitle>
          <CardDescription className="text-base">
            Start your 7-day free trial to access premium trading signals and advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Grade A+ Signals</p>
                <p className="text-sm text-muted-foreground">High-probability trading setups</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Multi-Timeframe Analysis</p>
                <p className="text-sm text-muted-foreground">1H, 4H, 1D signal alignment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Real-Time Alerts</p>
                <p className="text-sm text-muted-foreground">Never miss a trading opportunity</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/subscribe')} 
            className="w-full" 
            size="lg"
          >
            Start Free Trial
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No credit card required • Cancel anytime
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show trial banner if on trial
  if (subscription.isTrial && subscription.trialDaysRemaining <= 3) {
    return (
      <div className="space-y-4">
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Trial expires in {subscription.trialDaysRemaining} days</p>
                  <p className="text-sm text-muted-foreground">Upgrade now to keep access</p>
                </div>
              </div>
              <Button onClick={() => navigate('/subscribe')} variant="outline">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
