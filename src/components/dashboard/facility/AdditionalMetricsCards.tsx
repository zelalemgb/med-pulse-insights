
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface FacilityMetrics {
  stockOutRate: number;
  lowStockProducts: number;
  totalProducts: number;
  forecastAccuracy: number;
}

interface AdditionalMetricsCardsProps {
  facilityMetrics: FacilityMetrics;
}

const AdditionalMetricsCards = ({ facilityMetrics }: AdditionalMetricsCardsProps) => {
  const stockHealthScore = 100 - facilityMetrics.stockOutRate - (facilityMetrics.lowStockProducts / facilityMetrics.totalProducts * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Forecast Accuracy */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{facilityMetrics.forecastAccuracy}%</div>
          <p className="text-xs text-muted-foreground">Demand prediction accuracy</p>
          <Progress value={facilityMetrics.forecastAccuracy} className="mt-2" />
        </CardContent>
      </Card>

      {/* Stock Health Score */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Health Score</CardTitle>
          <BarChart3 className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{stockHealthScore.toFixed(0)}/100</div>
          <p className="text-xs text-muted-foreground">Overall supply performance</p>
          <Progress value={stockHealthScore} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalMetricsCards;
