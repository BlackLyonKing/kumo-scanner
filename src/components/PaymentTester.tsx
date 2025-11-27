import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useWallet } from '@/contexts/WalletContext';

export const PaymentTester = () => {
  const { toast } = useToast();
  const { subscription, refetch } = useSubscription();
  const { wallet } = useWallet();
  const [testPhase, setTestPhase] = useState<'intro' | 'payment' | 'verification'>('intro');

  const testTxHash = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const copyTestHash = () => {
    navigator.clipboard.writeText(testTxHash);
    toast({
      title: "Test Hash Copied",
      description: "Use this in the payment verification page",
    });
  };

  const getSubscriptionStatusColor = () => {
    if (!subscription) return 'secondary';
    switch (subscription.status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Payment Flow Tester
            </CardTitle>
            <CardDescription>
              Test the complete payment flow without real blockchain transactions
            </CardDescription>
          </div>
          {subscription && (
            <Badge variant={getSubscriptionStatusColor()}>
              {subscription.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Test Mode:</strong> This uses test transaction hashes (starting with TEST_) 
            that bypass blockchain verification. Perfect for testing the payment flow!
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Current Status</h3>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Wallet</p>
              <p className="text-sm font-mono truncate">
                {wallet?.address || 'Not Connected'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription</p>
              <p className="text-sm font-semibold">
                {subscription?.status || 'None'}
              </p>
            </div>
            {subscription?.isTrial && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Trial Days Left</p>
                  <p className="text-sm font-semibold">
                    {subscription.trialDaysRemaining}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="text-sm font-semibold">
                    {subscription.planName || 'N/A'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Test Instructions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Test Flow Instructions</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Go to Subscribe Page</p>
                <p className="text-xs text-muted-foreground">
                  Navigate to /subscribe and click "Get Started" on any plan
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Open Payment Modal</p>
                <p className="text-xs text-muted-foreground">
                  Select any crypto (ETH/BTC/SOL) and click "I've Sent Payment"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Use Test Transaction Hash</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Copy this test hash and paste it in the verification page:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background border rounded px-2 py-1 font-mono overflow-hidden">
                    {testTxHash}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyTestHash}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Verify & Check Results</p>
                <p className="text-xs text-muted-foreground">
                  Click "Verify Payment" and watch your subscription activate instantly!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              toast({
                title: "Status Refreshed",
                description: "Subscription status has been updated",
              });
            }}
            className="flex-1"
          >
            Refresh Status
          </Button>
          <Button
            size="sm"
            onClick={() => window.open('/subscribe', '_blank')}
            className="flex-1"
          >
            Open Subscribe Page
          </Button>
        </div>

        {/* Expected Results */}
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-sm">
            <strong>Expected Result:</strong> After verification, your status will change from 
            "trial" to "active", the Analysis tab will unlock, and you'll have full access for 
            the billing period.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
