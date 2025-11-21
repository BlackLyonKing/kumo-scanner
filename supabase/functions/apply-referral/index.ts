import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApplyReferralRequest {
  referralCode: string;
  walletAddress: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { referralCode, walletAddress }: ApplyReferralRequest = await req.json();

    console.log('Applying referral code:', { referralCode, walletAddress });

    // Validate referral code exists
    const { data: referralCodeData, error: codeError } = await supabase
      .from('user_referral_codes')
      .select('wallet_address, referral_code')
      .eq('referral_code', referralCode.toUpperCase())
      .single();

    if (codeError || !referralCodeData) {
      console.error('Invalid referral code:', codeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid referral code' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is trying to use their own code
    if (referralCodeData.wallet_address === walletAddress) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'You cannot use your own referral code' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has already used a referral code
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_wallet', walletAddress)
      .eq('status', 'completed')
      .maybeSingle();

    if (existingReferral) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'You have already used a referral code' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (subError || !subscription) {
      console.error('User subscription not found:', subError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Subscription not found. Please connect your wallet first.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bonusDays = 7; // Bonus days for new user
    const now = new Date();
    
    // Extend referred user's trial by bonus days
    const currentTrialEnd = subscription.trial_end_date 
      ? new Date(subscription.trial_end_date) 
      : new Date();
    
    // Only extend if trial hasn't expired yet or just expired recently (within 7 days)
    const daysExpired = (now.getTime() - currentTrialEnd.getTime()) / (1000 * 60 * 60 * 24);
    
    let newTrialEnd: Date;
    if (daysExpired > 7) {
      // If expired more than 7 days ago, start fresh from now
      newTrialEnd = new Date(now.getTime() + bonusDays * 24 * 60 * 60 * 1000);
    } else if (currentTrialEnd > now) {
      // If trial is still active, extend from current end date
      newTrialEnd = new Date(currentTrialEnd.getTime() + bonusDays * 24 * 60 * 60 * 1000);
    } else {
      // If expired within last 7 days, extend from now
      newTrialEnd = new Date(now.getTime() + bonusDays * 24 * 60 * 60 * 1000);
    }

    // Update subscription trial period
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        trial_end_date: newTrialEnd.toISOString(),
        status: 'trial',
        updated_at: now.toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_wallet: referralCodeData.wallet_address,
        referrer_code: referralCode.toUpperCase(),
        referred_wallet: walletAddress,
        status: 'completed',
        reward_days: bonusDays,
        completed_at: now.toISOString()
      });

    if (referralError) {
      console.error('Error creating referral record:', referralError);
    }

    // Update referrer's stats
    const { error: statsError } = await supabase
      .from('user_referral_codes')
      .update({
        total_referrals: referralCodeData.total_referrals + 1,
        total_days_earned: referralCodeData.total_days_earned + bonusDays
      })
      .eq('referral_code', referralCode.toUpperCase());

    if (statsError) {
      console.error('Error updating referrer stats:', statsError);
    }

    console.log('Referral applied successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Success! ${bonusDays} days added to your trial. Your referrer will also receive ${bonusDays} bonus days!`,
        bonusDays,
        newTrialEnd: newTrialEnd.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in apply-referral function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An error occurred processing your referral' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
