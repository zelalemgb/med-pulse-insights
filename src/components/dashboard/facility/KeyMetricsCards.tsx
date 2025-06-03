
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface FacilityMetrics {
  totalProducts: number;
  availableProducts: number;
  stockOutProducts: number;
  lowStockProducts: number;
  criticalProducts: number;
  stockOutRate: number;
  avgDaysOfStock: number;
  reportingRate: number;
}

interface KeyMetricsCardsProps {
  facilityMetrics: FacilityMetrics;
}

const KeyMetricsCards = ({ facilityMetrics }: KeyMetricsCardsProps) => {
  const availabilityRate = ((facilityMetrics.availableProducts / facilityMetrics.totalProducts) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* First Card: Facilities Reporting */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facilities Reporting</CardTitle>
          <Database className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{facilityMetrics.reportingRate}%</div>
          <p className="text-xs text-muted-foreground">Reporting rate this month</p>
          <Progress value={facilityMetrics.reportingRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* Second Card: Data Completeness - Stock Availability */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Availability</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{availabilityRate}%</div>
          <p className="text-xs text-muted-foreground">{facilityMetrics.availableProducts} of {facilityMetrics.totalProducts} products</p>
          <Progress value={parseFloat(availabilityRate)} className="mt-2" />
        </CardContent>
      </Card>

      {/* Third Card: Stock Out Rate */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Out Rate</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{facilityMetrics.stockOutRate}%</div>
          <p className="text-xs text-muted-foreground">Critical: {facilityMetrics.criticalProducts} products</p>
          <Badge variant="destructive" className="mt-2">Monitor Closely</Badge>
        </CardContent>
      </Card>

      {/* Fourth Card: Avg Days of Stock */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Days of Stock</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{facilityMetrics.avgDaysOfStock}</div>
          <p className="text-xs text-muted-foreground">Days until reorder needed</p>
          <Progress value={(facilityMetrics.avgDaysOfStock / 90) * 100} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsCards;
