import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentVerificationProps {
  planId: string;
  cryptoCurrency: 'ETH' | 'BTC' | 'SOL';
  onSuccess?: () => void;
}

export const PaymentVerification = ({ planId, cryptoCurrency, onSuccess }: PaymentVerificationProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!wallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!txHash.trim()) {
      toast({
        title: "Transaction Hash Required",
        description: "Please enter your transaction hash",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setVerificationStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          transactionHash: txHash.trim(),
          cryptoCurrency,
          walletAddress: wallet.address,
          planId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setVerificationStatus('success');
        setMessage(data.message);
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setVerificationStatus('error');
        setMessage(data.message);
        toast({
          title: "Verification Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage(error.message || 'Failed to verify payment. Please try again.');
      toast({
        title: "Error",
        description: "Failed to verify payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Payment</CardTitle>
        <CardDescription>
          Enter your {cryptoCurrency} transaction hash to activate your subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="txHash">Transaction Hash</Label>
          <Input
            id="txHash"
            placeholder={`Enter your ${cryptoCurrency} transaction hash`}
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            disabled={loading || verificationStatus === 'success'}
          />
          <p className="text-sm text-muted-foreground">
            Find this in your wallet's transaction history
          </p>
        </div>

        {verificationStatus !== 'idle' && (
          <Alert variant={verificationStatus === 'success' ? 'default' : 'destructive'}>
            {verificationStatus === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleVerify}
          disabled={loading || !txHash.trim() || verificationStatus === 'success'}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : verificationStatus === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verified!
            </>
          ) : (
            'Verify Payment'
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Make sure your transaction has at least 1 confirmation</p>
          <p>• Verification typically takes 1-2 minutes</p>
          <p>• Contact support if you experience issues</p>
        </div>
      </CardContent>
    </Card>
  );
};
