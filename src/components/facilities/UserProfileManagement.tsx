
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { UserAssociations } from './UserAssociations';
import { FacilityAssociationRequest } from './FacilityAssociationRequest';
import { FacilityProfileEditor } from './FacilityProfileEditor';
import { User, Building, UserPlus, Edit } from 'lucide-react';

export const UserProfileManagement = () => {
  const { profile } = useAuth();

  const canEditFacilities = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.is_facility_owner;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Management</h2>
      </div>

      <Tabs defaultValue="associations" className="w-full">
        <TabsList className={`grid w-full ${canEditFacilities ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="associations" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            My Associations
          </TabsTrigger>
          <TabsTrigger value="request" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Request Access
          </TabsTrigger>
          {canEditFacilities && (
            <TabsTrigger value="edit" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit Facilities
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="associations">
          <UserAssociations />
        </TabsContent>

        <TabsContent value="request">
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
        </TabsContent>

        {canEditFacilities && (
          <TabsContent value="edit">
            <FacilityProfileEditor />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
