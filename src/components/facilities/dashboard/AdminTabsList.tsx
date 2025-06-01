
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  BarChart3, 
  Settings, 
  UserCheck, 
  TestTube, 
  Clock, 
  Building, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface AdminTabsListProps {
  pendingCount: number;
}

export const AdminTabsList = ({ pendingCount }: AdminTabsListProps) => {
  return (
    <TabsList className="grid w-full grid-cols-9">
      <TabsTrigger value="auth-testing" className="flex items-center">
        <LogIn className="h-4 w-4 mr-2" />
        Auth Test
      </TabsTrigger>
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
  );
};
