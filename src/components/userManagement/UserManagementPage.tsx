
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, History } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserApprovalTable } from './UserApprovalTable';
import { AllUsersTable } from './AllUsersTable';
import { UserManagementLog } from './UserManagementLog';
import PageHeader from '@/components/layout/PageHeader';

export const UserManagementPage = () => {
  const { allUsers, pendingUsers, isLoading } = useUserManagement();
  
  const approvedUsers = allUsers.filter(user => user.approval_status === 'approved');
  const rejectedUsers = allUsers.filter(user => user.approval_status === 'rejected');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'User Management' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user registrations, approvals, and role assignments across the system"
        breadcrumbItems={breadcrumbItems}
        action={
          <Badge variant="secondary" className="px-3 py-1">
            Admin Panel
          </Badge>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{allUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Registered users</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            <UserCheck className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingUsers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
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
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
                <TabsTrigger value="pending" className="flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4" />
                  Pending ({pendingUsers.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  All Users
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
                  <p className="text-sm text-gray-600">Review and approve new user registrations</p>
                </div>
                <UserApprovalTable users={pendingUsers} isLoading={isLoading} />
              </div>
            </TabsContent>

            <TabsContent value="all" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                  <p className="text-sm text-gray-600">Manage existing users and their roles</p>
                </div>
                <AllUsersTable users={allUsers} isLoading={isLoading} />
              </div>
            </TabsContent>

            <TabsContent value="log" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">User Management Activity Log</h3>
                  <p className="text-sm text-gray-600">Track all user management actions and changes</p>
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
