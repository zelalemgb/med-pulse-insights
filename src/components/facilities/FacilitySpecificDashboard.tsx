
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { FacilityDataIntegration } from '@/utils/facilityDataIntegration';
import { useQuery } from '@tanstack/react-query';
import { FacilityHeader } from './dashboard/FacilityHeader';
import { FacilityKeyMetrics } from './dashboard/FacilityKeyMetrics';
import { FacilityInformation } from './dashboard/FacilityInformation';
import { FacilityServices } from './dashboard/FacilityServices';

interface FacilitySpecificDashboardProps {
  facilityId: string;
}

export const FacilitySpecificDashboard = ({ facilityId }: FacilitySpecificDashboardProps) => {
  const { data: facilities } = useHealthFacilities();
  const facility = facilities?.find(f => f.id === facilityId);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['facility-analytics', facilityId],
    queryFn: () => facility ? FacilityDataIntegration.getFacilityAnalytics(facilityId, facility) : null,
    enabled: !!facility,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!facility) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Facility not found</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading facility analytics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <FacilityHeader facility={facility} analytics={analytics} />
      <FacilityKeyMetrics analytics={analytics} />
      <FacilityInformation facility={facility} analytics={analytics} />
      <FacilityServices facility={facility} />
    </div>
  );
};
