import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

export interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalDaysEarned: number;
  referralLink: string;
  referrals: Array<{
    id: string;
    referred_wallet: string;
    status: string;
    reward_days: number;
    created_at: string;
    completed_at: string | null;
  }>;
}

export const useReferralData = () => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const { wallet } = useWallet();
  const { toast } = useToast();

  const fetchReferralData = async () => {
    if (!wallet?.address) {
      setLoading(false);
      return;
    }

    try {
      // Get user's referral code
      const { data: codeData, error: codeError } = await supabase
        .from('user_referral_codes')
        .select('*')
        .eq('wallet_address', wallet.address)
        .maybeSingle();

      if (codeError) {
        console.error('Error fetching referral code:', codeError);
        throw codeError;
      }

      // If no code exists, create one
      if (!codeData) {
        // Generate a unique code
        const code = generateReferralCode();
        
        const { data: newCode, error: insertError } = await supabase
          .from('user_referral_codes')
          .insert({
            wallet_address: wallet.address,
            referral_code: code
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating referral code:', insertError);
          throw insertError;
        }

        setReferralData({
          referralCode: newCode.referral_code,
          totalReferrals: 0,
          totalDaysEarned: 0,
          referralLink: `${window.location.origin}?ref=${newCode.referral_code}`,
          referrals: []
        });
        setLoading(false);
        return;
      }

      // Get user's referrals
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_wallet', wallet.address)
        .order('created_at', { ascending: false });

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
      }

      setReferralData({
        referralCode: codeData.referral_code,
        totalReferrals: codeData.total_referrals || 0,
        totalDaysEarned: codeData.total_days_earned || 0,
        referralLink: `${window.location.origin}?ref=${codeData.referral_code}`,
        referrals: referrals || []
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const applyReferralCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!wallet?.address) {
      return { success: false, message: 'Please connect your wallet first' };
    }

    try {
      const { data, error } = await supabase.functions.invoke('apply-referral', {
        body: {
          referralCode: code.toUpperCase(),
          walletAddress: wallet.address
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success! 🎉",
          description: data.message,
        });
        // Refresh referral data
        await fetchReferralData();
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }

      return { success: data.success, message: data.message };
    } catch (error: any) {
      const message = error.message || 'Failed to apply referral code';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return { success: false, message };
    }
  };

  useEffect(() => {
    fetchReferralData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  return { 
    referralData, 
    loading, 
    refetch: fetchReferralData,
    applyReferralCode 
  };
};

// Helper function to generate referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
