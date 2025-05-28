
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PerformanceMetrics } from '@/types/multiLevelAggregation';

interface PerformanceOverviewProps {
  metrics: PerformanceMetrics;
  selectedLevel: string;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ metrics, selectedLevel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalConsumption.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Units across {selectedLevel} level</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Stock Out Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            {metrics.avgStockOutRate.toFixed(1)}%
            {metrics.avgStockOutRate > 15 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <p className="text-xs text-muted-foreground">Across all {selectedLevel}s</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Wastage Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            {metrics.avgWastageRate.toFixed(1)}%
            {metrics.avgWastageRate > 10 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
          </div>
          <p className="text-xs text-muted-foreground">Optimization opportunity</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalRegions}</div>
          <p className="text-xs text-muted-foreground">{selectedLevel}s monitored</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverview;
