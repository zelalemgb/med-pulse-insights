
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface FacilityMetrics {
  orderFulfillmentRate: number;
  averageLeadTime: number;
  wastePercentage: number;
}

interface SupplyChainPerformanceCardProps {
  facilityMetrics: FacilityMetrics;
}

const SupplyChainPerformanceCard = ({ facilityMetrics }: SupplyChainPerformanceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Supply Chain Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Order Fulfillment Rate</span>
          <span className="text-lg font-bold text-green-600">{facilityMetrics.orderFulfillmentRate}%</span>
        </div>
        <Progress value={facilityMetrics.orderFulfillmentRate} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Average Lead Time</span>
          <span className="text-lg font-bold">{facilityMetrics.averageLeadTime} days</span>
        </div>
        <Progress value={(30 - facilityMetrics.averageLeadTime) / 30 * 100} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Waste Percentage</span>
          <span className="text-lg font-bold text-red-600">{facilityMetrics.wastePercentage}%</span>
        </div>
        <Progress value={facilityMetrics.wastePercentage} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default SupplyChainPerformanceCard;
