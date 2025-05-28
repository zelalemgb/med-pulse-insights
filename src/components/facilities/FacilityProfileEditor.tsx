
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { EditFacilityDialog } from './EditFacilityDialog';
import { Loader2, Building, MapPin, Users, Edit, Eye } from 'lucide-react';

export const FacilityProfileEditor = () => {
  const { data: facilities, isLoading, error } = useHealthFacilities();
  const [editingFacility, setEditingFacility] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Facility Profile Management</h3>
      
      {!facilities || facilities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">No facilities to manage</h4>
              <p className="text-gray-600">
                You don't have any facilities that you can edit.
              </p>
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
                      {facility.services_offered.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {facility.services_offered.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.services_offered.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingFacility(facility)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingFacility && (
        <EditFacilityDialog 
          facility={editingFacility}
          isOpen={true}
          onClose={() => setEditingFacility(null)}
        />
      )}
    </div>
  );
};
