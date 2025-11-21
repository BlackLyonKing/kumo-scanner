import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, Sparkles } from 'lucide-react';

export const TrialStatusBanner: React.FC = () => {
  const { subscription, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading || !subscription) return null;

  // Show warning when trial has 3 or fewer days remaining
  if (subscription.isTrial && subscription.trialDaysRemaining <= 3 && subscription.trialDaysRemaining > 0) {
    return (
      <Alert className="border-warning bg-warning/10">
        <Clock className="h-4 w-4 text-warning" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <span className="font-medium">
              Your trial expires in {subscription.trialDaysRemaining} day{subscription.trialDaysRemaining !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              Upgrade now to keep access to premium features
            </span>
          </div>
          <Button 
            onClick={() => navigate('/subscribe')} 
            size="sm"
            className="ml-4"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show alert when trial has expired
  if (subscription.status === 'expired') {
    return (
      <Alert variant="destructive" className="bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <span className="font-medium">Your trial has expired</span>
            <span className="text-sm text-muted-foreground ml-2">
              Subscribe now to continue accessing premium trading signals
            </span>
          </div>
          <Button 
            onClick={() => navigate('/subscribe')} 
            variant="destructive"
            size="sm"
            className="ml-4"
          >
            Subscribe Now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
