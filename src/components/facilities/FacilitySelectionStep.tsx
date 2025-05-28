
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { CreateFacilityDialog } from './CreateFacilityDialog';
import { Loader2, Building, MapPin, Plus, Check } from 'lucide-react';

interface FacilitySelectionStepProps {
  onFacilitySelected: (facilityId: string | null) => void;
  selectedFacilityId?: string | null;
}

export const FacilitySelectionStep = ({ 
  onFacilitySelected, 
  selectedFacilityId 
}: FacilitySelectionStepProps) => {
  const { data: facilities, isLoading, error } = useHealthFacilities();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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
            Error loading facilities. You can still proceed without selecting a facility.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => onFacilitySelected(null)}>
              Continue Without Facility
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Select Your Facility</h3>
        <p className="text-gray-600">
          Choose your primary facility or create a new one
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {facilities?.map((facility) => (
          <Card 
            key={facility.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedFacilityId === facility.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : ''
            }`}
            onClick={() => onFacilitySelected(facility.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{facility.name}</CardTitle>
                {selectedFacilityId === facility.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
              {facility.code && (
                <p className="text-sm text-gray-600">Code: {facility.code}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{facility.facility_type} - {facility.level}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{facility.region}, {facility.zone}</span>
                </div>

                <Badge 
                  variant={facility.operational_status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {facility.operational_status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col space-y-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setShowCreateDialog(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Facility
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onFacilitySelected(null)}
          className="w-full"
        >
          Continue Without Facility
        </Button>
      </div>

      <CreateFacilityDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={(facility) => {
          setShowCreateDialog(false);
          onFacilitySelected(facility.id);
        }}
      />
    </div>
  );
};
