import { CourseModule } from "./ichimokuCourse";

export const algorithmicTradingCourse: CourseModule[] = [
  {
    id: "module-1",
    title: "Module 1: Python for Trading Fundamentals",
    description: "Master Python programming essentials for algorithmic trading",
    lessons: [
      {
        id: "1-1",
        title: "Python Environment Setup for Trading",
        duration: "25 min",
        type: "video",
        content: `# Python Environment Setup for Trading

## Why Python for Algorithmic Trading?

Python has become the de facto standard for algorithmic trading because:
- **Extensive libraries**: pandas, numpy, matplotlib, TA-Lib
- **Easy to learn**: Clear syntax, readable code
- **Community support**: Millions of traders use Python
- **API integration**: Works with all major exchanges
- **Backtesting frameworks**: Backtrader, Zipline, QuantConnect
- **Machine learning**: scikit-learn, TensorFlow for AI strategies

## Setting Up Your Trading Environment

### Step 1: Install Python

**Download Python 3.11+ from python.org**

\`\`\`bash
# Verify installation
python --version
# Should show: Python 3.11.x or higher
\`\`\`

### Step 2: Install Package Manager (pip)

\`\`\`bash
# Verify pip installation
pip --version

# Upgrade pip to latest
python -m pip install --upgrade pip
\`\`\`

### Step 3: Create Virtual Environment

**Why virtual environments?**
- Isolate project dependencies
- Avoid version conflicts
- Easy to replicate setups

\`\`\`bash
# Create virtual environment
python -m venv trading_env

# Activate on Windows
trading_env\\Scripts\\activate

# Activate on Mac/Linux
source trading_env/bin/activate

# You should see (trading_env) in your terminal
\`\`\`

### Step 4: Install Essential Libraries

\`\`\`bash
# Core data science libraries
pip install pandas numpy matplotlib

# Technical analysis
pip install ta-lib
# Note: TA-Lib might need additional setup on Windows

# Crypto exchange APIs
pip install ccxt

# Backtesting
pip install backtrader

# Web framework for dashboards
pip install streamlit

# Save dependencies
pip freeze > requirements.txt
\`\`\`

## Essential Libraries Explained

### 1. Pandas - Data Manipulation
\`\`\`python
import pandas as pd

# Create DataFrame for price data
data = pd.DataFrame({
    'timestamp': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'open': [40000, 40500, 41000],
    'high': [40800, 41200, 41500],
    'low': [39800, 40200, 40800],
    'close': [40500, 41000, 41200],
    'volume': [1000, 1200, 1100]
})

print(data)
\`\`\`

### 2. NumPy - Mathematical Operations
\`\`\`python
import numpy as np

# Calculate returns
prices = np.array([40000, 40500, 41000, 41200])
returns = np.diff(prices) / prices[:-1]
print(f"Returns: {returns}")

# Calculate average
avg_return = np.mean(returns)
print(f"Average return: {avg_return:.4f}")
\`\`\`

### 3. Matplotlib - Visualization
\`\`\`python
import matplotlib.pyplot as plt

# Plot price chart
plt.figure(figsize=(10, 6))
plt.plot(data['timestamp'], data['close'])
plt.title('Bitcoin Price')
plt.xlabel('Date')
plt.ylabel('Price ($)')
plt.show()
\`\`\`

### 4. CCXT - Exchange Integration
\`\`\`python
import ccxt

# Connect to Binance
exchange = ccxt.binance()

# Fetch OHLCV data
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', limit=100)
print(f"Fetched {len(ohlcv)} candles")
\`\`\`

## Your First Trading Script

Create a file called \`fetch_data.py\`:

\`\`\`python
import ccxt
import pandas as pd
from datetime import datetime

# Initialize exchange
exchange = ccxt.binance()

def fetch_crypto_data(symbol, timeframe='1h', limit=100):
    """
    Fetch OHLCV data from Binance
    
    Parameters:
    - symbol: Trading pair (e.g., 'BTC/USDT')
    - timeframe: Candle size ('1m', '5m', '1h', '1d')
    - limit: Number of candles to fetch
    
    Returns:
    - DataFrame with OHLCV data
    """
    print(f"Fetching {symbol} data...")
    
    # Fetch data
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
    
    # Convert to DataFrame
    df = pd.DataFrame(
        ohlcv, 
        columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
    )
    
    # Convert timestamp to datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    
    return df

# Example usage
if __name__ == "__main__":
    # Fetch Bitcoin data
    btc_data = fetch_crypto_data('BTC/USDT', '1h', 100)
    
    # Display first 5 rows
    print(btc_data.head())
    
    # Display basic statistics
    print("\\nBasic Statistics:")
    print(btc_data['close'].describe())
    
    # Save to CSV
    btc_data.to_csv('btc_data.csv', index=False)
    print("\\nData saved to btc_data.csv")
\`\`\`

## Running Your Script

\`\`\`bash
# Make sure virtual environment is activated
python fetch_data.py
\`\`\`

## IDE Setup Recommendations

### VS Code (Recommended)
1. Download from code.visualstudio.com
2. Install Python extension
3. Select your virtual environment
4. Use integrated terminal

### Jupyter Notebook (For Exploration)
\`\`\`bash
pip install jupyter

# Launch notebook
jupyter notebook
\`\`\`

### PyCharm (Advanced)
- Professional IDE for Python
- Great debugging tools
- Built-in terminal

## Common Installation Issues

### Issue: TA-Lib won't install
**Solution for Windows:**
\`\`\`bash
# Download wheel file from:
# https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib

# Install the wheel
pip install TA_Lib‑0.4.24‑cp311‑cp311‑win_amd64.whl
\`\`\`

### Issue: Permission errors
**Solution:**
\`\`\`bash
# Use --user flag
pip install --user package_name
\`\`\`

### Issue: ModuleNotFoundError
**Solution:**
\`\`\`bash
# Make sure virtual environment is activated
# Reinstall the package
pip install package_name
\`\`\`

## Best Practices

### 1. Always Use Virtual Environments
✅ Create one per project
✅ Keep dependencies isolated
✅ Document in requirements.txt

### 2. Version Control
✅ Use Git for code
✅ Ignore .env files (API keys)
✅ Track requirements.txt

### 3. Code Organization
\`\`\`
trading_bot/
├── data/
│   └── fetch_data.py
├── strategies/
│   └── moving_average.py
├── backtesting/
│   └── backtest.py
├── utils/
│   └── helpers.py
├── config.py
├── requirements.txt
└── main.py
\`\`\`

### 4. Configuration Files
Create \`config.py\`:
\`\`\`python
# Trading parameters
SYMBOL = 'BTC/USDT'
TIMEFRAME = '1h'
RISK_PER_TRADE = 0.02  # 2% risk

# API credentials (use environment variables)
import os
API_KEY = os.getenv('BINANCE_API_KEY')
API_SECRET = os.getenv('BINANCE_API_SECRET')
\`\`\`

## Next Steps

In the following lessons, you'll learn:
1. Data manipulation with Pandas
2. Technical indicator calculations
3. Building trading strategies
4. Backtesting frameworks
5. Live trading automation

## Practice Exercise

Create a script that:
1. Fetches BTC and ETH data
2. Calculates 7-day returns
3. Plots both on same chart
4. Saves results to CSV

Try it yourself before moving to the next lesson!`
      },
      {
        id: "1-2",
        title: "Data Manipulation with Pandas",
        duration: "30 min",
        type: "video",
        content: `# Data Manipulation with Pandas

Pandas is the foundation of algorithmic trading in Python. Mastering it is essential for processing market data.

## Understanding DataFrames

A DataFrame is a 2D labeled data structure - think of it as an Excel spreadsheet in Python.

### Creating DataFrames

\`\`\`python
import pandas as pd

# Method 1: From dictionary
data = {
    'timestamp': pd.date_range('2024-01-01', periods=5, freq='D'),
    'price': [40000, 40500, 41000, 40800, 41200],
    'volume': [1000, 1200, 1100, 1150, 1300]
}
df = pd.DataFrame(data)
print(df)

# Method 2: From CSV
df = pd.read_csv('btc_data.csv')

# Method 3: From API (covered in previous lesson)
import ccxt
exchange = ccxt.binance()
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h')
df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
\`\`\`

## Essential DataFrame Operations

### Viewing Data

\`\`\`python
# First 5 rows
print(df.head())

# Last 5 rows
print(df.tail())

# Random 5 rows
print(df.sample(5))

# DataFrame info
print(df.info())

# Statistical summary
print(df.describe())

# Column names
print(df.columns)

# Data types
print(df.dtypes)
\`\`\`

### Selecting Data

\`\`\`python
# Select single column
prices = df['close']

# Select multiple columns
subset = df[['open', 'close', 'volume']]

# Select rows by index
first_row = df.iloc[0]  # First row
last_row = df.iloc[-1]  # Last row
rows_2_to_5 = df.iloc[2:6]  # Rows 2-5

# Select rows by condition
high_volume = df[df['volume'] > 1000]
price_above_40k = df[df['close'] > 40000]

# Multiple conditions
filtered = df[(df['close'] > 40000) & (df['volume'] > 1000)]
\`\`\`

### Adding New Columns

\`\`\`python
# Calculate returns
df['returns'] = df['close'].pct_change()

# Calculate price change
df['price_change'] = df['close'] - df['open']

# Binary signal
df['bull'] = df['close'] > df['open']

# Cumulative returns
df['cum_returns'] = (1 + df['returns']).cumprod()
\`\`\`

## Working with Time Series

### Setting DateTime Index

\`\`\`python
# Convert timestamp column to datetime
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Set as index
df.set_index('timestamp', inplace=True)

# Now you can use powerful time-based operations
print(df.loc['2024-01-01'])  # Data for specific date
print(df['2024-01':'2024-02'])  # Data for date range
\`\`\`

### Resampling Time Series

\`\`\`python
# Convert 1-hour data to 4-hour
df_4h = df.resample('4H').agg({
    'open': 'first',
    'high': 'max',
    'low': 'min',
    'close': 'last',
    'volume': 'sum'
})

# Convert to daily
df_daily = df.resample('1D').agg({
    'open': 'first',
    'high': 'max',
    'low': 'min',
    'close': 'last',
    'volume': 'sum'
})
\`\`\`

## Calculating Technical Indicators

### Moving Averages

\`\`\`python
# Simple Moving Average
df['SMA_20'] = df['close'].rolling(window=20).mean()
df['SMA_50'] = df['close'].rolling(window=50).mean()

# Exponential Moving Average
df['EMA_12'] = df['close'].ewm(span=12, adjust=False).mean()
df['EMA_26'] = df['close'].ewm(span=26, adjust=False).mean()

# MACD
df['MACD'] = df['EMA_12'] - df['EMA_26']
df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
\`\`\`

### RSI (Relative Strength Index)

\`\`\`python
def calculate_rsi(data, period=14):
    """Calculate RSI indicator"""
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

df['RSI'] = calculate_rsi(df['close'])
\`\`\`

### Bollinger Bands

\`\`\`python
# Calculate Bollinger Bands
period = 20
df['BB_Middle'] = df['close'].rolling(window=period).mean()
df['BB_Std'] = df['close'].rolling(window=period).std()
df['BB_Upper'] = df['BB_Middle'] + (df['BB_Std'] * 2)
df['BB_Lower'] = df['BB_Middle'] - (df['BB_Std'] * 2)
\`\`\`

## Advanced DataFrame Operations

### Grouping and Aggregation

\`\`\`python
# Add hour column
df['hour'] = df.index.hour

# Average volume by hour
hourly_volume = df.groupby('hour')['volume'].mean()
print(hourly_volume)

# Multiple aggregations
stats = df.groupby('hour').agg({
    'close': ['mean', 'std', 'min', 'max'],
    'volume': 'sum'
})
\`\`\`

### Shifting Data

\`\`\`python
# Previous close (lag 1)
df['prev_close'] = df['close'].shift(1)

# Next close (lead 1)
df['next_close'] = df['close'].shift(-1)

# Calculate if next candle is green
df['next_green'] = (df['next_close'] > df['close']).astype(int)
\`\`\`

### Rolling Windows

\`\`\`python
# 24-hour high
df['high_24h'] = df['high'].rolling(window=24).max()

# 24-hour low
df['low_24h'] = df['low'].rolling(window=24).min()

# Average volume last 24 hours
df['avg_volume_24h'] = df['volume'].rolling(window=24).mean()

# Custom function on rolling window
def range_pct(x):
    return (x.max() - x.min()) / x.min() * 100

df['volatility_24h'] = df['close'].rolling(window=24).apply(range_pct)
\`\`\`

## Handling Missing Data

\`\`\`python
# Check for missing values
print(df.isnull().sum())

# Fill missing values
df['close'].fillna(method='ffill', inplace=True)  # Forward fill
df['close'].fillna(method='bfill', inplace=True)  # Backward fill
df['close'].fillna(df['close'].mean(), inplace=True)  # Fill with mean

# Drop rows with missing values
df.dropna(inplace=True)

# Drop specific columns
df.drop(['column_name'], axis=1, inplace=True)
\`\`\`

## Performance Optimization

### Using .loc and .iloc

\`\`\`python
# SLOW - Iterating through DataFrame
for i in range(len(df)):
    df.at[i, 'signal'] = df.at[i, 'close'] > df.at[i, 'SMA_20']

# FAST - Vectorized operation
df['signal'] = df['close'] > df['SMA_20']
\`\`\`

### Apply Functions Efficiently

\`\`\`python
# Custom function
def classify_candle(row):
    if row['close'] > row['open']:
        return 'green'
    elif row['close'] < row['open']:
        return 'red'
    else:
        return 'neutral'

# Apply to each row
df['candle_color'] = df.apply(classify_candle, axis=1)
\`\`\`

## Practical Trading Example

Complete script for calculating trading signals:

\`\`\`python
import pandas as pd
import ccxt

# Fetch data
exchange = ccxt.binance()
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', limit=200)
df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
df.set_index('timestamp', inplace=True)

# Calculate indicators
df['SMA_20'] = df['close'].rolling(window=20).mean()
df['SMA_50'] = df['close'].rolling(window=50).mean()
df['RSI'] = calculate_rsi(df['close'])

# Generate signals
df['signal'] = 0
df.loc[(df['SMA_20'] > df['SMA_50']) & (df['RSI'] < 70), 'signal'] = 1  # Buy
df.loc[(df['SMA_20'] < df['SMA_50']) & (df['RSI'] > 30), 'signal'] = -1  # Sell

# Calculate returns if we followed signals
df['strategy_returns'] = df['signal'].shift(1) * df['close'].pct_change()
df['cumulative_returns'] = (1 + df['strategy_returns']).cumprod()

print(f"Total return: {(df['cumulative_returns'].iloc[-1] - 1) * 100:.2f}%")

# Save results
df.to_csv('trading_signals.csv')
\`\`\`

## Key Takeaways

✅ DataFrames are the foundation of algorithmic trading
✅ Use vectorized operations for speed
✅ Set datetime index for time series operations
✅ Master groupby, rolling, and apply
✅ Always handle missing data
✅ Calculate indicators efficiently

## Practice Exercise

Create a script that:
1. Fetches 500 hours of BTC data
2. Calculates SMA(20), SMA(50), RSI
3. Finds all "Golden Cross" signals (SMA20 crosses above SMA50)
4. Calculates returns if you bought at each signal
5. Exports results to CSV

This is the foundation for all algorithmic trading!`
      },
      {
        id: "1-3",
        title: "NumPy for Financial Calculations",
        duration: "20 min",
        type: "video"
      },
      {
        id: "1-4",
        title: "Working with APIs and Market Data",
        duration: "28 min",
        type: "video"
      },
      {
        id: "1-5",
        title: "Module 1 Coding Challenge",
        duration: "15 min",
        type: "quiz"
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: Building Trading Strategies",
    description: "Create and test profitable trading algorithms",
    lessons: [
      {
        id: "2-1",
        title: "Strategy Design Principles",
        duration: "25 min",
        type: "video"
      },
      {
        id: "2-2",
        title: "Moving Average Crossover Strategy",
        duration: "30 min",
        type: "video"
      },
      {
        id: "2-3",
        title: "Mean Reversion Strategies",
        duration: "28 min",
        type: "video"
      },
      {
        id: "2-4",
        title: "Momentum and Trend Following",
        duration: "32 min",
        type: "video"
      },
      {
        id: "2-5",
        title: "Multi-Indicator Strategy Development",
        duration: "35 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Backtesting and Optimization",
    description: "Test strategies against historical data",
    lessons: [
      {
        id: "3-1",
        title: "Introduction to Backtesting",
        duration: "22 min",
        type: "video"
      },
      {
        id: "3-2",
        title: "Backtrader Framework Setup",
        duration: "30 min",
        type: "video"
      },
      {
        id: "3-3",
        title: "Strategy Backtesting Implementation",
        duration: "35 min",
        type: "video"
      },
      {
        id: "3-4",
        title: "Performance Metrics and Analysis",
        duration: "28 min",
        type: "video"
      },
      {
        id: "3-5",
        title: "Parameter Optimization Techniques",
        duration: "32 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: Risk Management Systems",
    description: "Protect capital with automated risk controls",
    lessons: [
      {
        id: "4-1",
        title: "Position Sizing Algorithms",
        duration: "25 min",
        type: "video"
      },
      {
        id: "4-2",
        title: "Stop Loss and Take Profit Automation",
        duration: "28 min",
        type: "video"
      },
      {
        id: "4-3",
        title: "Portfolio Risk Management",
        duration: "30 min",
        type: "video"
      },
      {
        id: "4-4",
        title: "Maximum Drawdown Controls",
        duration: "22 min",
        type: "video"
      },
      {
        id: "4-5",
        title: "Advanced Risk Metrics",
        duration: "26 min",
        type: "video"
      }
    ]
  },
  {
    id: "module-5",
    title: "Module 5: Live Trading Bot Development",
    description: "Deploy automated trading bots safely",
    lessons: [
      {
        id: "5-1",
        title: "Exchange API Integration",
        duration: "35 min",
        type: "video"
      },
      {
        id: "5-2",
        title: "Order Execution Systems",
        duration: "32 min",
        type: "video"
      },
      {
        id: "5-3",
        title: "Real-Time Data Processing",
        duration: "30 min",
        type: "video"
      },
      {
        id: "5-4",
        title: "Error Handling and Logging",
        duration: "28 min",
        type: "video"
      },
      {
        id: "5-5",
        title: "Building Your First Trading Bot",
        duration: "45 min",
        type: "video"
      }
    ]
  }
];
