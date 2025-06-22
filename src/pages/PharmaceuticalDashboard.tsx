
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import PharmaceuticalDashboard from '@/components/pharmaceutical/PharmaceuticalDashboard';
import PharmaceuticalForecast from '@/components/pharmaceutical/PharmaceuticalForecast';
import { usePharmaceuticalProducts } from '@/hooks/usePharmaceuticalProducts';

const PharmaceuticalDashboardPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Pharmaceutical Dashboard' }
  ];

  const {
    products,
    allProductsMetrics,
    isLoading,
    error,
    refetch
  } = usePharmaceuticalProducts({}, { page: 1, pageSize: 50, enablePagination: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Analytics Dashboard"
          description="Comprehensive insights and metrics for pharmaceutical products inventory"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forecast">2025/26 Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <PharmaceuticalDashboard
                products={products}
                allProductsMetrics={allProductsMetrics}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
              />
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
