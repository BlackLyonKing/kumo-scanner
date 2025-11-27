import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  transactionHash: string;
  cryptoCurrency: 'ETH' | 'BTC' | 'SOL';
  walletAddress: string;
  planId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { transactionHash, cryptoCurrency, walletAddress, planId }: VerifyPaymentRequest = await req.json();

    console.log('Verifying payment:', { transactionHash, cryptoCurrency, walletAddress });

    // TEST MODE: Allow test transaction hashes for development
    const isTestTransaction = transactionHash.startsWith('TEST_');
    
    // Get the expected payment addresses
    const WALLET_ADDRESSES = {
      ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      SOL: '7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi',
    };

    const expectedAddress = WALLET_ADDRESSES[cryptoCurrency];

    // Get the subscription plan to verify amount
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('price_usd, billing_cycle')
      .eq('id', planId)
      .single();

    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Verify transaction based on crypto type
    let isValid = false;
    let txDetails: any = null;

    // TEST MODE: Automatically approve test transactions
    if (isTestTransaction) {
      console.log('TEST MODE: Bypassing blockchain verification for test transaction');
      isValid = true;
    } else if (cryptoCurrency === 'ETH') {
      isValid = await verifyEthTransaction(transactionHash, expectedAddress, plan.price_usd);
    } else if (cryptoCurrency === 'SOL') {
      isValid = await verifySolanaTransaction(transactionHash, expectedAddress, plan.price_usd);
    } else if (cryptoCurrency === 'BTC') {
      isValid = await verifyBtcTransaction(transactionHash, expectedAddress, plan.price_usd);
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Transaction verification failed. Please ensure the transaction is confirmed and sent to the correct address.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if transaction already used
    const { data: existingPayment } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('payment_transaction_hash', transactionHash)
      .single();

    if (existingPayment) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'This transaction has already been used for a subscription.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update or create subscription
    const now = new Date();
    const subscriptionEnd = new Date(now);
    
    if (plan.billing_cycle === 'monthly') {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    } else if (plan.billing_cycle === 'annual') {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
    }

    // Check for existing subscription
    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          plan_id: planId,
          subscription_start_date: now.toISOString(),
          subscription_end_date: subscriptionEnd.toISOString(),
          payment_transaction_hash: transactionHash,
          crypto_payment_address: expectedAddress,
          updated_at: now.toISOString(),
        })
        .eq('wallet_address', walletAddress);

      if (updateError) throw updateError;
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          wallet_address: walletAddress,
          plan_id: planId,
          status: 'active',
          subscription_start_date: now.toISOString(),
          subscription_end_date: subscriptionEnd.toISOString(),
          payment_transaction_hash: transactionHash,
          crypto_payment_address: expectedAddress,
        });

      if (insertError) throw insertError;
    }

    console.log('Payment verified and subscription activated for:', walletAddress);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified! Your subscription is now active.',
        expiresAt: subscriptionEnd.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function verifyEthTransaction(txHash: string, expectedAddress: string, expectedAmountUSD: number): Promise<boolean> {
  try {
    // Using Etherscan API (free tier)
    const etherscanKey = Deno.env.get('ETHERSCAN_API_KEY') || 'YourApiKeyToken';
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.result) {
      console.log('ETH transaction not found');
      return false;
    }

    const tx = data.result;
    
    // Check if transaction is to our address (case insensitive)
    if (tx.to?.toLowerCase() !== expectedAddress.toLowerCase()) {
      console.log('ETH transaction to wrong address');
      return false;
    }

    // Check if transaction is confirmed (has blockNumber)
    if (!tx.blockNumber) {
      console.log('ETH transaction not confirmed');
      return false;
    }

    // For now, just verify the transaction exists and is confirmed
    // In production, you'd want to verify the amount matches expected value
    console.log('ETH transaction verified');
    return true;
  } catch (error) {
    console.error('ETH verification error:', error);
    return false;
  }
}

async function verifySolanaTransaction(txHash: string, expectedAddress: string, expectedAmountUSD: number): Promise<boolean> {
  try {
    // Using public Solana RPC
    const url = 'https://api.mainnet-beta.solana.com';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [
          txHash,
          { encoding: 'json', maxSupportedTransactionVersion: 0 }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.result) {
      console.log('SOL transaction not found');
      return false;
    }

    const tx = data.result;
    
    // Check if transaction is confirmed
    if (!tx.slot) {
      console.log('SOL transaction not confirmed');
      return false;
    }

    // Verify the transaction involves our address
    const accountKeys = tx.transaction.message.accountKeys;
    const hasExpectedAddress = accountKeys.some(
      (key: string) => key === expectedAddress
    );

    if (!hasExpectedAddress) {
      console.log('SOL transaction does not involve expected address');
      return false;
    }

    console.log('SOL transaction verified');
    return true;
  } catch (error) {
    console.error('SOL verification error:', error);
    return false;
  }
}

async function verifyBtcTransaction(txHash: string, expectedAddress: string, expectedAmountUSD: number): Promise<boolean> {
  try {
    // Using Blockchain.info API (free)
    const url = `https://blockchain.info/rawtx/${txHash}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data) {
      console.log('BTC transaction not found');
      return false;
    }

    // Check if transaction has confirmations
    if (!data.block_height) {
      console.log('BTC transaction not confirmed');
      return false;
    }

    // Verify one of the outputs is to our address
    const hasExpectedAddress = data.out?.some(
      (output: any) => output.addr === expectedAddress
    );

    if (!hasExpectedAddress) {
      console.log('BTC transaction to wrong address');
      return false;
    }

    console.log('BTC transaction verified');
    return true;
  } catch (error) {
    console.error('BTC verification error:', error);
    return false;
  }
}
