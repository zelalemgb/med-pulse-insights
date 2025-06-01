
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PendingAssociations } from '../PendingAssociations';
import { FacilitiesList } from '../FacilitiesList';
import { FacilityTestHelper } from '../FacilityTestHelper';
import { CrossFacilityAnalytics } from '../CrossFacilityAnalytics';
import { RoleManagement } from '../RoleManagement';
import { RoleTestingDashboard } from '../RoleTestingDashboard';
import { AuthTester } from '@/components/testing/AuthTester';
import { CheckCircle } from 'lucide-react';

interface AdminTabsContentProps {
  pendingCount: number;
}

export const AdminTabsContent = ({ pendingCount }: AdminTabsContentProps) => {
  return (
    <>
      <TabsContent value="auth-testing">
        <AuthTester />
      </TabsContent>

      <TabsContent value="analytics">
        <CrossFacilityAnalytics />
      </TabsContent>

      <TabsContent value="roles">
        <RoleManagement />
      </TabsContent>

      <TabsContent value="role-testing">
        <RoleTestingDashboard />
      </TabsContent>

      <TabsContent value="testing">
        <FacilityTestHelper />
      </TabsContent>

      <TabsContent value="pending">
        {pendingCount > 0 ? (
          <PendingAssociations />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                <h4 className="text-lg font-semibold mb-2">All Caught Up!</h4>
                <p className="text-gray-600">
                  There are no pending association requests at this time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="facilities">
        <FacilitiesList />
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              User management features will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="optimization">
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Advanced supply chain optimization tools and recommendations.
            </p>
            <CrossFacilityAnalytics />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
