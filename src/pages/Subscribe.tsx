import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, TrendingUp, ArrowLeft } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import CryptoPayment from '@/components/CryptoPayment';
import { Skeleton } from '@/components/ui/skeleton';

const Subscribe = () => {
  const navigate = useNavigate();
  const { subscription, loading } = useSubscription();

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly',
      price: 12,
      period: 'week',
      description: 'Perfect for short-term traders',
      popular: false,
      savings: null,
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: 39,
      period: 'month',
      description: 'Best value for active traders',
      popular: true,
      savings: '33% savings vs weekly',
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 99,
      period: '3 months',
      description: 'Maximum savings for committed traders',
      popular: false,
      savings: '15% savings vs monthly',
    },
  ];

  const features = [
    'Unlimited market scans',
    'Grade A+ premium signals',
    'Multi-timeframe analysis (1H, 4H, 1D)',
    'Real-time browser notifications',
    'Advanced signal filtering',
    'RSI & Ichimoku indicators',
    'Watchlist management',
    'Export signals to CSV',
    'Performance tracking',
    'Priority support',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="max-w-6xl mx-auto space-y-8 py-8">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subscription.isTrial 
              ? `${subscription.trialDaysRemaining} days left in your trial. Upgrade to continue accessing premium features.`
              : 'Start your 7-day free trial. No credit card required.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={plan.popular ? 'border-primary shadow-lg relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <Badge variant="outline" className="mt-2 border-primary text-primary">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <CryptoPayment
                  amount={plan.price.toString()}
                  title={`${plan.name} Plan`}
                  description={`Pay with crypto for ${plan.name.toLowerCase()} access`}
                >
                  <Button className="w-full" size="lg">
                    {subscription.isTrial ? 'Upgrade Now' : 'Start Free Trial'}
                  </Button>
                </CryptoPayment>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">How does the free trial work?</h3>
              <p className="text-sm text-muted-foreground">
                You get 7 days of full access to all premium features. No credit card required. Cancel anytime.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept ETH, BTC, and SOL cryptocurrencies for secure, decentralized payments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel anytime. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied, contact support for a full refund.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;
