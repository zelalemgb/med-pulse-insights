
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import OptimizedPharmaceuticalDashboard from '@/components/pharmaceutical/OptimizedPharmaceuticalDashboard';
import PharmaceuticalForecast from '@/components/pharmaceutical/PharmaceuticalForecast';
import { useOptimizedPharmaceuticalProducts } from '@/hooks/useOptimizedPharmaceuticalProducts';

const PharmaceuticalDashboardPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Pharmaceutical Dashboard' }
  ];

  // Use optimized hook for forecast data
  const {
    products,
    totalCount,
    isLoading,
    error,
    refetch
  } = useOptimizedPharmaceuticalProducts({}, { page: 1, pageSize: 25 });

  // Create metrics summary for forecast component compatibility
  const allProductsMetrics = {
    totalProducts: totalCount,
    totalValue: 0,
    uniqueFacilities: 0,
    uniqueRegions: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Analytics Dashboard"
          description="Optimized insights and metrics for pharmaceutical products inventory"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forecast">2025/26 Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <OptimizedPharmaceuticalDashboard />
            </TabsContent>

            <TabsContent value="forecast">
              <PharmaceuticalForecast
                products={products}
                allProductsMetrics={allProductsMetrics}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PharmaceuticalDashboardPage;
