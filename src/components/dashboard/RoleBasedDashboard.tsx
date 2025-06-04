
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import FacilityOfficerDashboard from './FacilityOfficerDashboard';
import FacilityManagerDashboard from './FacilityManagerDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import SystemOverview from './SystemOverview';
import SupplyChainDashboard from './SupplyChainDashboard';
import { BarChart3, Settings, TrendingUp, Package, Activity } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  
  // All users can access all dashboard tabs
  // Data filtering will be handled within each component based on user role
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="supply-chain" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="supply-chain" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Supply Chain
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Management
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

        <TabsContent value="supply-chain">
          <SupplyChainDashboard />
        </TabsContent>

        <TabsContent value="management">
          <FacilityManagerDashboard />
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
