import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import WalletConnect from '@/components/WalletConnect';

const Auth = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();

  useEffect(() => {
    // Redirect if wallet is already connected
    if (isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">B.L.K Trading</h1>
          </div>
          <p className="text-muted-foreground">
            Professional trading signals powered by Ichimoku analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your crypto wallet to start your 7-day free trial
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <WalletConnect />
            <p className="text-sm text-muted-foreground mt-6 text-center">
              7-day free trial • No credit card required
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
