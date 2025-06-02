
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { FacilityRegistrationDialog } from '@/components/facilities/registration/FacilityRegistrationDialog';
import { HealthFacility } from '@/types/healthFacilities';

const FacilitiesDataTable = () => {
  const { userRole, canAccess } = usePermissions();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  // Mock facilities data based on user role
  const getFacilitiesData = () => {
    const baseData = [
      {
        id: '1',
        name: 'Central Medical Store',
        type: 'Central Store',
        location: 'Kampala',
        status: 'Active',
        lastUpdate: '2024-01-15',
        products: 450,
        staff: 25
      },
      {
        id: '2', 
        name: 'Regional Hospital Pharmacy',
        type: 'Hospital',
        location: 'Mbarara',
        status: 'Active',
        lastUpdate: '2024-01-14',
        products: 320,
        staff: 12
      },
      {
        id: '3',
        name: 'District Health Center',
        type: 'Health Center',
        location: 'Gulu',
        status: 'Pending Review',
        lastUpdate: '2024-01-13',
        products: 180,
        staff: 8
      }
    ];

    if (userRole === 'facility_manager' || userRole === 'facility_officer') {
      return [baseData[0]]; // Only show their facility
    }

    return baseData;
  };

  const facilities = getFacilitiesData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFacilityCreated = (facility: HealthFacility) => {
    console.log('New facility created:', facility);
    // In a real app, this would update the facilities list
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facilities Overview
            </CardTitle>
            <CardDescription>
              Manage facilities under your jurisdiction
            </CardDescription>
          </div>
          {canAccess.manageFacilities && (
            <Button 
              onClick={() => setShowRegistrationDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facilities.map((facility) => (
            <div key={facility.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{facility.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {facility.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {facility.location}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(facility.status)}>
                  {facility.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Products:</span>
                  <span className="font-medium ml-2">{facility.products}</span>
                </div>
                <div>
                  <span className="text-gray-500">Staff:</span>
                  <span className="font-medium ml-2">{facility.staff}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Update:</span>
                  <span className="font-medium ml-2">{new Date(facility.lastUpdate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {facilities.length === 0 && (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first facility</p>
            {canAccess.manageFacilities && (
              <Button onClick={() => setShowRegistrationDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <FacilityRegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        onSuccess={handleFacilityCreated}
      />
    </Card>
  );
};

export default FacilitiesDataTable;
