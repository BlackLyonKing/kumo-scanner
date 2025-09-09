import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, QrCode, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  amount: string; // ETH amount like "0.0045 ETH"
  title: string;
  description: string;
  children: React.ReactNode;
}

const WALLET_ADDRESSES = {
  ETH: '0xa4020E26CD12fe42107584e94bDEdc961CbBbC7C',
  BTC: '1EjLYy11JjtNrTt7cwtmJCfZWyAUHZ7fpa',
  SOL: '9nt3BzBV3qu2w94ytpsARgQAuTJQRyNpYsCz58mmzH1E'
};

// Approximate conversion rates (in production, you'd fetch real-time rates)
const CRYPTO_RATES = {
  ETH_TO_BTC: 0.037, // 1 ETH ≈ 0.037 BTC
  ETH_TO_SOL: 14.5   // 1 ETH ≈ 14.5 SOL
};

const CryptoPayment: React.FC<CryptoPaymentProps> = ({ amount, title, description, children }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'BTC' | 'SOL'>('ETH');
  const [isOpen, setIsOpen] = useState(false);

  const ethAmount = parseFloat(amount.replace(' ETH', ''));
  
  const getAmount = (crypto: 'ETH' | 'BTC' | 'SOL') => {
    switch (crypto) {
      case 'ETH':
        return `${ethAmount.toFixed(4)} ETH`;
      case 'BTC':
        return `${(ethAmount * CRYPTO_RATES.ETH_TO_BTC).toFixed(6)} BTC`;
      case 'SOL':
        return `${(ethAmount * CRYPTO_RATES.ETH_TO_SOL).toFixed(2)} SOL`;
      default:
        return amount;
    }
  };

  const copyAddress = (address: string, crypto: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: `${crypto} wallet address copied to clipboard`,
    });
  };

  const generateQRUrl = (address: string, amount: string, crypto: string) => {
    switch (crypto) {
      case 'ETH':
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${address}?value=${ethAmount}`;
      case 'BTC':
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${address}?amount=${(ethAmount * CRYPTO_RATES.ETH_TO_BTC).toFixed(6)}`;
      case 'SOL':
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;
      default:
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crypto Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          <div className="flex gap-2 justify-center">
            {Object.keys(WALLET_ADDRESSES).map((crypto) => (
              <Button
                key={crypto}
                variant={selectedCrypto === crypto ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCrypto(crypto as 'ETH' | 'BTC' | 'SOL')}
                className="flex items-center gap-2"
              >
                <span className="text-lg">
                  {crypto === 'ETH' ? '🔷' : crypto === 'BTC' ? '₿' : '◎'}
                </span>
                {crypto}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-2xl font-bold">
                {getAmount(selectedCrypto)}
              </CardTitle>
              <div className="flex justify-center">
                <Badge variant="secondary">{selectedCrypto} Payment</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img 
                  src={generateQRUrl(WALLET_ADDRESSES[selectedCrypto], getAmount(selectedCrypto), selectedCrypto)}
                  alt="Payment QR Code"
                  className="mx-auto border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Scan QR code with your {selectedCrypto} wallet
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wallet Address</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyAddress(WALLET_ADDRESSES[selectedCrypto], selectedCrypto)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  {WALLET_ADDRESSES[selectedCrypto]}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  ⚠️ <strong>Important:</strong> Send exactly {getAmount(selectedCrypto)} to the address above. 
                  After payment, access will be granted within 10 minutes.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPayment;