
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface FacilityMetrics {
  criticalProducts: number;
  lowStockProducts: number;
}

interface CriticalActionsCardProps {
  facilityMetrics: FacilityMetrics;
}

const CriticalActionsCard = ({ facilityMetrics }: CriticalActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Critical Actions Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-red-800">Immediate Stock Outs</h4>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <p className="text-sm text-red-600">{facilityMetrics.criticalProducts} essential medications out of stock</p>
            <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
              Emergency Order
            </Button>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-amber-800">Reorder Alerts</h4>
              <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
            </div>
            <p className="text-sm text-amber-600">{facilityMetrics.lowStockProducts} products below reorder point</p>
            <Button size="sm" variant="outline" className="mt-2">
              Plan Orders
            </Button>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800">Monthly Report Due</h4>
              <Badge className="bg-blue-100 text-blue-800">Info</Badge>
            </div>
            <p className="text-sm text-blue-600">Submit consumption report by month end</p>
            <Button size="sm" variant="outline" className="mt-2">
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalActionsCard;
