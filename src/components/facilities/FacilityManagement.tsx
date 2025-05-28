
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FacilitiesList } from './FacilitiesList';
import { PendingAssociations } from './PendingAssociations';
import { UserAssociations } from './UserAssociations';
import { FacilityAssociationRequest } from './FacilityAssociationRequest';
import { Building, Users, Clock, UserPlus } from 'lucide-react';

export const FacilityManagement = () => {
  const { profile } = useAuth();

  const canApproveAssociations = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.is_facility_owner ||
    (profile as any)?.can_approve_associations;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facility Management</h2>
        <FacilityAssociationRequest />
      </div>

      <Tabs defaultValue="facilities" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="facilities" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="associations" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            My Access
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

        <TabsContent value="facilities">
          <FacilitiesList />
        </TabsContent>

        <TabsContent value="associations">
          <UserAssociations />
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
