import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useScanQuota } from '@/hooks/useScanQuota';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RotateCcw, Clock, Crown, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';

export const DevTestPanel = () => {
  const { wallet } = useWallet();
  const { scansUsed, limit, refresh, isPaid } = useScanQuota();
  const { subscription, refetch: refetchSub } = useSubscription();
  const [busy, setBusy] = useState<string | null>(null);

  const addr = wallet?.address;

  const resetScans = () => {
    if (!addr) return;
    localStorage.removeItem(`scan_count_${addr.toLowerCase()}`);
    refresh();
    toast.success('Scan count reset to 0');
  };

  const maxOutScans = () => {
    if (!addr) return;
    localStorage.setItem(`scan_count_${addr.toLowerCase()}`, String(limit));
    refresh();
    toast.success(`Scan count set to ${limit} (limit reached)`);
  };

  const forceTrialExpiry = async () => {
    if (!addr) return;
    setBusy('expire');
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          trial_end_date: new Date(Date.now() - 86400000).toISOString(),
          status: 'expired',
        })
        .eq('wallet_address', addr);
      if (error) throw error;
      await refetchSub();
      toast.success('Trial forced to expired');
    } catch (e: any) {
      toast.error(e.message || 'Failed to expire trial');
    } finally {
      setBusy(null);
    }
  };

  const restoreTrial = async () => {
    if (!addr) return;
    setBusy('restore');
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
          status: 'trial',
        })
        .eq('wallet_address', addr);
      if (error) throw error;
      await refetchSub();
      toast.success('Trial reset to 7 days');
    } catch (e: any) {
      toast.error(e.message || 'Failed to restore trial');
    } finally {
      setBusy(null);
    }
  };

  const togglePaid = async () => {
    if (!addr) return;
    setBusy('paid');
    try {
      const { data: existing } = await supabase
        .from('permanent_access_grants')
        .select('id')
        .eq('wallet_address', addr)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('permanent_access_grants')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        toast.success('Paid access removed');
      } else {
        const { error } = await supabase
          .from('permanent_access_grants')
          .insert({
            wallet_address: addr,
            granted_by_wallet: addr,
            notes: 'Dev panel: toggled paid status',
          });
        if (error) throw error;
        toast.success('Paid access granted');
      }
      await refetchSub();
    } catch (e: any) {
      toast.error(e.message || 'Failed to toggle paid status');
    } finally {
      setBusy(null);
    }
  };

  if (!addr) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Dev Test Panel
          </CardTitle>
          <CardDescription>Connect a wallet to use test actions.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-warning" />
          Dev Test Panel
        </CardTitle>
        <CardDescription>
          Quick actions to test trial/paid states. Affects only your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">Wallet: {addr.slice(0, 6)}…{addr.slice(-4)}</Badge>
          <Badge variant="outline">Scans: {scansUsed}/{limit}</Badge>
          <Badge variant="outline">Status: {subscription.status}</Badge>
          {isPaid && <Badge>Paid</Badge>}
          {subscription.isTrial && <Badge variant="secondary">Trial · {subscription.trialDaysRemaining}d</Badge>}
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          <Button variant="outline" onClick={resetScans}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset scan count
          </Button>
          <Button variant="outline" onClick={maxOutScans}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Max out scans ({limit}/{limit})
          </Button>

          <Button variant="outline" onClick={forceTrialExpiry} disabled={busy === 'expire'}>
            {busy === 'expire' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
            Force trial expiry
          </Button>
          <Button variant="outline" onClick={restoreTrial} disabled={busy === 'restore'}>
            {busy === 'restore' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
            Restore 7-day trial
          </Button>

          <Button
            variant={isPaid ? 'destructive' : 'default'}
            onClick={togglePaid}
            disabled={busy === 'paid'}
            className="sm:col-span-2"
          >
            {busy === 'paid' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Crown className="h-4 w-4 mr-2" />}
            {isPaid ? 'Remove paid access' : 'Grant paid access'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
