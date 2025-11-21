import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Gift, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useReferralData } from '@/hooks/useReferralData';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ReferralDashboard: React.FC = () => {
  const { referralData, loading, applyReferralCode } = useReferralData();
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [applying, setApplying] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleApplyCode = async () => {
    if (!referralCodeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      });
      return;
    }

    setApplying(true);
    await applyReferralCode(referralCodeInput.trim());
    setApplying(false);
    setReferralCodeInput('');
  };

  const shareReferral = () => {
    if (referralData) {
      const text = `Join me on B.L.K. Trading Signals and get 7 extra days on your trial! Use my code: ${referralData.referralCode} or visit ${referralData.referralLink}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join B.L.K. Trading Signals',
          text: text,
        }).catch(() => {
          copyToClipboard(text, 'Referral message');
        });
      } else {
        copyToClipboard(text, 'Referral message');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/5">
        <Gift className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>Get 7 bonus days</strong> for every friend who joins using your referral code! 
          Your friends get 7 extra days too. 🎉
        </AlertDescription>
      </Alert>

      {/* Your Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Your Referral Code
          </CardTitle>
          <CardDescription>
            Share this code with friends to earn bonus trial days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {referralData && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-primary tracking-wider bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg text-center">
                    {referralData.referralCode}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(referralData.referralCode, 'Referral code')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Referral Link</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={referralData.referralLink} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralData.referralLink, 'Referral link')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={shareReferral} className="w-full" variant="default">
                <Gift className="mr-2 h-4 w-4" />
                Share Referral
              </Button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
                    <div className="text-xs text-muted-foreground">Total Referrals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{referralData.totalDaysEarned}</div>
                    <div className="text-xs text-muted-foreground">Days Earned</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Apply Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle>Have a Referral Code?</CardTitle>
          <CardDescription>
            Enter a friend's code to get 7 bonus days on your trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-code">Referral Code</Label>
            <div className="flex gap-2">
              <Input
                id="referral-code"
                placeholder="Enter code (e.g. ABC12345)"
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                disabled={applying}
                maxLength={8}
              />
              <Button 
                onClick={handleApplyCode} 
                disabled={applying || !referralCodeInput.trim()}
              >
                {applying ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      {referralData && referralData.referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Track your referral rewards and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralData.referrals.map((referral) => (
                <div 
                  key={referral.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {referral.status === 'rewarded' ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-mono">
                        {referral.referred_wallet.slice(0, 6)}...{referral.referred_wallet.slice(-4)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={referral.status === 'rewarded' ? 'default' : 'secondary'}>
                      {referral.status === 'rewarded' ? `+${referral.reward_days} days` : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
