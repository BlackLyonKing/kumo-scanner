import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useSubscription } from '@/hooks/useSubscription';

export const TRIAL_SCAN_LIMIT = 10;

const storageKey = (addr: string) => `scan_count_${addr.toLowerCase()}`;

export const useScanQuota = () => {
  const { wallet } = useWallet();
  const { subscription } = useSubscription();
  const [scansUsed, setScansUsed] = useState(0);

  const refresh = useCallback(() => {
    if (!wallet?.address) {
      setScansUsed(0);
      return;
    }
    const raw = localStorage.getItem(storageKey(wallet.address));
    setScansUsed(raw ? parseInt(raw, 10) || 0 : 0);
  }, [wallet?.address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isPaid = subscription.status === 'active' && !subscription.isTrial;
  const scansRemaining = Math.max(0, TRIAL_SCAN_LIMIT - scansUsed);
  const limitReached = !isPaid && scansUsed >= TRIAL_SCAN_LIMIT;

  const incrementScan = useCallback(() => {
    if (!wallet?.address || isPaid) return;
    const next = scansUsed + 1;
    localStorage.setItem(storageKey(wallet.address), String(next));
    setScansUsed(next);
  }, [wallet?.address, scansUsed, isPaid]);

  return {
    scansUsed,
    scansRemaining,
    limitReached,
    isPaid,
    incrementScan,
    refresh,
    limit: TRIAL_SCAN_LIMIT,
  };
};
