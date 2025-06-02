
import React, { useState } from 'react';
import { FacilityRegistrationDialog } from '@/components/facilities/registration/FacilityRegistrationDialog';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building, Users, UserPlus, Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { HealthFacility } from '@/types/healthFacilities';
import { FacilitiesList } from '@/components/facilities/FacilitiesList';
import { PendingAssociations } from '@/components/facilities/PendingAssociations';
import { FacilityAssociationRequest } from '@/components/facilities/FacilityAssociationRequest';
import { SuperAdminDashboard } from '@/components/facilities/SuperAdminDashboard';

const Facilities = () => {
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [activeView, setActiveView] = useState<'facilities' | 'pending' | 'request' | 'admin'>('facilities');
  const { canAccess } = usePermissions();
  const { profile } = useAuth();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Facilities' }
  ];

  const handleFacilityCreated = (facility: HealthFacility) => {
    console.log('New facility created:', facility);
    setShowRegistrationDialog(false);
    setActiveView('facilities'); // Return to facilities view
  };

  const canApproveAssociations = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.is_facility_owner ||
    (profile as any)?.can_approve_associations;

  const isSuperAdmin = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal';

  const renderContent = () => {
    switch (activeView) {
      case 'admin':
        return <SuperAdminDashboard />;
      case 'pending':
        return <PendingAssociations />;
      case 'request':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Request Facility Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Request access to a specific facility. You'll need the facility ID 
                  which can be obtained from the facility owner or administrator.
                </p>
                <FacilityAssociationRequest />
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <FacilitiesList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Facility Management"
          description="Manage health facilities and access permissions"
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
        
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${activeView === 'facilities' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveView('facilities')}
          >
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-sm">My Facilities</h3>
              <p className="text-xs text-gray-600 mt-1">View and manage facilities</p>
            </CardContent>
          </Card>

          {canApproveAssociations && (
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${activeView === 'pending' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setActiveView('pending')}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold text-sm">Pending Requests</h3>
                <p className="text-xs text-gray-600 mt-1">Approve access requests</p>
              </CardContent>
            </Card>
          )}

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${activeView === 'request' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveView('request')}
          >
            <CardContent className="p-4 text-center">
              <UserPlus className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold text-sm">Request Access</h3>
              <p className="text-xs text-gray-600 mt-1">Join a facility</p>
            </CardContent>
          </Card>

          {isSuperAdmin && (
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${activeView === 'admin' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setActiveView('admin')}
            >
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-sm">Admin Dashboard</h3>
                <p className="text-xs text-gray-600 mt-1">System administration</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          {renderContent()}
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
