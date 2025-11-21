import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, CheckCircle, Sparkles } from 'lucide-react';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  const benefits = [
    'Unlimited Grade A+ signals',
    'Multi-timeframe analysis',
    'Real-time browser notifications',
    'Advanced signal filtering',
    'Watchlist management',
    'Priority support',
  ];

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/subscribe');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full" />
              <Crown className="h-16 w-16 text-primary relative" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Your Trial Has Ended
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Continue enjoying premium trading signals with a paid subscription
          </DialogDescription>
        </DialogHeader>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6 space-y-3">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Pay securely with ETH, BTC, or SOL • Instant activation
        </p>
      </DialogContent>
    </Dialog>
  );
};
