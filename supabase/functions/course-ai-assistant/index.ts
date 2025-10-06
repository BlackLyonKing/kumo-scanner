import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, history } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build conversation history for context
    const messages = [
      {
        role: "system",
        content: `You are an expert algorithmic trading instructor and Python programming tutor. You specialize in:
        
- Teaching Python for financial markets and algorithmic trading
- Explaining technical indicators and trading strategies
- Helping students understand backtesting and optimization
- Debugging Python code for trading bots
- Best practices for risk management in algorithmic trading
- Exchange API integration (CCXT, Binance, etc.)
- Data analysis with pandas, numpy, and matplotlib

Context: ${context}

Guidelines:
- Be clear and educational in your explanations
- Provide code examples when relevant
- Break down complex concepts into simple steps
- Encourage good coding practices
- Warn about common pitfalls in trading
- Always emphasize risk management
- Be supportive and patient with learners
- Use practical, real-world examples from crypto trading`
      }
    ];

    // Add conversation history (last 4 messages for context)
    if (history && Array.isArray(history)) {
      messages.push(...history.slice(-4));
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Course AI Assistant Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
