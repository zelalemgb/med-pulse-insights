
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { FacilityOfficerDashboard } from './FacilityOfficerDashboard';
import { FacilityManagerDashboard } from './FacilityManagerDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SystemOverview } from './SystemOverview';
import { SupplyChainDashboard } from './SupplyChainDashboard';
import { Activity, BarChart3, Settings, TrendingUp, Package } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  
  const isManagerLevel = profile?.role === 'facility_manager' || 
    profile?.role === 'zonal' || 
    profile?.role === 'regional' || 
    profile?.role === 'national';
    
  const isAnalystLevel = profile?.role === 'data_analyst' || 
    profile?.role === 'national' || 
    profile?.role === 'regional';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="supply-chain" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Supply Chain
          </TabsTrigger>
          {isManagerLevel && (
            <TabsTrigger value="management" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Management
            </TabsTrigger>
          )}
          {isAnalystLevel && (
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          )}
          <TabsTrigger value="system" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <FacilityOfficerDashboard />
        </TabsContent>

        <TabsContent value="supply-chain">
          <SupplyChainDashboard />
        </TabsContent>

        {isManagerLevel && (
          <TabsContent value="management">
            <FacilityManagerDashboard />
          </TabsContent>
        )}

        {isAnalystLevel && (
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        )}

        <TabsContent value="system">
          <SystemOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleBasedDashboard;
