
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthFacility } from '@/types/healthFacilities';

interface FacilityServicesProps {
  facility: HealthFacility;
}

export const FacilityServices = ({ facility }: FacilityServicesProps) => {
  if (!facility.services_offered || facility.services_offered.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Offered</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {facility.services_offered.map((service, index) => (
            <Badge key={index} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
