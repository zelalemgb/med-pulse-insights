
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
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} View
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
              <RoleGuard allowedRoles={['admin', 'manager', 'analyst']}>
                <ForecastAnalysis />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="seasonality">
              <RoleGuard allowedRoles={['admin', 'manager', 'analyst']}>
                <SeasonalityTrends />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="wastage">
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <WastageAnalysis />
              </RoleGuard>
            </TabsContent>

            <TabsContent value="stockouts">
              <RoleGuard allowedRoles={['admin', 'manager']}>
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
