# Payment Flow Testing Guide

## Overview
This guide explains how to test the complete crypto payment flow without using real blockchain transactions.

## Test Mode Feature

The `verify-payment` edge function now supports **test mode** transactions that bypass blockchain verification. Any transaction hash starting with `TEST_` will be automatically approved.

## Complete Test Flow

### Step 1: Access the Payment Tester
1. Navigate to the Admin Panel (you need admin role)
2. You'll see the "Payment Flow Tester" card at the top
3. This shows your current subscription status and provides a test transaction hash

### Step 2: Start a Subscription
1. Go to `/subscribe` page
2. Choose any plan (Monthly or Annual)
3. Click "Get Started" button
4. Select your preferred crypto (ETH, BTC, or SOL)
5. Click "I've Sent Payment" button

### Step 3: Verify Payment
1. You'll be redirected to `/verify-payment` page
2. Copy the test transaction hash from the Payment Tester or use this format:
   ```
   TEST_<timestamp>_<random>
   ```
   Example: `TEST_1732697234_abc123xyz`
3. Paste the hash into the "Transaction Hash" field
4. Click "Verify Payment"

### Step 4: Observe Results
After clicking verify, the following should happen:

✅ **Immediate Results:**
- Success toast notification appears
- Verification status shows "Verified!"
- "Analysis" tab in main navigation unlocks
- Subscription status changes from "trial" to "active"

✅ **Database Changes:**
In `user_subscriptions` table:
- `status`: Changes from 'trial' to 'active'
- `subscription_start_date`: Set to current timestamp
- `subscription_end_date`: Set based on billing cycle (1 month or 1 year)
- `payment_transaction_hash`: Stores your test hash
- `crypto_payment_address`: Stores the payment address

✅ **UI Changes:**
- Premium features unlock immediately
- Trial banners disappear
- SubscriptionGate components allow access
- TrialStatusBanner shows "Active" status

## Testing Different Scenarios

### Scenario 1: Fresh Trial → Active Subscription
1. Start with a trial account (7 days remaining)
2. Complete payment flow
3. Verify trial converts to active subscription
4. Check that premium features unlock

### Scenario 2: Expired Trial → Active Subscription
1. Wait for trial to expire or manually set `trial_end_date` to past
2. Observe locked features and expired modal
3. Complete payment flow
4. Verify full access is restored

### Scenario 3: Duplicate Transaction Prevention
1. Complete payment flow with a test hash
2. Try to use the same test hash again
3. Should receive error: "This transaction has already been used for a subscription"

### Scenario 4: Invalid Transaction Hash
1. Enter a random hash NOT starting with TEST_
2. Real blockchain verification will fail
3. Should receive error: "Transaction verification failed"

## Verification Checklist

After completing the payment flow, verify:

- [ ] Subscription status is 'active'
- [ ] `subscription_start_date` is set to current time
- [ ] `subscription_end_date` is set correctly (1 month or 1 year ahead)
- [ ] `payment_transaction_hash` contains your test hash
- [ ] Analysis tab is accessible (no longer locked)
- [ ] Trial expiration banners are gone
- [ ] PerformanceStats and other premium features are visible
- [ ] Referral system still works
- [ ] No console errors

## Edge Function Logs

To debug issues, check the edge function logs:
1. Go to Supabase Dashboard → Edge Functions
2. Select `verify-payment` function
3. View logs to see:
   - Test mode activation
   - Transaction validation
   - Database update operations
   - Any errors

## Test Transaction Hash Format

Valid test hashes must follow this pattern:
```
TEST_<anything>
```

Examples:
- `TEST_1234567890_abc`
- `TEST_payment_simulation_eth`
- `TEST_manual_verification`

## Production Considerations

⚠️ **Important:** Before going to production:

1. **Remove Test Mode** (Optional):
   - Edit `supabase/functions/verify-payment/index.ts`
   - Remove or comment out the test mode check
   - Or add environment variable to control test mode

2. **Add Real Blockchain Verification**:
   - Current implementation has basic verification
   - Consider adding:
     - Amount verification
     - Confirmation count checks
     - Multiple blockchain explorers for redundancy

3. **Add API Keys** for blockchain APIs:
   - Etherscan API key for Ethereum
   - Consider Alchemy or Infura for better reliability
   - Solana RPC provider
   - Blockchain.info alternatives for Bitcoin

4. **Add Webhook Support**:
   - Real-time payment notifications
   - Automatic verification without user input
   - Better UX for users

5. **Add Payment Monitoring**:
   - Track pending payments
   - Send reminders for incomplete payments
   - Admin dashboard for payment management

## Troubleshooting

### Issue: Verification button does nothing
- Check browser console for errors
- Verify wallet is connected
- Ensure transaction hash is entered
- Check network requests in DevTools

### Issue: Payment verified but features still locked
- Manually refresh the page
- Check subscription status in database
- Verify RLS policies allow access
- Look for console errors

### Issue: "Transaction not found" error
- Make sure hash starts with TEST_
- Check edge function logs
- Verify test mode is enabled in verify-payment function

### Issue: Database not updating
- Check RLS policies on user_subscriptions table
- Verify Supabase service role key is set
- Review edge function logs for SQL errors

## Summary

The payment flow is fully functional with test mode enabled. You can:
- ✅ Test the complete flow without real crypto
- ✅ Verify subscription activation works
- ✅ Check premium feature unlocking
- ✅ Test error handling and edge cases
- ✅ Prepare for production deployment

The system is ready for real payments - just remove test mode and add proper blockchain verification for production use!
