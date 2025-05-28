
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { CreateFacilityDialog } from './CreateFacilityDialog';
import { Loader2, MapPin, Users, Building } from 'lucide-react';

export const FacilitiesList = () => {
  const { data: facilities, isLoading, error } = useHealthFacilities();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-600">
            Error loading facilities. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Facilities</h2>
        <CreateFacilityDialog />
      </div>

      {!facilities || facilities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No facilities found</h3>
              <p className="text-gray-600 mb-4">
                You don't have access to any health facilities yet.
              </p>
              <CreateFacilityDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <Badge 
                    variant={facility.operational_status === 'active' ? 'default' : 'secondary'}
                  >
                    {facility.operational_status}
                  </Badge>
                </div>
                {facility.code && (
                  <p className="text-sm text-gray-600">Code: {facility.code}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{facility.facility_type} - {facility.level}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{facility.region}, {facility.zone}</span>
                    {facility.wereda && <span>, {facility.wereda}</span>}
                  </div>
                  
                  {facility.capacity && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Capacity: {facility.capacity}</span>
                      {facility.staff_count && <span> | Staff: {facility.staff_count}</span>}
                    </div>
                  )}

                  {facility.services_offered && facility.services_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {facility.services_offered.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {facility.services_offered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.services_offered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
