import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReferralWelcomeModalProps {
  referralCode: string | null;
  onClose: () => void;
}

export const ReferralWelcomeModal: React.FC<ReferralWelcomeModalProps> = ({
  referralCode,
  onClose,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (referralCode) {
      // Show modal after a short delay
      setTimeout(() => setOpen(true), 1000);
    }
  }, [referralCode]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  if (!referralCode) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full" />
              <Gift className="h-16 w-16 text-primary relative" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Welcome! You've Got a Gift 🎁
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You've been invited with referral code: <strong className="text-primary">{referralCode}</strong>
          </DialogDescription>
        </DialogHeader>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="font-semibold">7 Extra Trial Days</p>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet and we'll automatically add 7 bonus days to your trial period!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="font-semibold">Premium Features</p>
                <p className="text-sm text-muted-foreground">
                  Get full access to Grade A+ signals, multi-timeframe analysis, and real-time alerts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="font-semibold">Share & Earn</p>
                <p className="text-sm text-muted-foreground">
                  You can earn bonus days too by referring friends. Check the Referrals tab!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleClose} className="w-full" size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          Get Started
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          The bonus days will be applied automatically after you connect your wallet
        </p>
      </DialogContent>
    </Dialog>
  );
};
