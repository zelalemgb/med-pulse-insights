
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, Package, MapPin, Users, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import DataSummaryCards from '@/components/data-management/DataSummaryCards';
import FacilitiesDataTable from '@/components/data-management/FacilitiesDataTable';
import ProductsDataTable from '@/components/data-management/ProductsDataTable';
import ImportedDataTable from '@/components/data-management/ImportedDataTable';

const DataManagement = () => {
  const { canAccess, userRole } = usePermissions();
  const { profile } = useAuth();
  const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Manage Your Data' }
  ];

  const getRoleDisplayText = (role: string) => {
    const roleTexts = {
      'national': 'National Level Data',
      'regional': 'Regional Level Data',
      'zonal': 'Zonal Level Data', 
      'facility_manager': 'Facility Level Data',
      'facility_officer': 'Facility Level Data'
    };
    return roleTexts[role] || 'Your Data';
  };

  const handleProductCreated = (newProduct: any) => {
    // This would typically update the local state or refetch data
    console.log('New product created:', newProduct);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Manage Your Data"
          description={`${getRoleDisplayText(userRole)} - View and manage facilities, products, and imported data`}
          breadcrumbItems={breadcrumbItems}
        />

        <DataSummaryCards />

        <div className="mt-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="imports">Imports</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {canAccess.manageFacilities && (
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/facilities'}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                )}
                {canAccess.createProducts && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowCreateProductDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Data Quality Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Import</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2 days ago</div>
                    <p className="text-xs text-muted-foreground">Consumption data</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userRole === 'national' ? '85%' : '92%'}</div>
                    <p className="text-xs text-muted-foreground">of facilities reporting</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across your data management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New consumption data imported</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Facility data updated</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New product added to catalog</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facilities">
              <FacilitiesDataTable />
            </TabsContent>

            <TabsContent value="products">
              <ProductsDataTable />
            </TabsContent>

            <TabsContent value="imports">
              <ImportedDataTable />
            </TabsContent>
          </Tabs>
        </div>

        <CreateProductDialog
          open={showCreateProductDialog}
          onOpenChange={setShowCreateProductDialog}
          onSuccess={handleProductCreated}
        />
      </div>
    </div>
  );
};

export default DataManagement;
