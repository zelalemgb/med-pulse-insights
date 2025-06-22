import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import PharmaceuticalDashboard from '@/components/pharmaceutical/PharmaceuticalDashboard';
import PharmaceuticalForecast from '@/components/pharmaceutical/PharmaceuticalForecast';

const Ethiopia2025_26 = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Ethiopia 2025/26' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Ethiopia 2025/26"
          description="Summary of pharmaceutical products for the 2025/26 fiscal year"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="mt-8">
          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <PharmaceuticalDashboard />
            </TabsContent>

            <TabsContent value="dashboard">
              <PharmaceuticalForecast />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Ethiopia2025_26;
