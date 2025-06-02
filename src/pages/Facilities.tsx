
import React, { useState } from 'react';
import { FacilityManagement } from '@/components/facilities/FacilityManagement';
import { FacilityRegistrationDialog } from '@/components/facilities/registration/FacilityRegistrationDialog';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { HealthFacility } from '@/types/healthFacilities';

const Facilities = () => {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const { canAccess } = usePermissions();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Facilities' }
  ];

  const handleFacilityCreated = (facility: HealthFacility) => {
    console.log('New facility created:', facility);
    setShowRegistrationDialog(false);
    // In a real app, this would refresh the facilities list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Facility Management"
          description="Manage health facilities, associations, and role assignments across your organization"
          breadcrumbItems={breadcrumbItems}
          action={
            canAccess.manageFacilities ? (
              <Button 
                onClick={() => setShowRegistrationDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register New Facility
              </Button>
            ) : undefined
          }
        />
        
        <div className="mt-8">
          <FacilityManagement />
        </div>

        <FacilityRegistrationDialog
          open={showRegistrationDialog}
          onOpenChange={setShowRegistrationDialog}
          onSuccess={handleFacilityCreated}
        />
      </div>
    </div>
  );
};

export default Facilities;
