
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AggregationData } from '@/types/multiLevelAggregation';

interface ComparisonViewProps {
  data: AggregationData[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ data }) => {
  const getPerformanceBadge = (rate: number, type: 'stockOut' | 'wastage') => {
    const threshold = type === 'stockOut' ? 15 : 10;
    const variant = rate > threshold ? 'destructive' : rate > threshold * 0.7 ? 'default' : 'secondary';
    return <Badge variant={variant}>{rate.toFixed(1)}%</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.totalConsumption.toLocaleString()} units • {item.totalProducts} products
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Stock Outs</p>
                  {getPerformanceBadge(item.stockOutRate, 'stockOut')}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Wastage</p>
                  {getPerformanceBadge(item.wastageRate, 'wastage')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonView;
