import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentVerification } from '@/components/PaymentVerification';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function VerifyPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const planId = searchParams.get('planId') || '';
  const crypto = searchParams.get('crypto') as 'ETH' | 'BTC' | 'SOL' || 'ETH';

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/subscribe')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Verify Your Payment</h1>
          <p className="text-muted-foreground">
            Submit your transaction hash to activate your subscription instantly
          </p>
        </div>

        <PaymentVerification
          planId={planId}
          cryptoCurrency={crypto}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
