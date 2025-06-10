
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Upload, Package, Building } from 'lucide-react';
import ProductsDataTable from '@/components/data-management/ProductsDataTable';
import FacilitiesDataTable from '@/components/data-management/FacilitiesDataTable';
import ImportedDataTable from '@/components/data-management/ImportedDataTable';
import DataSummaryCards from '@/components/data-management/DataSummaryCards';

const DataManagement = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Data Management' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Data Management"
          description="Manage products, facilities, and imported data"
          breadcrumbItems={breadcrumbItems}
        />
        
        <DataSummaryCards />
        
        <div className="mt-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Facilities
              </TabsTrigger>
              <TabsTrigger value="imported" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Imported Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <ProductsDataTable />
            </TabsContent>

            <TabsContent value="facilities" className="mt-6">
              <FacilitiesDataTable />
            </TabsContent>

            <TabsContent value="imported" className="mt-6">
              <ImportedDataTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
