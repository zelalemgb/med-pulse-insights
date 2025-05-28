
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FacilitiesList } from './FacilitiesList';
import { PendingAssociations } from './PendingAssociations';
import { UserProfileManagement } from './UserProfileManagement';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { FacilityAssociationRequest } from './FacilityAssociationRequest';
import { Building, Users, Clock, UserPlus, Shield, User } from 'lucide-react';

export const FacilityManagement = () => {
  const { profile } = useAuth();

  const canApproveAssociations = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.is_facility_owner ||
    (profile as any)?.can_approve_associations;

  const isSuperAdmin = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facility Management</h2>
      </div>

      <Tabs defaultValue={isSuperAdmin ? "admin" : "facilities"} className="w-full">
        <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : canApproveAssociations ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {isSuperAdmin && (
            <TabsTrigger value="admin" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </TabsTrigger>
          )}
          <TabsTrigger value="facilities" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          {canApproveAssociations && (
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending Requests
            </TabsTrigger>
          )}
          <TabsTrigger value="request" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Request Access
          </TabsTrigger>
        </TabsList>

        {isSuperAdmin && (
          <TabsContent value="admin">
            <SuperAdminDashboard />
          </TabsContent>
        )}

        <TabsContent value="facilities">
          <FacilitiesList />
        </TabsContent>

        <TabsContent value="profile">
          <UserProfileManagement />
        </TabsContent>

        {canApproveAssociations && (
          <TabsContent value="pending">
            <PendingAssociations />
          </TabsContent>
        )}

        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle>Request Facility Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Use the form below to request access to a specific facility. 
                  You'll need the facility ID which can be obtained from the facility owner.
                </p>
                <FacilityAssociationRequest />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
