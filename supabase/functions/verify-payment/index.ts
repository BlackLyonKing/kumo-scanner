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

    const body = await req.json() as Partial<VerifyPaymentRequest>;
    const { transactionHash, cryptoCurrency, walletAddress, planId } = body;

    // Basic input validation
    if (
      !transactionHash || typeof transactionHash !== 'string' ||
      !walletAddress || typeof walletAddress !== 'string' ||
      !planId || typeof planId !== 'string' ||
      !cryptoCurrency || !['ETH', 'BTC', 'SOL'].includes(cryptoCurrency)
    ) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid request payload.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Verifying payment:', { transactionHash, cryptoCurrency, walletAddress });

    // Platform-controlled receiving addresses
    const WALLET_ADDRESSES = {
      ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      SOL: '7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi',
    };

    const expectedAddress = WALLET_ADDRESSES[cryptoCurrency];

    // Validate plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('price_usd, billing_cycle')
      .eq('id', planId)
      .single();

    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Verify on-chain. Each verifier ALSO checks that the sender matches walletAddress,
    // which proves the caller controls the paying wallet.
    let isValid = false;
    if (cryptoCurrency === 'ETH') {
      isValid = await verifyEthTransaction(transactionHash, expectedAddress, walletAddress);
    } else if (cryptoCurrency === 'SOL') {
      isValid = await verifySolanaTransaction(transactionHash, expectedAddress, walletAddress);
    } else if (cryptoCurrency === 'BTC') {
      isValid = await verifyBtcTransaction(transactionHash, expectedAddress, walletAddress);
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Transaction verification failed. Confirm the transaction is on-chain, was sent FROM your connected wallet, and went TO the correct platform address.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Prevent transaction-hash reuse
    const { data: existingPayment } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('payment_transaction_hash', transactionHash)
      .maybeSingle();

    if (existingPayment) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'This transaction has already been used for a subscription.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Compute subscription end
    const now = new Date();
    const subscriptionEnd = new Date(now);
    switch (plan.billing_cycle) {
      case 'weekly':    subscriptionEnd.setDate(subscriptionEnd.getDate() + 7); break;
      case 'monthly':   subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1); break;
      case 'quarterly': subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3); break;
      case 'annual':
      case 'yearly':    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1); break;
      default:          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    }

    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (existingSub) {
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
        expiresAt: subscriptionEnd.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Internal error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function verifyEthTransaction(
  txHash: string,
  expectedAddress: string,
  claimedSender: string,
): Promise<boolean> {
  try {
    const etherscanKey = Deno.env.get('ETHERSCAN_API_KEY') || 'YourApiKeyToken';
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      console.log('ETH tx not found');
      return false;
    }
    const tx = data.result;

    if (!tx.blockNumber) {
      console.log('ETH tx not confirmed');
      return false;
    }
    if (tx.to?.toLowerCase() !== expectedAddress.toLowerCase()) {
      console.log('ETH tx to wrong address');
      return false;
    }
    if (tx.from?.toLowerCase() !== claimedSender.toLowerCase()) {
      console.log('ETH tx sender mismatch', { from: tx.from, claimedSender });
      return false;
    }
    return true;
  } catch (error) {
    console.error('ETH verification error:', error);
    return false;
  }
}

async function verifySolanaTransaction(
  txHash: string,
  expectedAddress: string,
  claimedSender: string,
): Promise<boolean> {
  try {
    const url = 'https://api.mainnet-beta.solana.com';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [txHash, { encoding: 'json', maxSupportedTransactionVersion: 0 }],
      }),
    });
    const data = await response.json();

    if (!data.result) {
      console.log('SOL tx not found');
      return false;
    }
    const tx = data.result;
    if (!tx.slot) {
      console.log('SOL tx not confirmed');
      return false;
    }

    const accountKeys: string[] = tx.transaction.message.accountKeys;
    // First signer (index 0) is the fee payer / sender
    const sender = accountKeys[0];
    if (!sender || sender !== claimedSender) {
      console.log('SOL tx sender mismatch', { sender, claimedSender });
      return false;
    }
    if (!accountKeys.includes(expectedAddress)) {
      console.log('SOL tx does not involve expected address');
      return false;
    }

    // Verify SOL actually moved from sender to expectedAddress (positive balance delta on receiver, negative on sender)
    const senderIdx = accountKeys.indexOf(sender);
    const receiverIdx = accountKeys.indexOf(expectedAddress);
    const pre = tx.meta?.preBalances ?? [];
    const post = tx.meta?.postBalances ?? [];
    if (pre.length && post.length) {
      const senderDelta = post[senderIdx] - pre[senderIdx];
      const receiverDelta = post[receiverIdx] - pre[receiverIdx];
      if (receiverDelta <= 0 || senderDelta >= 0) {
        console.log('SOL tx balance deltas invalid', { senderDelta, receiverDelta });
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('SOL verification error:', error);
    return false;
  }
}

async function verifyBtcTransaction(
  txHash: string,
  expectedAddress: string,
  claimedSender: string,
): Promise<boolean> {
  try {
    const url = `https://blockchain.info/rawtx/${txHash}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data) {
      console.log('BTC tx not found');
      return false;
    }
    if (!data.block_height) {
      console.log('BTC tx not confirmed');
      return false;
    }

    // Receiver must be platform address
    const hasExpectedAddress = data.out?.some((o: any) => o.addr === expectedAddress);
    if (!hasExpectedAddress) {
      console.log('BTC tx to wrong address');
      return false;
    }

    // Sender must include claimedSender (BTC tx can have multiple inputs from multiple addresses)
    const senderAddresses: string[] = (data.inputs || [])
      .map((i: any) => i.prev_out?.addr)
      .filter(Boolean);
    if (!senderAddresses.includes(claimedSender)) {
      console.log('BTC tx sender mismatch', { senderAddresses, claimedSender });
      return false;
    }

    return true;
  } catch (error) {
    console.error('BTC verification error:', error);
    return false;
  }
}
