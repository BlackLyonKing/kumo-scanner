import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function checks for completed referrals and rewards referrers
// Can be called manually or via cron job
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking for referrals to reward...');

    // Find completed referrals that haven't been rewarded yet
    const { data: unrewardedReferrals, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('status', 'completed')
      .is('rewarded_at', null);

    if (fetchError) {
      console.error('Error fetching unrewarded referrals:', fetchError);
      throw fetchError;
    }

    if (!unrewardedReferrals || unrewardedReferrals.length === 0) {
      console.log('No unrewarded referrals found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No referrals to reward',
          rewarded: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let rewardedCount = 0;

    // Process each unrewarded referral
    for (const referral of unrewardedReferrals) {
      try {
        // Get referrer's subscription
        const { data: subscription, error: subError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('wallet_address', referral.referrer_wallet)
          .single();

        if (subError || !subscription) {
          console.error(`Referrer subscription not found for ${referral.referrer_wallet}`);
          continue;
        }

        const rewardDays = referral.reward_days || 7;
        const now = new Date();
        
        // Calculate new trial end date
        let currentEnd: Date;
        if (subscription.status === 'trial' && subscription.trial_end_date) {
          currentEnd = new Date(subscription.trial_end_date);
        } else if (subscription.subscription_end_date) {
          currentEnd = new Date(subscription.subscription_end_date);
        } else {
          currentEnd = now;
        }

        // Extend by reward days
        const newEnd = new Date(Math.max(currentEnd.getTime(), now.getTime()) + rewardDays * 24 * 60 * 60 * 1000);

        // Update subscription
        const updateData: any = {
          updated_at: now.toISOString()
        };

        if (subscription.status === 'trial' || subscription.status === 'expired') {
          updateData.trial_end_date = newEnd.toISOString();
          updateData.status = 'trial';
        } else if (subscription.status === 'active') {
          updateData.subscription_end_date = newEnd.toISOString();
        }

        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update(updateData)
          .eq('id', subscription.id);

        if (updateError) {
          console.error('Error updating referrer subscription:', updateError);
          continue;
        }

        // Mark referral as rewarded
        const { error: rewardError } = await supabase
          .from('referrals')
          .update({
            status: 'rewarded',
            rewarded_at: now.toISOString()
          })
          .eq('id', referral.id);

        if (rewardError) {
          console.error('Error marking referral as rewarded:', rewardError);
        } else {
          rewardedCount++;
          console.log(`Rewarded referrer ${referral.referrer_wallet} with ${rewardDays} days`);
        }

      } catch (error) {
        console.error(`Error processing referral ${referral.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully rewarded ${rewardedCount} referrals`,
        rewarded: rewardedCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reward-referrer function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
