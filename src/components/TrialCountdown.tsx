import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrialCountdown: React.FC = () => {
  const { subscription, loading } = useSubscription();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (!subscription?.expiresAt || !subscription.isTrial) return;

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(subscription.expiresAt!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining({ days, hours, minutes });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [subscription?.expiresAt, subscription?.isTrial]);

  if (loading || !subscription?.isTrial || !timeRemaining) return null;

  const isLow = timeRemaining.days <= 2;

  return (
    <button
      onClick={() => navigate('/subscribe')}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
        isLow 
          ? 'bg-warning/20 text-warning border border-warning/30 animate-pulse' 
          : 'bg-primary/20 text-primary border border-primary/30'
      }`}
    >
      {isLow ? (
        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
      ) : (
        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
      <span className="hidden sm:inline">Free Trial:</span>
      <span className="font-bold">
        {timeRemaining.days}d {timeRemaining.hours}h
      </span>
      <span className="hidden sm:inline text-muted-foreground">left</span>
    </button>
  );
};
