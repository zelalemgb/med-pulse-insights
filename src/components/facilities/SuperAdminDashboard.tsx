
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePendingAssociations, useHealthFacilities } from '@/hooks/useHealthFacilities';
import { PendingAssociations } from './PendingAssociations';
import { FacilitiesList } from './FacilitiesList';
import { FacilityTestHelper } from './FacilityTestHelper';
import { CrossFacilityAnalytics } from './CrossFacilityAnalytics';
import { RoleManagement } from './RoleManagement';
import { RoleTestingDashboard } from './RoleTestingDashboard';
import { Shield, Users, Building, Clock, CheckCircle, TestTube, BarChart3, TrendingUp, Settings, UserCheck } from 'lucide-react';

export const SuperAdminDashboard = () => {
  const { profile } = useAuth();
  const { data: pendingAssociations } = usePendingAssociations();
  const { data: facilities } = useHealthFacilities();

  const isAuthorized = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.can_approve_associations;

  if (!isAuthorized) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold mb-2">Access Denied</h4>
            <p className="text-gray-600">
              You don't have permission to access the admin dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = pendingAssociations?.length || 0;
  const totalFacilities = facilities?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
        <Badge variant="secondary" className="text-sm">
          {profile?.role?.toUpperCase()} ADMIN
        </Badge>
      </div>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
            <p className="text-xs text-muted-foreground">
              Facilities under management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-xs text-muted-foreground">
              Connected to facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="role-testing" className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Role Testing
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center">
            <TestTube className="h-4 w-4 mr-2" />
            System Testing
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};
