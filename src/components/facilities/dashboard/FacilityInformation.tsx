
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthFacility } from '@/types/healthFacilities';
import { FacilityAnalytics } from '@/utils/facilityDataIntegration';

interface FacilityInformationProps {
  facility: HealthFacility;
  analytics?: FacilityAnalytics;
}

export const FacilityInformation = ({ facility, analytics }: FacilityInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Facility Code</p>
            <p className="text-gray-600">{facility.code || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Operational Status</p>
            <Badge variant={facility.operational_status === 'active' ? 'default' : 'secondary'}>
              {facility.operational_status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Capacity</p>
            <p className="text-gray-600">{facility.capacity || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Staff Count</p>
            <p className="text-gray-600">{facility.staff_count || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Catchment Area</p>
            <p className="text-gray-600">{facility.catchment_area || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-gray-600">
              {analytics?.lastUpdated.toLocaleDateString() || 'Never'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
