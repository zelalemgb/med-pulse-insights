
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { CreateFacilityDialog } from './CreateFacilityDialog';
import { FacilityAssociationRequest } from './FacilityAssociationRequest';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, MapPin, Users, Building, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HealthFacility } from '@/types/healthFacilities';

export const FacilitiesList = () => {
  const { data: facilities, isLoading, error, refetch } = useHealthFacilities();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const copyFacilityId = (facilityId: string) => {
    navigator.clipboard.writeText(facilityId);
    toast({
      title: 'Copied!',
      description: 'Facility ID copied to clipboard',
    });
  };

  const handleFacilityCreated = (facility: HealthFacility) => {
    setCreateDialogOpen(false);
    toast({
      title: 'Success!',
      description: `Facility "${facility.name}" has been created successfully.`,
    });
    refetch(); // Refresh the facilities list
  };

  const canManageFacilities = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal';

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
        <h3 className="text-lg font-semibold">Health Facilities</h3>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Facility
        </Button>
      </div>

      {!facilities || facilities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">No facilities found</h4>
              <p className="text-gray-600 mb-4">
                You don't have access to any health facilities yet.
              </p>
              <div className="flex justify-center space-x-2">
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Facility
                </Button>
              </div>
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
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate mr-2">ID: {facility.id.slice(0, 8)}...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyFacilityId(facility.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
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
                
                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {canManageFacilities ? (
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  ) : (
                    <FacilityAssociationRequest 
                      facilityId={facility.id} 
                      facilityName={facility.name} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateFacilityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleFacilityCreated}
      />
    </div>
  );
};
