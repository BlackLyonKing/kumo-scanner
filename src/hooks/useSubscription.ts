import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  status: 'trial' | 'active' | 'expired' | 'none';
  planName?: string;
  expiresAt?: Date;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    isTrial: false,
    trialDaysRemaining: 0,
    status: 'none',
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { wallet } = useWallet();

  const checkSubscription = async () => {
    try {
      if (!wallet?.address) {
        setSubscription({
          isActive: false,
          isTrial: false,
          trialDaysRemaining: 0,
          status: 'none',
        });
        setLoading(false);
        return;
      }

      // Check if wallet has permanent access grant
      const { data: permanentAccess } = await supabase
        .from('permanent_access_grants')
        .select('*')
        .eq('wallet_address', wallet.address)
        .single();

      if (permanentAccess) {
        setSubscription({
          isActive: true,
          isTrial: false,
          trialDaysRemaining: 0,
          status: 'active',
          planName: 'Permanent Access',
        });
        setLoading(false);
        return;
      }

      const { data: userSub, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(name, features)
        `)
        .eq('wallet_address', wallet.address)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        throw error;
      }

      if (!userSub) {
        setSubscription({
          isActive: false,
          isTrial: false,
          trialDaysRemaining: 0,
          status: 'none',
        });
        setLoading(false);
        return;
      }

      const now = new Date();
      const trialEnd = userSub.trial_end_date ? new Date(userSub.trial_end_date) : null;
      const subEnd = userSub.subscription_end_date ? new Date(userSub.subscription_end_date) : null;

      let status: SubscriptionStatus['status'] = 'none';
      let isActive = false;
      let isTrial = false;
      let trialDaysRemaining = 0;
      let expiresAt: Date | undefined;

      if (userSub.status === 'trial' && trialEnd && trialEnd > now) {
        status = 'trial';
        isActive = true;
        isTrial = true;
        trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        expiresAt = trialEnd;
      } else if (userSub.status === 'active' && subEnd && subEnd > now) {
        status = 'active';
        isActive = true;
        expiresAt = subEnd;
      } else {
        status = 'expired';
      }

      setSubscription({
        isActive,
        isTrial,
        trialDaysRemaining,
        status,
        planName: userSub.subscription_plans?.name,
        expiresAt,
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Subscription check error:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  return { subscription, loading, refetch: checkSubscription };
};
