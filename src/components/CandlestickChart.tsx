import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartDataPoint } from "@/types/trading";
import { format } from "date-fns";

interface CandlestickChartProps {
  data: ChartDataPoint[];
  symbol: string;
  height?: number;
}

const CandlestickChart = ({ data, symbol, height = 300 }: CandlestickChartProps) => {
  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MM/dd HH:mm');
  };

  // Prepare candlestick data
  const candleData = data.map(item => ({
    ...item,
    candleBody: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
    upperWick: [Math.max(item.open, item.close), item.high],
    lowerWick: [item.low, Math.min(item.open, item.close)],
    isBullish: item.close >= item.open
  }));

  const CustomCandlestick = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    const { x, width } = props;
    const candleWidth = Math.max(width * 0.6, 2);
    const wickWidth = 1;
    
    const yScale = props.yScale;
    if (!yScale) return null;

    const bodyTop = yScale(payload.candleBody[1]);
    const bodyBottom = yScale(payload.candleBody[0]);
    const bodyHeight = Math.abs(bodyBottom - bodyTop);
    
    const wickTop = yScale(payload.upperWick[1]);
    const wickBottom = yScale(payload.lowerWick[0]);

    const color = payload.isBullish ? 'hsl(var(--signal-long))' : 'hsl(var(--signal-short))';
    const fillColor = payload.isBullish ? 'transparent' : 'hsl(var(--signal-short))';

    return (
      <g>
        {/* Upper Wick */}
        <line
          x1={x + candleWidth / 2}
          y1={wickTop}
          x2={x + candleWidth / 2}
          y2={bodyTop}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Lower Wick */}
        <line
          x1={x + candleWidth / 2}
          y1={bodyBottom}
          x2={x + candleWidth / 2}
          y2={wickBottom}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Body */}
        <rect
          x={x + (width - candleWidth) / 2}
          y={Math.min(bodyTop, bodyBottom)}
          width={candleWidth}
          height={Math.max(bodyHeight, 1)}
          fill={fillColor}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const priceChange = data.close - data.open;
      const priceChangePercent = ((priceChange / data.open) * 100);
      
      return (
        <div className="glass-card p-4 border border-border/50">
          <p className="font-semibold text-foreground mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">
                  <span className="font-medium">Open:</span> {formatPrice(data.open)}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">High:</span> {formatPrice(data.high)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  <span className="font-medium">Low:</span> {formatPrice(data.low)}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Close:</span> {formatPrice(data.close)}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/30">
              <p className={`font-medium ${priceChange >= 0 ? 'text-signal-long' : 'text-signal-short'}`}>
                Change: {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)} 
                ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </p>
            </div>
            {data.volume && (
              <p className="text-muted-foreground">
                <span className="font-medium">Volume:</span> {data.volume.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-1">
          {symbol} • Candlestick Chart
        </h3>
        <p className="text-sm text-muted-foreground">
          OHLC price action with volume analysis
        </p>
      </div>
      
      <div className="glass-card p-4 rounded-xl">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={candleData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={formatPrice}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Volume bars at bottom */}
            {candleData[0]?.volume && (
              <Bar 
                dataKey="volume" 
                yAxisId="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
              />
            )}
            
            {/* Render custom candlesticks */}
            {candleData.map((entry, index) => (
              <CustomCandlestick 
                key={index} 
                payload={entry}
                x={index * (100 / candleData.length)}
                width={100 / candleData.length}
                yScale={(value: number) => height - ((value - Math.min(...candleData.map(d => d.low))) / 
                  (Math.max(...candleData.map(d => d.high)) - Math.min(...candleData.map(d => d.low)))) * height}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;