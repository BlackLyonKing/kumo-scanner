export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  content?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export const ichimokuCourse: CourseModule[] = [
  {
    id: "module-1",
    title: "Module 1: Introduction to Ichimoku",
    description: "Understanding the basics and history of the Ichimoku Kinko Hyo system",
    lessons: [
      {
        id: "1-1",
        title: "What is Ichimoku Kinko Hyo?",
        duration: "15 min",
        type: "video",
        content: `# What is Ichimoku Kinko Hyo?

Ichimoku Kinko Hyo, often referred to simply as "Ichimoku," is a comprehensive technical analysis method that was developed by Japanese journalist Goichi Hosoda in the late 1930s. The name translates to "one glance equilibrium chart," which perfectly describes its purpose: to provide traders with all the information they need at a single glance.

## Key Components

The Ichimoku system consists of five lines:

1. **Tenkan-sen (Conversion Line)**: (9-period high + 9-period low) / 2
2. **Kijun-sen (Base Line)**: (26-period high + 26-period low) / 2
3. **Senkou Span A (Leading Span A)**: (Tenkan-sen + Kijun-sen) / 2, plotted 26 periods ahead
4. **Senkou Span B (Leading Span B)**: (52-period high + 52-period low) / 2, plotted 26 periods ahead
5. **Chikou Span (Lagging Span)**: Current closing price plotted 26 periods in the past

## The Cloud (Kumo)

The area between Senkou Span A and Senkou Span B forms the "cloud" or "Kumo." This cloud is the heart of the Ichimoku system and provides support and resistance levels, as well as trend direction.

## Why Ichimoku Works

Ichimoku works because it:
- Shows multiple timeframes simultaneously
- Provides clear support and resistance zones
- Identifies trend direction at a glance
- Generates high-probability trading signals
- Reduces emotional trading decisions

In crypto markets, Ichimoku is particularly powerful because it adapts well to high volatility and provides clear entry and exit signals.`
      },
      {
        id: "1-2",
        title: "History and Philosophy Behind Ichimoku",
        duration: "12 min",
        type: "video",
        content: `# History and Philosophy Behind Ichimoku

## The Creator: Goichi Hosoda

Goichi Hosoda spent over 30 years developing and refining the Ichimoku Kinko Hyo system before releasing it to the public in 1969. His dedication to perfection and extensive backtesting created one of the most reliable technical analysis systems ever developed.

## The Three Pillars

Hosoda based Ichimoku on three key principles:

1. **Time is more important than price**: The system emphasizes timing over price levels
2. **The market is in equilibrium**: Prices naturally seek balance
3. **The wave principle**: Markets move in waves that can be predicted

## Japanese Market Wisdom

Ichimoku incorporates centuries of Japanese market wisdom:
- Patience and discipline
- Harmony and balance
- Long-term perspective
- Risk management first

## Why 9, 26, and 52?

The original time periods were based on:
- 9: One and a half weeks of trading (6-day weeks in 1930s Japan)
- 26: One month of trading
- 52: Two months of trading

In modern 24/7 crypto markets, these periods still work remarkably well due to the psychological patterns they capture.

## Evolution to Crypto Trading

While developed for Japanese equities, Ichimoku has proven even more effective in crypto markets because:
- Crypto trends are stronger and clearer
- 24/7 trading provides more data points
- Volatility makes the cloud more visible
- Global participation creates clean technical patterns`
      },
      {
        id: "1-3",
        title: "Setting Up Your Charts",
        duration: "10 min",
        type: "video",
        content: `# Setting Up Your Charts

## Recommended Trading Platforms

For crypto trading with Ichimoku, we recommend:
1. **TradingView** - Best for analysis and alerts
2. **Binance** - For actual trading execution
3. **Coinigy** - Multi-exchange platform

## Chart Configuration

### Step 1: Add Ichimoku Indicator
1. Click on "Indicators" in your charting platform
2. Search for "Ichimoku Cloud" or "Ichimoku Kinko Hyo"
3. Add to your chart

### Step 2: Optimize Colors
- Bullish Cloud: Green (#00ff00)
- Bearish Cloud: Red (#ff0000)
- Tenkan-sen: Blue (#0000ff)
- Kijun-sen: Red (#ff0000)
- Chikou Span: Purple (#800080)

### Step 3: Set Time Periods
Standard settings work best:
- Tenkan: 9
- Kijun: 26
- Senkou Span B: 52
- Displacement: 26

### Step 4: Multiple Timeframe Setup
Open 3 charts for complete analysis:
- 1H chart for entry timing
- 4H chart for trend confirmation
- 1D chart for overall market direction

## Workspace Organization

Create a trading workspace with:
- Main chart with Ichimoku (4H timeframe)
- Secondary chart for lower timeframe (1H)
- Volume indicator
- RSI for confirmation
- Your watchlist panel

## Mobile Trading Setup

For on-the-go analysis:
- Use TradingView mobile app
- Set price alerts at cloud boundaries
- Enable push notifications
- Prepare preset layouts for quick access`
      },
      {
        id: "1-4",
        title: "Module 1 Quiz",
        duration: "5 min",
        type: "quiz",
        content: `# Module 1 Quiz

Test your understanding of Ichimoku basics:

1. What does "Ichimoku Kinko Hyo" translate to?
   - A) One glance equilibrium chart
   - B) Cloud trading system
   - C) Japanese indicator
   - D) Five-line method

2. Who created the Ichimoku system?
   - A) Homma Munehisa
   - B) Goichi Hosoda
   - C) W.D. Gann
   - D) Charles Dow

3. What forms the Ichimoku cloud?
   - A) Tenkan and Kijun
   - B) Senkou A and Senkou B
   - C) Chikou and Tenkan
   - D) All five lines

4. What is the standard Tenkan-sen period?
   - A) 7
   - B) 9
   - C) 14
   - D) 26

5. Why does Ichimoku work well in crypto markets?
   - A) High volatility makes patterns clear
   - B) 24/7 trading provides more data
   - C) Strong trending behavior
   - D) All of the above

Answers: 1-A, 2-B, 3-B, 4-B, 5-D`
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: The Five Lines Explained",
    description: "Deep dive into each component of the Ichimoku system",
    lessons: [
      {
        id: "2-1",
        title: "Tenkan-sen (Conversion Line)",
        duration: "18 min",
        type: "video",
        content: `# Tenkan-sen (Conversion Line)

## Calculation
Tenkan-sen = (9-period high + 9-period low) / 2

## What It Represents
The Tenkan-sen is the fastest moving line in Ichimoku, representing the short-term equilibrium price. It shows the market's immediate sentiment and reacts quickly to price changes.

## Key Characteristics

### Speed and Sensitivity
- Responds to price within 9 periods
- Crosses price frequently
- First line to react to trend changes

### Trading Signals
1. **Price crosses above Tenkan**: Short-term bullish
2. **Price crosses below Tenkan**: Short-term bearish
3. **Tenkan slopes up**: Short-term uptrend
4. **Tenkan slopes down**: Short-term downtrend

## TK Cross Signals
When Tenkan crosses Kijun (covered next), it generates powerful signals:
- **Golden Cross**: Tenkan crosses above Kijun = Buy signal
- **Death Cross**: Tenkan crosses below Kijun = Sell signal

## Crypto Trading Applications

### Scalping (5m-15m charts)
Use Tenkan for:
- Quick entry confirmations
- Stop loss placement
- Momentum gauge

### Day Trading (1H-4H charts)
Use Tenkan for:
- Trend confirmation
- Entry timing
- Momentum shifts

## Common Mistakes
❌ Trading Tenkan crosses alone without other confirmation
❌ Using Tenkan in choppy, sideways markets
❌ Ignoring the slope and angle of Tenkan

## Pro Tips
✅ Combine with cloud position for better signals
✅ Watch for Tenkan flat periods (consolidation)
✅ Use Tenkan as dynamic support/resistance
✅ Look for Tenkan rejections at cloud edges`
      },
      {
        id: "2-2",
        title: "Kijun-sen (Base Line)",
        duration: "20 min",
        type: "video",
        content: `# Kijun-sen (Base Line)

## Calculation
Kijun-sen = (26-period high + 26-period low) / 2

## What It Represents
The Kijun-sen is the medium-term equilibrium line. It moves slower than Tenkan and represents a more stable price level. Many traders consider it the most important line in Ichimoku.

## Key Characteristics

### Stability and Reliability
- Changes direction less frequently
- Strong support/resistance level
- Indicates medium-term trend
- Price respects it more than Tenkan

## Trading Signals

### 1. Kijun Cross
When price crosses Kijun:
- **Above Kijun**: Medium-term bullish
- **Below Kijun**: Medium-term bearish

### 2. Kijun Flat
When Kijun is horizontal:
- Market is in equilibrium
- Preparing for breakout
- Consolidation phase
- **Trading opportunity**: Breakout in either direction

### 3. Kijun Bounce
When price touches and bounces off Kijun:
- Strong confirmation of trend
- High-probability continuation
- Good entry point

## The Kijun as a Stop Loss
Professional traders use Kijun for stop loss because:
- If price closes below Kijun, trend is broken
- Provides enough room for volatility
- Not too tight, not too wide
- Automatically adjusts with price

## Crypto Trading Strategies

### Strategy 1: Kijun Bounce Trade
1. Identify strong trend (price above cloud)
2. Wait for pullback to Kijun
3. Enter when price bounces off Kijun
4. Stop loss slightly below Kijun
5. Target next resistance level

### Strategy 2: Kijun Breakout
1. Identify Kijun flat period (3+ candles)
2. Wait for strong breakout above/below
3. Enter on retest of Kijun
4. Stop loss on opposite side
5. Ride the trend

## Advanced Concepts

### Kijun Angle
- Steep angle = Strong trend
- Flat = Consolidation
- Changing direction = Trend reversal

### Multiple Timeframe Kijun
- Use higher timeframe Kijun (4H or 1D)
- Acts as stronger support/resistance
- Better for position sizing

## Common Mistakes
❌ Ignoring Kijun as support/resistance
❌ Not waiting for Kijun confirmation
❌ Trading against Kijun slope

## Pro Tips
✅ Kijun flat = Prepare for action
✅ Use as trailing stop in trends
✅ Wait for price to respect Kijun before entering
✅ Check Kijun on multiple timeframes`
      },
      {
        id: "2-3",
        title: "Senkou Span A & B (The Cloud)",
        duration: "25 min",
        type: "video",
        content: `# Senkou Span A & B (The Cloud)

## Calculations
- **Senkou Span A**: (Tenkan + Kijun) / 2, plotted 26 periods ahead
- **Senkou Span B**: (52-period high + 52-period low) / 2, plotted 26 periods ahead

## The Kumo (Cloud)
The space between Senkou A and Senkou B forms the cloud - the most distinctive feature of Ichimoku.

## Cloud Colors
- **Bullish Cloud (Green)**: Senkou A is above Senkou B
- **Bearish Cloud (Red)**: Senkou A is below Senkou B

## Key Characteristics

### 1. Support and Resistance
The cloud acts as dynamic support and resistance:
- **Above cloud**: Strong uptrend zone
- **In cloud**: Equilibrium, no clear trend
- **Below cloud**: Strong downtrend zone

### 2. Cloud Thickness
- **Thick cloud**: Strong support/resistance, hard to break
- **Thin cloud**: Weak support/resistance, easier to break
- **Changing thickness**: Volatility indication

### 3. Future Cloud
Because the cloud is plotted ahead, it shows:
- Future support/resistance zones
- Potential breakout targets
- Trend continuation probability

## Cloud Trading Signals

### Signal 1: Cloud Breakout
**Bullish Setup:**
- Price closes above cloud
- Cloud turns green
- Strong volume confirmation
- Action: Enter long, target next resistance

**Bearish Setup:**
- Price closes below cloud
- Cloud turns red
- Strong volume confirmation
- Action: Enter short, target next support

### Signal 2: Cloud Twist (Kumo Twist)
When Senkou A and B cross:
- Major trend reversal signal
- Wait for price confirmation
- Look for volume increase
- Most powerful at cloud edges

### Signal 3: Cloud Bounce
When price touches cloud and bounces:
- Trend continuation signal
- High-probability setup
- Enter on bounce
- Stop below/above cloud

## Cloud Strategies for Crypto

### Strategy 1: Above Cloud Trend Riding
1. Wait for price above cloud
2. Cloud must be green
3. Enter on pullback to cloud
4. Stop loss inside cloud
5. Trail stop with cloud bottom

### Strategy 2: Cloud Break and Retest
1. Price breaks through cloud
2. Wait for retest from above
3. Cloud acts as support
4. Enter on bounce
5. Stop below cloud

### Strategy 3: Cloud Rejection
1. Price approaches cloud from below
2. Tries to enter but gets rejected
3. Enter short on rejection
4. Stop above cloud
5. Target lower support

## Advanced Cloud Analysis

### Multiple Timeframe Clouds
- 1H cloud: Short-term trading
- 4H cloud: Day trading
- 1D cloud: Position trading
- **Rule**: Higher timeframe cloud is stronger

### Cloud Symmetry
- Parallel cloud edges: Stable trend
- Diverging edges: Increasing volatility
- Converging edges: Decreasing volatility

### Future Cloud Analysis
Look at the cloud 26 periods ahead:
- Green future cloud: Bullish bias
- Red future cloud: Bearish bias
- Thin future cloud: Breakout expected

## Common Mistakes
❌ Trading inside the cloud (low probability)
❌ Ignoring cloud thickness
❌ Not waiting for confirmation
❌ Fighting against the cloud

## Pro Tips
✅ Thicker cloud = Stronger signal when broken
✅ Use cloud edge as stop loss
✅ Best entries at cloud boundaries
✅ Future cloud shows where price may go
✅ Cloud twist = Major reversal coming`
      },
      {
        id: "2-4",
        title: "Chikou Span (Lagging Span)",
        duration: "16 min",
        type: "video",
        content: `# Chikou Span (Lagging Span)

## Calculation
Chikou Span = Current closing price plotted 26 periods in the past

## What It Represents
The Chikou Span is the most underrated line in Ichimoku. It represents momentum and trend confirmation by comparing current price to historical price levels.

## Why It's Powerful
- Eliminates noise and false signals
- Shows true momentum
- Confirms trend strength
- Provides historical context

## Key Signals

### 1. Chikou Position Relative to Price
- **Chikou above price**: Bullish momentum
- **Chikou below price**: Bearish momentum
- **Chikou crossing price**: Momentum shift

### 2. Chikou and Cloud Interaction
- **Chikou above historical cloud**: Strong bullish confirmation
- **Chikou below historical cloud**: Strong bearish confirmation
- **Chikou in historical cloud**: Weak momentum, avoid trading

### 3. Chikou Free Space
When Chikou has clear space (not overlapping with price):
- Clean uptrend or downtrend
- High-probability trading zone
- Momentum is strong

## Trading with Chikou

### Confirmation Filter
Only take trades when:
✅ Long trades: Chikou above price AND above historical cloud
✅ Short trades: Chikou below price AND below historical cloud

### Entry Timing
Wait for Chikou to:
1. Cross above/below price
2. Cross above/below historical cloud
3. Move into free space

### Exit Signal
Exit when:
- Chikou crosses back through price
- Chikou enters historical cloud
- Chikou changes direction

## Crypto Trading Applications

### Bitcoin Trend Trading
1. Check 1D chart Chikou position
2. Only trade in direction of Chikou
3. Use lower timeframe for entries
4. Exit when Chikou weakens

### Altcoin Momentum Trading
1. Look for Chikou breaking into free space
2. Enter on lower timeframe confirmation
3. Ride momentum until Chikou stalls
4. Exit on Chikou reversal

## Advanced Concepts

### Chikou Span Oscillator
Create custom indicator:
- Measure distance between Chikou and price
- Large distance = Strong momentum
- Decreasing distance = Momentum fading

### Multi-Timeframe Chikou
Check Chikou on 3 timeframes:
- 1H: Short-term momentum
- 4H: Medium-term momentum
- 1D: Long-term momentum
- **Trade when all align**

## Common Mistakes
❌ Ignoring Chikou completely
❌ Trading when Chikou is in historical cloud
❌ Not waiting for Chikou confirmation

## Pro Tips
✅ Chikou is the ultimate confirmation
✅ Free space = Strong trend
✅ Wait for Chikou to clear price action
✅ Use with other lines for best results
✅ Chikou prevents false breakouts`
      },
      {
        id: "2-5",
        title: "Module 2 Quiz",
        duration: "5 min",
        type: "quiz"
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Reading the Cloud",
    description: "Master cloud analysis and interpretation",
    lessons: [
      {
        id: "3-1",
        title: "Bullish vs Bearish Cloud Patterns",
        duration: "20 min",
        type: "video"
      },
      {
        id: "3-2",
        title: "Cloud Thickness and What It Means",
        duration: "15 min",
        type: "video"
      },
      {
        id: "3-3",
        title: "Future Cloud Analysis",
        duration: "18 min",
        type: "video"
      },
      {
        id: "3-4",
        title: "Cloud Twist (Kumo Twist) Signals",
        duration: "22 min",
        type: "video"
      },
      {
        id: "3-5",
        title: "Module 3 Practical Exercise",
        duration: "15 min",
        type: "quiz"
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: TK Cross Strategy",
    description: "Tenkan-Kijun crossover trading strategies",
    lessons: [
      {
        id: "4-1",
        title: "Understanding TK Crosses",
        duration: "20 min",
        type: "video"
      },
      {
        id: "4-2",
        title: "Golden Cross Setup",
        duration: "18 min",
        type: "video"
      },
      {
        id: "4-3",
        title: "Death Cross Setup",
        duration: "18 min",
        type: "video"
      },
      {
        id: "4-4",
        title: "TK Cross Confirmation Techniques",
        duration: "16 min",
        type: "video"
      },
      {
        id: "4-5",
        title: "TK Cross Live Examples",
        duration: "25 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-5",
    title: "Module 5: Perfect Entry Setups",
    description: "Identifying high-probability entry points",
    lessons: [
      {
        id: "5-1",
        title: "The 5-Line Confirmation Strategy",
        duration: "22 min",
        type: "video"
      },
      {
        id: "5-2",
        title: "Cloud Breakout Entries",
        duration: "20 min",
        type: "video"
      },
      {
        id: "5-3",
        title: "Kijun Bounce Entries",
        duration: "18 min",
        type: "video"
      },
      {
        id: "5-4",
        title: "Support/Resistance with Ichimoku",
        duration: "16 min",
        type: "video"
      },
      {
        id: "5-5",
        title: "Entry Timing and Execution",
        duration: "20 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-6",
    title: "Module 6: Exit Strategies",
    description: "When and how to take profits and cut losses",
    lessons: [
      {
        id: "6-1",
        title: "Profit Target Placement",
        duration: "18 min",
        type: "video"
      },
      {
        id: "6-2",
        title: "Stop Loss Using Ichimoku",
        duration: "20 min",
        type: "video"
      },
      {
        id: "6-3",
        title: "Trailing Stops with Cloud",
        duration: "16 min",
        type: "video"
      },
      {
        id: "6-4",
        title: "Scaling In and Out",
        duration: "22 min",
        type: "video"
      },
      {
        id: "6-5",
        title: "Exit Signal Recognition",
        duration: "15 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-7",
    title: "Module 7: Multi-Timeframe Analysis",
    description: "Using Ichimoku across different timeframes",
    lessons: [
      {
        id: "7-1",
        title: "The Power of Multiple Timeframes",
        duration: "20 min",
        type: "video"
      },
      {
        id: "7-2",
        title: "Top-Down Analysis Method",
        duration: "22 min",
        type: "video"
      },
      {
        id: "7-3",
        title: "Timeframe Alignment Signals",
        duration: "18 min",
        type: "video"
      },
      {
        id: "7-4",
        title: "1H, 4H, 1D Strategy",
        duration: "25 min",
        type: "video"
      },
      {
        id: "7-5",
        title: "Multi-Timeframe Practice",
        duration: "20 min",
        type: "quiz"
      }
    ]
  },
  {
    id: "module-8",
    title: "Module 8: Risk Management",
    description: "Protecting your capital and managing position size",
    lessons: [
      {
        id: "8-1",
        title: "Position Sizing with Ichimoku",
        duration: "20 min",
        type: "video"
      },
      {
        id: "8-2",
        title: "Risk-Reward Ratios",
        duration: "18 min",
        type: "video"
      },
      {
        id: "8-3",
        title: "Portfolio Allocation",
        duration: "16 min",
        type: "video"
      },
      {
        id: "8-4",
        title: "Maximum Drawdown Protection",
        duration: "22 min",
        type: "video"
      },
      {
        id: "8-5",
        title: "Risk Management Calculator",
        duration: "15 min",
        type: "reading"
      }
    ]
  },
  {
    id: "module-9",
    title: "Module 9: Combining Ichimoku with Other Indicators",
    description: "Enhancing Ichimoku with complementary tools",
    lessons: [
      {
        id: "9-1",
        title: "Ichimoku + RSI Strategy",
        duration: "22 min",
        type: "video"
      },
      {
        id: "9-2",
        title: "Ichimoku + Volume Analysis",
        duration: "20 min",
        type: "video"
      },
      {
        id: "9-3",
        title: "Ichimoku + Fibonacci",
        duration: "18 min",
        type: "video"
      },
      {
        id: "9-4",
        title: "Ichimoku + Support/Resistance",
        duration: "16 min",
        type: "video"
      },
      {
        id: "9-5",
        title: "Creating Your Custom System",
        duration: "25 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-10",
    title: "Module 10: Advanced Strategies",
    description: "Professional-level Ichimoku techniques",
    lessons: [
      {
        id: "10-1",
        title: "Wave Theory with Ichimoku",
        duration: "25 min",
        type: "video"
      },
      {
        id: "10-2",
        title: "Hidden Divergence Patterns",
        duration: "22 min",
        type: "video"
      },
      {
        id: "10-3",
        title: "Accumulation and Distribution Zones",
        duration: "20 min",
        type: "video"
      },
      {
        id: "10-4",
        title: "Market Structure Analysis",
        duration: "24 min",
        type: "video"
      },
      {
        id: "10-5",
        title: "Advanced Pattern Recognition",
        duration: "28 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-11",
    title: "Module 11: Real Trading Examples",
    description: "Live trades analyzed with Ichimoku",
    lessons: [
      {
        id: "11-1",
        title: "Bitcoin Bull Market Trades",
        duration: "30 min",
        type: "video"
      },
      {
        id: "11-2",
        title: "Ethereum Swing Trading",
        duration: "28 min",
        type: "video"
      },
      {
        id: "11-3",
        title: "Altcoin Breakout Trades",
        duration: "25 min",
        type: "video"
      },
      {
        id: "11-4",
        title: "Bear Market Strategies",
        duration: "26 min",
        type: "video"
      },
      {
        id: "11-5",
        title: "Common Mistakes and How to Avoid Them",
        duration: "22 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-12",
    title: "Module 12: Building Your Trading Plan",
    description: "Creating a complete Ichimoku trading system",
    lessons: [
      {
        id: "12-1",
        title: "Defining Your Trading Style",
        duration: "20 min",
        type: "video"
      },
      {
        id: "12-2",
        title: "Creating Your Watchlist",
        duration: "18 min",
        type: "video"
      },
      {
        id: "12-3",
        title: "Daily Trading Routine",
        duration: "22 min",
        type: "video"
      },
      {
        id: "12-4",
        title: "Trading Journal Setup",
        duration: "16 min",
        type: "video"
      },
      {
        id: "12-5",
        title: "Final Assessment and Certification",
        duration: "30 min",
        type: "quiz"
      }
    ]
  }
];
