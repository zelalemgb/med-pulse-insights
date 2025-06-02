
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building, Package, AlertCircle, DollarSign } from 'lucide-react';

interface KPICardsProps {
  facilityPerformance: string;
  activeFacilities: number;
  totalFacilities: number;
  avgAvailabilityRate: number;
  criticalStockOuts: number;
  budgetUtilization: string;
  budgetUtilized: number;
}

const KPICards = ({
  facilityPerformance,
  activeFacilities,
  totalFacilities,
  avgAvailabilityRate,
  criticalStockOuts,
  budgetUtilization,
  budgetUtilized
}: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Facility Performance</CardTitle>
          <Building className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{facilityPerformance}%</div>
          <p className="text-xs text-muted-foreground">{activeFacilities} of {totalFacilities} active</p>
          <Progress value={parseFloat(facilityPerformance)} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Availability Rate</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{avgAvailabilityRate}%</div>
          <p className="text-xs text-muted-foreground">Average across all facilities</p>
          <Progress value={avgAvailabilityRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Stock Outs</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{criticalStockOuts}</div>
          <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          {criticalStockOuts > 0 && (
            <Badge variant="destructive" className="mt-2">Action Required</Badge>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{budgetUtilization}%</div>
          <p className="text-xs text-muted-foreground">${budgetUtilized.toLocaleString()} used</p>
          <Progress value={parseFloat(budgetUtilization)} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
