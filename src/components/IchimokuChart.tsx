import React from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartDataPoint } from "@/types/trading";
import { format } from "date-fns";

interface IchimokuChartProps {
  data: ChartDataPoint[];
  symbol: string;
  height?: number;
}

const IchimokuChart = ({ data, symbol, height = 400 }: IchimokuChartProps) => {
  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MM/dd HH:mm');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 border border-border/50">
          <p className="font-semibold text-foreground mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">O:</span> {formatPrice(data.open)}
              <span className="ml-4 font-medium">H:</span> {formatPrice(data.high)}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">L:</span> {formatPrice(data.low)}
              <span className="ml-4 font-medium">C:</span> {formatPrice(data.close)}
            </p>
            {data.tenkan && (
              <p className="text-blue-400">
                <span className="font-medium">Tenkan:</span> {formatPrice(data.tenkan)}
              </p>
            )}
            {data.kijun && (
              <p className="text-red-400">
                <span className="font-medium">Kijun:</span> {formatPrice(data.kijun)}
              </p>
            )}
            {data.senkouA && (
              <p className="text-green-400">
                <span className="font-medium">Senkou A:</span> {formatPrice(data.senkouA)}
              </p>
            )}
            {data.senkouB && (
              <p className="text-orange-400">
                <span className="font-medium">Senkou B:</span> {formatPrice(data.senkouB)}
              </p>
            )}
            {data.rsi && (
              <p className="text-purple-400">
                <span className="font-medium">RSI:</span> {data.rsi.toFixed(1)}
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
          {symbol} • Ichimoku Cloud Analysis
        </h3>
        <p className="text-sm text-muted-foreground">
          Interactive chart with Ichimoku indicators and price action
        </p>
      </div>
      
      <div className="glass-card p-4 rounded-xl">
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={data}
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
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={formatPrice}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Ichimoku Cloud - Senkou Spans */}
            <Area
              type="monotone"
              dataKey="senkouA"
              stackId="cloud"
              stroke="hsl(var(--success))"
              fill="hsl(var(--success) / 0.2)"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="senkouB"
              stackId="cloud"
              stroke="hsl(var(--warning))"
              fill="hsl(var(--warning) / 0.2)"
              strokeWidth={1}
            />
            
            {/* Price Line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            
            {/* Tenkan-sen (Fast line) */}
            <Line
              type="monotone"
              dataKey="tenkan"
              stroke="hsl(217 91% 60%)"
              strokeWidth={1.5}
              dot={false}
              name="Tenkan-sen (9)"
              strokeDasharray="5 5"
            />
            
            {/* Kijun-sen (Slow line) */}
            <Line
              type="monotone"
              dataKey="kijun"
              stroke="hsl(0 84% 60%)"
              strokeWidth={1.5}
              dot={false}
              name="Kijun-sen (26)"
              strokeDasharray="10 5"
            />
            
            {/* Chikou Span */}
            <Line
              type="monotone"
              dataKey="chikou"
              stroke="hsl(var(--accent))"
              strokeWidth={1}
              dot={false}
              name="Chikou Span"
              strokeDasharray="2 2"
            />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))'
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IchimokuChart;