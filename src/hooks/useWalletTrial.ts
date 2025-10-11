import { useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWalletTrial = () => {
  const { wallet, isConnected } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    const initializeWalletTrial = async () => {
      if (!isConnected || !wallet?.address) return;

      try {
        // Check if wallet already has a subscription
        const { data: existingSub } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('wallet_address', wallet.address)
          .single();

        if (!existingSub) {
          // Create trial for new wallet
          const { error } = await supabase.rpc('create_wallet_trial', {
            wallet_addr: wallet.address
          });

          if (error) throw error;

          toast({
            title: "Welcome! 🎉",
            description: "Your 7-day free trial has started!",
          });
        }
      } catch (error) {
        console.error('Failed to initialize wallet trial:', error);
      }
    };

    initializeWalletTrial();
  }, [isConnected, wallet?.address, toast]);
};
