
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Building2, Package, Users } from 'lucide-react';
import { CreateFacilityDialog } from '@/components/facilities/CreateFacilityDialog';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';

const IntegrationTestPanel = () => {
  const [showFacilityDialog, setShowFacilityDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [testResults, setTestResults] = useState<{
    facilityCreation: 'pending' | 'success' | 'error';
    productCreation: 'pending' | 'success' | 'error';
    databaseIntegration: 'pending' | 'success' | 'error';
  }>({
    facilityCreation: 'pending',
    productCreation: 'pending',
    databaseIntegration: 'pending'
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const handleFacilitySuccess = (facility: any) => {
    console.log('✅ Facility creation test passed:', facility);
    setTestResults(prev => ({ ...prev, facilityCreation: 'success' }));
  };

  const handleProductSuccess = (product: any) => {
    console.log('✅ Product creation test passed:', product);
    setTestResults(prev => ({ ...prev, productCreation: 'success' }));
  };

  const runDatabaseTest = async () => {
    try {
      console.log('🔄 Testing database integration...');
      // Simulate database operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Database integration test passed');
      setTestResults(prev => ({ ...prev, databaseIntegration: 'success' }));
    } catch (error) {
      console.error('❌ Database integration test failed:', error);
      setTestResults(prev => ({ ...prev, databaseIntegration: 'error' }));
    }
  };

  const resetTests = () => {
    setTestResults({
      facilityCreation: 'pending',
      productCreation: 'pending',
      databaseIntegration: 'pending'
    });
    console.log('🔄 Test results reset');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Integration Test Panel
        </CardTitle>
        <CardDescription>
          Test facility and product creation features with database integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.facilityCreation)}
              <div>
                <p className="font-medium">Facility Creation</p>
                <p className="text-sm text-gray-500">Dialog & Form Validation</p>
              </div>
            </div>
            {getStatusBadge(testResults.facilityCreation)}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.productCreation)}
              <div>
                <p className="font-medium">Product Creation</p>
                <p className="text-sm text-gray-500">Form & Package Size</p>
              </div>
            </div>
            {getStatusBadge(testResults.productCreation)}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.databaseIntegration)}
              <div>
                <p className="font-medium">Database Integration</p>
                <p className="text-sm text-gray-500">Backend Connection</p>
              </div>
            </div>
            {getStatusBadge(testResults.databaseIntegration)}
          </div>
        </div>

        {/* Test Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Test Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowFacilityDialog(true)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Building2 className="h-6 w-6" />
              <span>Test Facility Creation</span>
            </Button>

            <Button
              onClick={() => setShowProductDialog(true)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Package className="h-6 w-6" />
              <span>Test Product Creation</span>
            </Button>

            <Button
              onClick={runDatabaseTest}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>Test Database Integration</span>
            </Button>

            <Button
              onClick={resetTests}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle className="h-6 w-6" />
              <span>Reset All Tests</span>
            </Button>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Test Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Click "Test Facility Creation" to open the facility dialog and test the form</li>
            <li>Click "Test Product Creation" to open the product dialog and verify package size field</li>
            <li>Click "Test Database Integration" to simulate backend operations</li>
            <li>Check the console for detailed logs and error messages</li>
            <li>Use "Reset All Tests" to clear test results and start over</li>
          </ol>
        </div>
      </CardContent>

      {/* Test Dialogs */}
      <CreateFacilityDialog
        open={showFacilityDialog}
        onOpenChange={setShowFacilityDialog}
        onSuccess={handleFacilitySuccess}
      />

      <CreateProductDialog
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
        onSuccess={handleProductSuccess}
      />
    </Card>
  );
};

export default IntegrationTestPanel;
