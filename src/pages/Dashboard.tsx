
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsumptionOverview } from '@/components/dashboard/ConsumptionOverview';
import { InventoryStatus } from '@/components/dashboard/InventoryStatus';
import { ForecastAnalysis } from '@/components/dashboard/ForecastAnalysis';
import { SeasonalityTrends } from '@/components/dashboard/SeasonalityTrends';
import { WastageAnalysis } from '@/components/dashboard/WastageAnalysis';
import { StockOutAnalysis } from '@/components/dashboard/StockOutAnalysis';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { profile } = useAuth();

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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
              <TabsTrigger value="wastage">Wastage</TabsTrigger>
              <TabsTrigger value="stockouts">Stock Outs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ConsumptionOverview />
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryStatus />
            </TabsContent>

            <TabsContent value="forecast">
              <ForecastAnalysis />
            </TabsContent>

            <TabsContent value="seasonality">
              <SeasonalityTrends />
            </TabsContent>

            <TabsContent value="wastage">
              <WastageAnalysis />
            </TabsContent>

            <TabsContent value="stockouts">
              <StockOutAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
