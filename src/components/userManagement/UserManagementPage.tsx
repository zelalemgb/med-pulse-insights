
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, History, Bug, Shield, Clock } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserApprovalTable } from './UserApprovalTable';
import { AllUsersTable } from './AllUsersTable';
import { UserManagementLog } from './UserManagementLog';
import { UserManagementDebug } from './UserManagementDebug';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/layout/PageHeader';

export const UserManagementPage = () => {
  const { pendingUsers, approvedUsers, rejectedUsers, isLoading } = useUserManagement();
  const { profile } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  // Get role-specific titles and descriptions
  const getRoleBasedTitle = () => {
    switch (profile?.role) {
      case 'national':
        return 'User Management Dashboard';
      case 'regional':
        return 'Regional User Management';
      case 'zonal':
        return 'Zonal User Management';
      default:
        return 'User Management';
    }
  };

  const getRoleBasedDescription = () => {
    switch (profile?.role) {
      case 'national':
        return 'Manage users across all levels of the system hierarchy';
      case 'regional':
        return 'Manage zonal administrators and facility users within your regional jurisdiction';
      case 'zonal':
        return 'Manage facility users (officers and managers) within your zone';
      default:
        return 'Manage user registrations and role assignments';
    }
  };

  const getUserTypeLabel = () => {
    switch (profile?.role) {
      case 'national':
        return 'System Users';
      case 'regional':
        return 'Regional Users';
      case 'zonal':
        return 'Zonal Users';
      default:
        return 'Users';
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: getRoleBasedTitle() }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={getRoleBasedTitle()}
        description={getRoleBasedDescription()}
        breadcrumbItems={breadcrumbItems}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug className="h-4 w-4 mr-2" />
              {showDebug ? 'Hide' : 'Show'} Debug
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              {profile?.role?.toUpperCase()} Panel
            </Badge>
          </div>
        }
      />

      {/* Debug Panel */}
      {showDebug && <UserManagementDebug />}

      {/* Role-specific information banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Hierarchical Access Control</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            {profile?.role === 'national' && 'You can manage users across all levels of the system.'}
            {profile?.role === 'regional' && 'You can manage zonal administrators and facility users within your regional jurisdiction.'}
            {profile?.role === 'zonal' && 'You can manage facility officers and managers within your zone.'}
          </p>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting your review</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved Users</CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Active users</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected Users</CardTitle>
            <UserX className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Denied access</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total {getUserTypeLabel()}</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingUsers.length + approvedUsers.length + rejectedUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">In your jurisdiction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full max-w-lg grid-cols-4 bg-gray-100">
                <TabsTrigger value="pending" className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingUsers.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4" />
                  Approved ({approvedUsers.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2 text-sm">
                  <UserX className="h-4 w-4" />
                  Rejected ({rejectedUsers.length})
                </TabsTrigger>
                <TabsTrigger value="log" className="flex items-center gap-2 text-sm">
                  <History className="h-4 w-4" />
                  Activity Log
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pending User Approvals</h3>
                  <p className="text-sm text-gray-600">
                    Review and approve new user registrations in your jurisdiction
                  </p>
                </div>
                <UserApprovalTable users={pendingUsers} isLoading={isLoading} />
              </div>
            </TabsContent>

            <TabsContent value="approved" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Approved Users</h3>
                  <p className="text-sm text-gray-600">
                    Manage existing approved users and their roles within your jurisdiction
                  </p>
                </div>
                <AllUsersTable users={approvedUsers} isLoading={isLoading} />
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rejected Users</h3>
                  <p className="text-sm text-gray-600">
                    View users who have been denied access to the system
                  </p>
                </div>
                <AllUsersTable users={rejectedUsers} isLoading={isLoading} />
              </div>
            </TabsContent>

            <TabsContent value="log" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">User Management Activity Log</h3>
                  <p className="text-sm text-gray-600">
                    Track all user management actions and changes within your jurisdiction
                  </p>
                </div>
                <UserManagementLog />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
