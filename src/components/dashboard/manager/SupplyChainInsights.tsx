
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface SupplyChainInsightsProps {
  userRole: string;
}

const SupplyChainInsights = ({ userRole }: SupplyChainInsightsProps) => {
  const getTopPerformingAreas = () => {
    switch (userRole) {
      case 'national':
        return 'Tigray and SNNP regions';
      case 'regional':
        return 'East Shewa and Arsi zones';
      case 'zonal':
        return 'Asela and Bekoji districts';
      default:
        return 'Pediatric and Emergency departments';
    }
  };

  const getAreasNeedingSupport = () => {
    switch (userRole) {
      case 'national':
        return 'Afar and Gambela regions';
      case 'regional':
        return 'West Hararghe zone';
      case 'zonal':
        return 'Dodola district';
      default:
        return 'Surgical department';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Supply Chain Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Top Performing Areas</h4>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm text-green-700">
            {getTopPerformingAreas()} showing excellent availability rates
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-amber-800">Areas Needing Support</h4>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-700">
            {getAreasNeedingSupport()} require additional resource allocation
          </p>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Efficiency Opportunity</h4>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700">
            Implementing demand forecasting could reduce waste by 15% and improve availability
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyChainInsights;
