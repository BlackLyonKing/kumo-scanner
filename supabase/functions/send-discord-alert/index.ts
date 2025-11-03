import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiscordAlertRequest {
  symbol: string;
  signal: string;
  signalGrade: string;
  currentPrice: number;
  cloudStatus: string;
  tkCross: string;
  chikouSpanStatus: string;
  rsi: number;
  priceChangePercent24h?: number;
  volume24h?: number;
  signalStrength?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    
    if (!webhookUrl) {
      throw new Error('Discord webhook URL not configured');
    }

    const signalData: DiscordAlertRequest = await req.json();
    console.log('Sending signal to Discord:', signalData);

    // Determine color based on signal type and grade
    let color = 0x808080; // Gray default
    if (signalData.signalGrade === 'A') {
      color = signalData.signal === 'BUY' ? 0x00ff00 : 0xff0000; // Green for buy, Red for sell
    } else if (signalData.signalGrade === 'B') {
      color = signalData.signal === 'BUY' ? 0x90ee90 : 0xffa07a; // Light green/red
    } else if (signalData.signalGrade === 'C') {
      color = 0xffff00; // Yellow
    }

    // Format the signal strength
    const strengthBar = signalData.signalStrength 
      ? `${'█'.repeat(Math.floor(signalData.signalStrength / 10))}${'░'.repeat(10 - Math.floor(signalData.signalStrength / 10))} ${signalData.signalStrength}%`
      : 'N/A';

    // Create Discord embed
    const embed = {
      title: `🎯 ${signalData.signal} Signal - Grade ${signalData.signalGrade}`,
      description: `**${signalData.symbol}** trading signal detected`,
      color: color,
      fields: [
        {
          name: '💰 Current Price',
          value: `$${signalData.currentPrice.toFixed(8)}`,
          inline: true
        },
        {
          name: '📊 Signal Grade',
          value: signalData.signalGrade,
          inline: true
        },
        {
          name: '🎚️ Signal Strength',
          value: strengthBar,
          inline: false
        },
        {
          name: '☁️ Cloud Status',
          value: signalData.cloudStatus,
          inline: true
        },
        {
          name: '⚡ TK Cross',
          value: signalData.tkCross,
          inline: true
        },
        {
          name: '📈 Chikou Span',
          value: signalData.chikouSpanStatus,
          inline: true
        },
        {
          name: '🎲 RSI',
          value: signalData.rsi.toFixed(2),
          inline: true
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: false
        },
        {
          name: '🚀 Recent Success',
          value: 'After our last alert, $ASTER made a move of over **+15%** to the upside! 📈',
          inline: false
        },
        {
          name: '⭐ Want Grade A Signals?',
          value: '🚀 **Upgrade now** to get premium Grade A signals with the highest accuracy!\n[**Sign Up for Membership →**](https://blktrading.group/subscribe)',
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'B.L.K. Trading Signal'
      }
    };

    // Add optional fields if available
    if (signalData.priceChangePercent24h !== undefined) {
      embed.fields.push({
        name: '📉 24h Change',
        value: `${signalData.priceChangePercent24h > 0 ? '+' : ''}${signalData.priceChangePercent24h.toFixed(2)}%`,
        inline: true
      });
    }

    if (signalData.volume24h) {
      embed.fields.push({
        name: '📊 24h Volume',
        value: `$${signalData.volume24h.toLocaleString()}`,
        inline: true
      });
    }

    // Send to Discord
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      }),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord API error:', errorText);
      throw new Error(`Discord API returned ${discordResponse.status}: ${errorText}`);
    }

    console.log('Successfully sent signal to Discord');

    return new Response(
      JSON.stringify({ success: true, message: 'Signal sent to Discord' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-discord-alert function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
