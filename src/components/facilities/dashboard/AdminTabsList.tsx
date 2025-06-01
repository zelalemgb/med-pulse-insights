
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Settings, 
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
    <TabsList className="grid w-full grid-cols-6">
      <TabsTrigger value="analytics" className="flex items-center">
        <BarChart3 className="h-4 w-4 mr-2" />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center">
        <Settings className="h-4 w-4 mr-2" />
        Roles
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
