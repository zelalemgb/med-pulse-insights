
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import WorkflowDashboard from './WorkflowDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import SystemOverview from './SystemOverview';
import { BarChart3, Activity, Workflow } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow" className="flex items-center">
            <Workflow className="h-4 w-4 mr-2" />
            My Workflow
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow">
          <WorkflowDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="system">
          <SystemOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleBasedDashboard;
