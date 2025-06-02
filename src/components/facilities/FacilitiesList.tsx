
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { CreateFacilityDialog } from './CreateFacilityDialog';
import { FacilityAssociationRequest } from './FacilityAssociationRequest';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, MapPin, Users, Building, Copy, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HealthFacility } from '@/types/healthFacilities';

export const FacilitiesList = () => {
  const { data: facilities, isLoading, error, refetch } = useHealthFacilities();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    refetch();
  };

  const canManageFacilities = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal';

  const filteredFacilities = facilities?.filter(facility =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.facility_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <CardContent className="pt-6">
        <p className="text-center text-red-600">
          Error loading facilities. Please try again.
        </p>
      </CardContent>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Health Facilities</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Facility
          </Button>
        </div>
      </div>

      {filteredFacilities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-semibold mb-2 text-gray-900">
                {searchTerm ? 'No facilities found' : 'No facilities yet'}
              </h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No facilities match "${searchTerm}". Try adjusting your search terms.`
                  : 'You don\'t have access to any health facilities yet. Create your first facility or request access to an existing one.'
                }
              </p>
              {!searchTerm && (
                <div className="flex justify-center space-x-3">
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Facility
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate" title={facility.name}>
                      {facility.name}
                    </CardTitle>
                    {facility.code && (
                      <p className="text-sm text-gray-600 mt-1">Code: {facility.code}</p>
                    )}
                  </div>
                  <Badge 
                    variant={facility.operational_status === 'active' ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {facility.operational_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate">ID: {facility.id.slice(0, 8)}...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => copyFacilityId(facility.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{facility.facility_type} - {facility.level}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">
                      {facility.region}, {facility.zone}
                      {facility.wereda && `, ${facility.wereda}`}
                    </span>
                  </div>
                  
                  {(facility.capacity || facility.staff_count) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">
                        {facility.capacity && `Capacity: ${facility.capacity}`}
                        {facility.capacity && facility.staff_count && ' | '}
                        {facility.staff_count && `Staff: ${facility.staff_count}`}
                      </span>
                    </div>
                  )}

                  {facility.services_offered && facility.services_offered.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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
                
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {canManageFacilities ? (
                    <Button variant="outline" size="sm" className="shrink-0">
                      Manage
                    </Button>
                  ) : (
                    <div className="shrink-0">
                      <FacilityAssociationRequest 
                        facilityId={facility.id} 
                        facilityName={facility.name} 
                      />
                    </div>
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
