
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsumptionOverview } from '@/components/dashboard/ConsumptionOverview';
import { InventoryStatus } from '@/components/dashboard/InventoryStatus';
import { ForecastAnalysis } from '@/components/dashboard/ForecastAnalysis';
import { SeasonalityTrends } from '@/components/dashboard/SeasonalityTrends';
import { WastageAnalysis } from '@/components/dashboard/WastageAnalysis';
import { StockOutAnalysis } from '@/components/dashboard/StockOutAnalysis';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';
import RoleGuard from '@/components/auth/RoleGuard';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const { profile } = useAuth();
  const { canAccess } = usePermissions();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'facility_officer': 'Facility Officer',
      'facility_manager': 'Facility Manager',
      'zonal': 'Zonal',
      'regional': 'Regional',
      'national': 'National',
      'data_analyst': 'Data Analyst',
      'program_manager': 'Program Manager',
      'procurement': 'Procurement',
      'finance': 'Finance',
      'qa': 'Quality Assurance'
    };
    return roleNames[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: BarChart3 },
    { label: 'Dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Usage Dashboard"
          description="Monitor consumption patterns, forecast demand, and optimize inventory management"
          breadcrumbItems={breadcrumbItems}
        >
          {profile?.role && (
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              {getRoleDisplayName(profile.role)} View
            </Badge>
          )}
        </PageHeader>

        <div className="mt-8">
          <Tabs defaultValue="role-dashboard" className="space-y-8">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-7 min-w-fit">
                <TabsTrigger value="role-dashboard" className="whitespace-nowrap">Role Dashboard</TabsTrigger>
                <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="inventory" className="whitespace-nowrap">Inventory</TabsTrigger>
                <TabsTrigger value="forecast" disabled={!canAccess.dataAnalysis} className="whitespace-nowrap">
                  Forecast
                </TabsTrigger>
                <TabsTrigger value="seasonality" disabled={!canAccess.dataAnalysis} className="whitespace-nowrap">
                  Seasonality
                </TabsTrigger>
                <TabsTrigger value="wastage" disabled={!canAccess.advancedReports} className="whitespace-nowrap">
                  Wastage
                </TabsTrigger>
                <TabsTrigger value="stockouts" disabled={!canAccess.advancedReports} className="whitespace-nowrap">
                  Stock Outs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="space-y-6">
              <TabsContent value="role-dashboard" className="space-y-6">
                <RoleBasedDashboard />
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                <ConsumptionOverview />
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <InventoryStatus />
              </TabsContent>

              <TabsContent value="forecast" className="space-y-6">
                <RoleGuard allowedRoles={['data_analyst', 'program_manager', 'national', 'regional', 'zonal']}>
                  <ForecastAnalysis />
                </RoleGuard>
              </TabsContent>

              <TabsContent value="seasonality" className="space-y-6">
                <RoleGuard allowedRoles={['data_analyst', 'program_manager', 'national', 'regional', 'zonal']}>
                  <SeasonalityTrends />
                </RoleGuard>
              </TabsContent>

              <TabsContent value="wastage" className="space-y-6">
                <RoleGuard allowedRoles={['national', 'regional', 'zonal', 'facility_manager', 'program_manager']}>
                  <WastageAnalysis />
                </RoleGuard>
              </TabsContent>

              <TabsContent value="stockouts" className="space-y-6">
                <RoleGuard allowedRoles={['national', 'regional', 'zonal', 'facility_manager', 'program_manager']}>
                  <StockOutAnalysis />
                </RoleGuard>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
