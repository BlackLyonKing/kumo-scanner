import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@/contexts/WalletContext';
import { SUPPORTED_WALLETS, SupportedChains } from '@/types/wallet';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WalletConnect: React.FC = () => {
  const { isConnected, wallet, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string>('');

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    setConnectingWallet(walletName);
    try {
      await connect(walletName);
    } finally {
      setIsConnecting(false);
      setConnectingWallet('');
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case SupportedChains.ETHEREUM: return 'Ethereum';
      case SupportedChains.POLYGON: return 'Polygon';
      case SupportedChains.BSC: return 'BSC';
      case SupportedChains.ARBITRUM: return 'Arbitrum';
      default: return `Chain ${chainId}`;
    }
  };

  if (isConnected && wallet) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(wallet.address)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connected Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{wallet.walletName}</CardTitle>
                  <Badge variant="outline">{getChainName(wallet.chainId)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{formatAddress(wallet.address)}</span>
                    <Button variant="ghost" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="font-mono text-sm">{parseFloat(wallet.balance).toFixed(4)} ETH</span>
                </div>
              </CardContent>
            </Card>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button variant="destructive" size="sm" onClick={disconnect}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the Ichimoku Trading Scanner
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {SUPPORTED_WALLETS.map((walletInfo) => (
            <Card 
              key={walletInfo.name}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                !walletInfo.installed ? 'opacity-50' : ''
              }`}
              onClick={() => walletInfo.installed && handleConnect(walletInfo.name)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{walletInfo.icon}</span>
                  <div>
                    <h3 className="font-medium">{walletInfo.name}</h3>
                    {!walletInfo.installed && (
                      <p className="text-xs text-muted-foreground">Not installed</p>
                    )}
                  </div>
                </div>
                {isConnecting && connectingWallet === walletInfo.name && (
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                )}
              </CardContent>
            </Card>
          ))}
          
          <div className="text-xs text-muted-foreground text-center mt-4">
            <p>By connecting your wallet, you agree to our Terms of Service</p>
            <p className="mt-1">
              <strong>Note:</strong> For WalletConnect, you'll need to add your project ID in the wallet context
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;