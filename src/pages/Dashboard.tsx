import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsumptionOverview } from '@/components/dashboard/ConsumptionOverview';
import { InventoryStatus } from '@/components/dashboard/InventoryStatus';
import { ForecastAnalysis } from '@/components/dashboard/ForecastAnalysis';
import { SeasonalityTrends } from '@/components/dashboard/SeasonalityTrends';
import { WastageAnalysis } from '@/components/dashboard/WastageAnalysis';
import { StockOutAnalysis } from '@/components/dashboard/StockOutAnalysis';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';
import Header from '@/components/layout/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pharmaceutical Usage Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Monitor consumption patterns, forecast demand, and optimize inventory management
              {profile?.role && (
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {getRoleDisplayName(profile.role)} View
                </span>
              )}
            </p>
          </div>

          <Tabs defaultValue="role-dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="role-dashboard">Role Dashboard</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="forecast" disabled={!canAccess.dataAnalysis}>
                Forecast
              </TabsTrigger>
              <TabsTrigger value="seasonality" disabled={!canAccess.dataAnalysis}>
                Seasonality
              </TabsTrigger>
              <TabsTrigger value="wastage" disabled={!canAccess.advancedReports}>
                Wastage
              </TabsTrigger>
              <TabsTrigger value="stockouts" disabled={!canAccess.advancedReports}>
                Stock Outs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="role-dashboard">
              <RoleBasedDashboard />
            </TabsContent>

            <TabsContent value="overview">
              <ConsumptionOverview />
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryStatus />
            </TabsContent>

            <TabsContent value="forecast">
              <RoleGuard allowedRoles={['data_analyst', 'program_manager', 'national', 'regional', 'zonal']}>
                <ForecastAnalysis />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="seasonality">
              <RoleGuard allowedRoles={['data_analyst', 'program_manager', 'national', 'regional', 'zonal']}>
                <SeasonalityTrends />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="wastage">
              <RoleGuard allowedRoles={['national', 'regional', 'zonal', 'facility_manager', 'program_manager']}>
                <WastageAnalysis />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="stockouts">
              <RoleGuard allowedRoles={['national', 'regional', 'zonal', 'facility_manager', 'program_manager']}>
                <StockOutAnalysis />
              </RoleGuard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
