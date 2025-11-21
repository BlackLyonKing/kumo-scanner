import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { TradingSignal } from "@/types/trading";
import { useToast } from "@/hooks/use-toast";

interface GeminiAnalysisProps {
  signals: TradingSignal[];
}

const GeminiAnalysis = ({ signals }: GeminiAnalysisProps) => {
  const [apiKey, setApiKey] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const getGeminiAnalysis = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to get AI analysis.",
        variant: "destructive",
      });
      return;
    }

    if (signals.length === 0) {
      toast({
        title: "No Data",
        description: "Please run a scan first to get analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create a concise summary of all high-grade signals
      const highGradeSignals = signals.filter(r => r.signalGrade === 'A' || r.signalGrade === 'B');
      const summaryOfSignals = highGradeSignals.length > 0 ? 
        highGradeSignals.map(s => `${s.symbol}: Grade ${s.signalGrade} ${s.signal} with daily RSI ${s.rsi.toFixed(2)}`).join('; ') : 
        'No high-grade signals found. The market is likely in a consolidation phase.';

      const topSignal = signals.sort((a, b) => {
        const gradeA = a.signalGrade === 'A' ? 3 : a.signalGrade === 'B' ? 2 : 1;
        const gradeB = b.signalGrade === 'A' ? 3 : b.signalGrade === 'B' ? 2 : 1;
        return gradeB - gradeA;
      })[0];

      let tradeIdeaPrompt = ``;
      if (topSignal && topSignal.signalGrade !== 'C') {
        tradeIdeaPrompt = `The top-graded signal is for ${topSignal.symbol} with a grade of ${topSignal.signalGrade}. This signal is a ${topSignal.signal} based on a daily ${topSignal.cloudStatus}, a ${topSignal.tkCross}, a Chikou Span ${topSignal.chikouSpanStatus}, and a daily RSI of ${topSignal.rsi.toFixed(2)}. The current price is $${topSignal.currentPrice.toFixed(2)}. Provide a detailed trade idea for this signal, including a clear entry, a stop-loss based on Ichimoku principles (e.g., below the Kijun-sen or cloud), and a potential take-profit target.`;
      } else {
        tradeIdeaPrompt = `No high-graded signals were found. Provide general market analysis and guidance.`;
      }

      const systemPrompt = `You are a world-class financial analyst and experienced Ichimoku trader. Your tone is conversational and professional. Provide a concise, single-paragraph summary of the overall market sentiment based on the provided data. Then, based on the top-graded signal, provide a detailed trade idea or general market guidance if no strong signals were found.`;

      const userQuery = `Analyze the market with the following signals:
      Summary of signals: ${summaryOfSignals}
      ${tradeIdeaPrompt}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setAnalysis(text);
        toast({
          title: "Analysis Complete! ✨",
          description: "AI market analysis has been generated successfully.",
        });
      } else {
        throw new Error('No analysis text received');
      }

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to get AI analysis. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary/80">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Market Analysis</h3>
            <span className="text-sm text-muted-foreground font-normal">
              Powered by Google Gemini • Advanced Trading Intelligence
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="space-y-3">
          <Label htmlFor="gemini-api-key" className="text-sm font-semibold text-foreground">
            Gemini API Key
          </Label>
          <Input
            id="gemini-api-key"
            type="password"
            placeholder="Enter your Gemini API key for AI analysis..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="glass-card border-border/50 focus:border-primary/50 transition-all duration-200"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Get your free API key from{" "}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent hover:text-accent/80 underline font-medium transition-colors"
            >
              Google AI Studio
            </a>
          </p>
        </div>
        
        <Button 
          onClick={getGeminiAnalysis}
          disabled={isAnalyzing || !apiKey.trim() || signals.length === 0}
          className="w-full premium-button text-white font-semibold py-3 rounded-xl"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Market Patterns...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate AI Analysis
            </>
          )}
        </Button>

        {analysis && (
          <div className="glass-card border-accent/30 bg-accent/5 rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-bold text-accent text-lg">Market Intelligence Report</h4>
            </div>
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
              <p className="whitespace-pre-wrap text-sm">
                {analysis}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiAnalysis;