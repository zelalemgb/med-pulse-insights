
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, History } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserApprovalTable } from './UserApprovalTable';
import { AllUsersTable } from './AllUsersTable';
import { UserManagementLog } from './UserManagementLog';

export const UserManagementPage = () => {
  const { allUsers, pendingUsers, isLoading } = useUserManagement();
  
  const approvedUsers = allUsers.filter(user => user.approval_status === 'approved');
  const rejectedUsers = allUsers.filter(user => user.approval_status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Badge variant="secondary">Super Admin</Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <UserCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Pending ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="log" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <UserApprovalTable users={pendingUsers} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <AllUsersTable users={allUsers} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementLog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
