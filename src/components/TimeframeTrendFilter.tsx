import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TimeframeTrendFilterProps {
  onFilterChange: (trend: 'bullish' | 'bearish' | 'both') => void;
  currentFilter: 'bullish' | 'bearish' | 'both';
}

const TimeframeTrendFilter = ({ onFilterChange, currentFilter }: TimeframeTrendFilterProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4 text-primary" />
          Higher Timeframe Trend Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentFilter}
          onValueChange={(value) => onFilterChange(value as 'bullish' | 'bearish' | 'both')}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer">
              <Minus className="h-4 w-4 text-muted-foreground" />
              <span>Show All Signals</span>
              <Badge variant="outline" className="ml-auto">
                No Filter
              </Badge>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bullish" id="bullish" />
            <Label htmlFor="bullish" className="flex items-center gap-2 cursor-pointer">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Bullish Trend Only</span>
              <Badge className="ml-auto bg-green-600">
                Long Signals
              </Badge>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bearish" id="bearish" />
            <Label htmlFor="bearish" className="flex items-center gap-2 cursor-pointer">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Bearish Trend Only</span>
              <Badge variant="destructive" className="ml-auto">
                Short Signals
              </Badge>
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
          <p>💡 Tip: Trading with the higher timeframe trend increases win probability</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeframeTrendFilter;
