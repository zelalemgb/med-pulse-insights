
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { HealthFacility } from '@/types/healthFacilities';
import { FacilityAnalytics } from '@/utils/facilityDataIntegration';

interface FacilityHeaderProps {
  facility: HealthFacility;
  analytics?: FacilityAnalytics;
}

export const FacilityHeader = ({ facility, analytics }: FacilityHeaderProps) => {
  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {facility.name}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {facility.facility_type} • {facility.level} • {facility.region}, {facility.zone}
            </p>
          </div>
          <div className="text-right">
            {analytics && getPerformanceBadge(analytics.performanceScore)}
            <p className="text-sm text-gray-600 mt-1">
              Performance Score: {analytics?.performanceScore.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
