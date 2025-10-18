import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, UserPlus, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PermanentAccessGrant {
  id: string;
  wallet_address: string;
  granted_by_wallet: string;
  granted_at: string;
  notes: string | null;
}

export const AdminPanel = () => {
  const { wallet } = useWallet();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newWallet, setNewWallet] = useState('');
  const [notes, setNotes] = useState('');

  const { data: grants, isLoading } = useQuery({
    queryKey: ['permanent-access-grants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_access_grants')
        .select('*')
        .order('granted_at', { ascending: false });
      
      if (error) throw error;
      return data as PermanentAccessGrant[];
    },
    enabled: isAdmin,
  });

  const addGrantMutation = useMutation({
    mutationFn: async (data: { wallet_address: string; notes: string }) => {
      if (!wallet?.address) throw new Error('No wallet connected');
      
      const { error } = await supabase
        .from('permanent_access_grants')
        .insert({
          wallet_address: data.wallet_address,
          granted_by_wallet: wallet.address,
          notes: data.notes || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permanent-access-grants'] });
      toast({
        title: 'Success',
        description: 'Permanent access granted',
      });
      setNewWallet('');
      setNotes('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to grant access',
        variant: 'destructive',
      });
    },
  });

  const removeGrantMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('permanent_access_grants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permanent-access-grants'] });
      toast({
        title: 'Success',
        description: 'Access revoked',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to revoke access',
        variant: 'destructive',
      });
    },
  });

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have admin privileges to access this panel.
        </AlertDescription>
      </Alert>
    );
  }

  const handleAddGrant = () => {
    if (!newWallet.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address',
        variant: 'destructive',
      });
      return;
    }
    
    addGrantMutation.mutate({ wallet_address: newWallet.trim(), notes: notes.trim() });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel - Permanent Access Management
          </CardTitle>
          <CardDescription>
            Grant unlimited access to users by adding their wallet addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder="Wallet Address"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
              className="font-mono"
            />
            <Textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <Button 
              onClick={handleAddGrant}
              disabled={addGrantMutation.isPending}
              className="w-full"
            >
              {addGrantMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Granting Access...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Permanent Access
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Permanent Access Grants</CardTitle>
          <CardDescription>
            {grants?.length || 0} wallet(s) with permanent access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : grants && grants.length > 0 ? (
            <div className="space-y-3">
              {grants.map((grant) => (
                <div
                  key={grant.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-mono text-sm font-medium break-all">
                      {grant.wallet_address}
                    </p>
                    {grant.notes && (
                      <p className="text-sm text-muted-foreground">{grant.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Granted {new Date(grant.granted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGrantMutation.mutate(grant.id)}
                    disabled={removeGrantMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No permanent access grants yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
