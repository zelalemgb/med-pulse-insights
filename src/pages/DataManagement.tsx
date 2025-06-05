import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, Package, MapPin, Users, TrendingUp, Upload, FileText, FileCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import DataSummaryCards from '@/components/data-management/DataSummaryCards';
import FacilitiesDataTable from '@/components/data-management/FacilitiesDataTable';
import ProductsDataTable from '@/components/data-management/ProductsDataTable';
import ImportedDataTable from '@/components/data-management/ImportedDataTable';
import IntegrationTestPanel from '@/components/testing/IntegrationTestPanel';

const DataManagement = () => {
  const { canAccess, userRole } = usePermissions();
  const { profile } = useAuth();
  const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Manage Your Data' }
  ];

  const getRoleDisplayText = (role: string) => {
    const roleTexts = {
      'national': 'National Level Data Management',
      'regional': 'Regional Level Data Management',
      'zonal': 'Zonal Level Data Management', 
      'facility_manager': 'Facility Data Management',
      'facility_officer': 'Facility Data Management'
    };
    return roleTexts[role] || 'Data Management';
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      'national': 'Manage facilities, products, and data imports across the entire system',
      'regional': 'Manage facilities and data within your region',
      'zonal': 'Manage imported data and forecasts for your zone',
      'facility_manager': 'Manage imported data and forecasts for your facility',
      'facility_officer': 'Manage imported data and forecasts for your facility'
    };
    return descriptions[role] || 'Manage your data and resources';
  };

  // Role-based tab configuration
  const getAvailableTabs = () => {
    const baseTabs = [
      { value: 'overview', label: 'Overview', icon: TrendingUp },
      { value: 'imports', label: 'Data Imports', icon: Upload }
    ];

    // Add facilities tab for regional and national users
    if (['national', 'regional'].includes(userRole)) {
      baseTabs.splice(1, 0, { value: 'facilities', label: 'Facilities', icon: Building2 });
    }

    // Add products tab only for national users
    if (userRole === 'national') {
      baseTabs.splice(-1, 0, { value: 'products', label: 'Products', icon: Package });
    }

    // Add test panel for development
    if (userRole === 'national') {
      baseTabs.push({ value: 'testing', label: 'Testing', icon: FileCheck });
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();
  const defaultTab = availableTabs[0]?.value || 'overview';

  const handleProductCreated = (newProduct: any) => {
    console.log('New product created:', newProduct);
  };

  // Role-based action buttons
  const renderActionButtons = () => {
    const buttons = [];

    // Regional and National can add facilities
    if (['national', 'regional'].includes(userRole)) {
      buttons.push(
        <Button 
          key="facility"
          variant="outline"
          onClick={() => window.location.href = '/facilities'}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      );
    }

    // Only National can add products
    if (userRole === 'national') {
      buttons.push(
        <Button 
          key="product"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowCreateProductDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      );
    }

    // All users can import data
    buttons.push(
      <Button 
        key="import"
        variant={buttons.length > 0 ? "outline" : "default"}
        onClick={() => window.location.href = '/data-entry'}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Data
      </Button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={getRoleDisplayText(userRole)}
          description={getRoleDescription(userRole)}
          breadcrumbItems={breadcrumbItems}
        />

        <DataSummaryCards />

        <div className="mt-8">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className={`grid w-full max-w-${availableTabs.length === 2 ? 'sm' : availableTabs.length === 3 ? 'md' : availableTabs.length === 4 ? 'lg' : 'xl'} grid-cols-${availableTabs.length}`}>
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      <Icon className="h-4 w-4 mr-1" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="flex gap-2">
                {renderActionButtons()}
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
                    <div className="text-2xl font-bold">
                      {userRole === 'national' ? '94%' : userRole === 'regional' ? '92%' : '96%'}
                    </div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Import</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2 days ago</div>
                    <p className="text-xs text-muted-foreground">
                      {['facility_officer', 'facility_manager'].includes(userRole) ? 'Consumption data' : 'Regional data sync'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {userRole === 'national' ? 'National Coverage' : userRole === 'regional' ? 'Regional Coverage' : 'Data Completeness'}
                    CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userRole === 'national' ? '85%' : userRole === 'regional' ? '89%' : '98%'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {userRole === 'national' ? 'of regions reporting' : userRole === 'regional' ? 'of zones reporting' : 'data completeness'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates in your data management scope</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['facility_officer', 'facility_manager'].includes(userRole) ? (
                      <>
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Consumption data imported</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Forecast data generated</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Stock out alert processed</p>
                            <p className="text-xs text-gray-500">3 days ago</p>
                          </div>
                        </div>
                      </>
                    ) : userRole === 'zonal' ? (
                      <>
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Zonal data aggregation completed</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Facility reports synchronized</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {userRole === 'national' ? 'National data synchronization' : 'Regional data update'}
                            </p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New facility registered</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                        {userRole === 'national' && (
                          <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Product catalog updated</p>
                              <p className="text-xs text-gray-500">3 days ago</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {['national', 'regional'].includes(userRole) && (
              <TabsContent value="facilities">
                <FacilitiesDataTable />
              </TabsContent>
            )}

            {userRole === 'national' && (
              <TabsContent value="products">
                <ProductsDataTable />
              </TabsContent>
            )}

            <TabsContent value="imports">
              <ImportedDataTable />
            </TabsContent>

            {userRole === 'national' && (
              <TabsContent value="testing">
                <IntegrationTestPanel />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Only show product dialog for national users */}
        {userRole === 'national' && (
          <CreateProductDialog
            open={showCreateProductDialog}
            onOpenChange={setShowCreateProductDialog}
            onSuccess={handleProductCreated}
          />
        )}
      </div>
    </div>
  );
};

export default DataManagement;
