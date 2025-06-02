
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { FacilityAnalytics } from '@/utils/facilityDataIntegration';

interface FacilityKeyMetricsProps {
  analytics?: FacilityAnalytics;
}

export const FacilityKeyMetrics = ({ analytics }: FacilityKeyMetricsProps) => {
  const getStatusIcon = (rate: number, threshold: number) => {
    if (rate <= threshold) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (rate <= threshold * 1.5) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalProducts || 0}</div>
          <p className="text-xs text-muted-foreground">
            Active pharmaceutical products
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Consumption</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.totalConsumption.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Total units consumed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Out Rate</CardTitle>
          {analytics && getStatusIcon(analytics.stockOutRate, 10)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.stockOutRate.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Products experiencing stock outs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wastage Rate</CardTitle>
          {analytics && getStatusIcon(analytics.wastageRate, 5)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.wastageRate.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Average wastage across products
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
