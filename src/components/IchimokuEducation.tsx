import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, TrendingDown, Cloud, Target, AlertTriangle } from "lucide-react";

const IchimokuEducation = () => {
  const [activeTab, setActiveTab] = useState("basics");

  const indicators = [
    {
      name: "Tenkan-sen",
      description: "Conversion Line (9-period)",
      color: "text-blue-400",
      detail: "Shows short-term momentum. When price is above Tenkan, short-term trend is bullish."
    },
    {
      name: "Kijun-sen", 
      description: "Base Line (26-period)",
      color: "text-red-400",
      detail: "Shows medium-term momentum. Acts as dynamic support/resistance level."
    },
    {
      name: "Senkou Span A",
      description: "Leading Span A",
      color: "text-green-400", 
      detail: "Forms the faster boundary of the cloud. Calculated from Tenkan and Kijun average."
    },
    {
      name: "Senkou Span B",
      description: "Leading Span B (52-period)",
      color: "text-yellow-400",
      detail: "Forms the slower boundary of the cloud. Shows long-term trend direction."
    },
    {
      name: "Chikou Span",
      description: "Lagging Span",
      color: "text-purple-400",
      detail: "Current price plotted 26 periods back. Confirms trend strength."
    }
  ];

  const strategies = [
    {
      title: "Strong Bullish Signal",
      icon: <TrendingUp className="h-5 w-5 text-signal-long" />,
      conditions: [
        "Price above the cloud",
        "Tenkan above Kijun (bullish cross)",
        "Chikou above price 26 periods ago"
      ],
      description: "All three conditions align for maximum bullish confluence."
    },
    {
      title: "Strong Bearish Signal", 
      icon: <TrendingDown className="h-5 w-5 text-signal-short" />,
      conditions: [
        "Price below the cloud",
        "Tenkan below Kijun (bearish cross)", 
        "Chikou below price 26 periods ago"
      ],
      description: "All three conditions align for maximum bearish confluence."
    },
    {
      title: "Cloud Analysis",
      icon: <Cloud className="h-5 w-5 text-muted-foreground" />,
      conditions: [
        "Green cloud: Senkou A > Senkou B (bullish)",
        "Red cloud: Senkou A < Senkou B (bearish)",
        "Cloud acts as dynamic support/resistance"
      ],
      description: "The cloud shows future support/resistance levels and trend direction."
    }
  ];

  const riskTips = [
    "Never risk more than 1-2% of your account per trade",
    "Always use stop losses below/above the cloud",
    "Wait for all three confirmations before entering",
    "Avoid trading during major news events",
    "Practice on demo accounts before risking real money",
    "The cloud works best in trending markets"
  ];

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Ichimoku Trading Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-6 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">What is Ichimoku?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ichimoku Kinko Hyo (equilibrium chart) is a comprehensive trading system that provides
                information about support, resistance, trend direction, and momentum all in one view.
                Created by Japanese journalist Goichi Hosoda in the 1960s.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Key Advantages</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Complete trading system</li>
                    <li>• Works on all timeframes</li>
                    <li>• Shows future support/resistance</li>
                    <li>• Multiple confirmation signals</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <h4 className="font-semibold text-warning mb-2">Best Market Conditions</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Trending markets</li>
                    <li>• Medium to high volatility</li>
                    <li>• Avoid during sideways markets</li>
                    <li>• Works best on 4H+ timeframes</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Ichimoku Components</h3>
            <div className="space-y-3">
              {indicators.map((indicator, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold ${indicator.color}`}>
                      {indicator.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {indicator.description}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {indicator.detail}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Trading Strategies</h3>
            <div className="space-y-4">
              {strategies.map((strategy, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    {strategy.icon}
                    <h4 className="font-semibold text-foreground">{strategy.title}</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      {strategy.description}
                    </p>
                    <ul className="space-y-1">
                      {strategy.conditions.map((condition, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Target className="h-3 w-3 text-primary" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-6 space-y-4">
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold text-destructive">Risk Warning</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Trading cryptocurrencies involves significant risk. Never invest more than you can afford to lose.
                Past performance does not guarantee future results.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-foreground">Risk Management Tips</h3>
            <div className="grid gap-3">
              {riskTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IchimokuEducation;