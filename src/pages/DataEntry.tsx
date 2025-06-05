
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSpreadsheet, Plus, Info } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { DataEntryWizard } from '@/components/data-entry/DataEntryWizard';
import { ContextualNavigation } from '@/components/navigation/ContextualNavigation';

const DataEntry = () => {
  const { profile } = useAuth();
  const [showWizard, setShowWizard] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Data Entry' }
  ];

  const handleWizardComplete = (data: any) => {
    console.log('Wizard completed with data:', data);
    // Handle the completed data submission
  };

  const getRoleBasedDescription = () => {
    switch (profile?.role) {
      case 'facility_officer':
      case 'facility_manager':
        return 'Import consumption data, stock levels, and forecasting information for your facility';
      case 'zonal':
        return 'Import aggregated data from facilities in your zone';
      case 'regional':
        return 'Import regional data or bulk upload facility data';
      case 'national':
        return 'Import national-level data or manage bulk data uploads';
      default:
        return 'Import pharmaceutical supply chain data';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Data Entry & Import"
          description={getRoleBasedDescription()}
          breadcrumbItems={breadcrumbItems}
        />

        <ContextualNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main import options */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Options
                </CardTitle>
                <CardDescription>
                  Choose your preferred method to enter pharmaceutical data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Guided Wizard */}
                  <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => setShowWizard(true)}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Guided Data Entry</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Step-by-step wizard for entering consumption and stock data
                      </p>
                      <Button className="w-full">
                        Start Wizard
                      </Button>
                    </CardContent>
                  </Card>

                  {/* File Upload */}
                  <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileSpreadsheet className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">File Upload</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload Excel or CSV files with your data
                      </p>
                      <Button variant="outline" className="w-full">
                        Upload Files
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Role-specific quick actions */}
                {profile?.role && ['facility_officer', 'facility_manager'].includes(profile.role) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Facility Quick Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowWizard(true)}>
                        Monthly Consumption
                      </Button>
                      <Button size="sm" variant="outline">
                        Stock Count Update
                      </Button>
                      <Button size="sm" variant="outline">
                        Wastage Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent imports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Imports</CardTitle>
                <CardDescription>Your latest data import activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Monthly Consumption - March 2024', date: '2 days ago', status: 'success' },
                    { name: 'Stock Level Update', date: '1 week ago', status: 'success' },
                    { name: 'Forecast Data Import', date: '2 weeks ago', status: 'warning' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' : 
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with tips and templates */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Data Entry Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">Data Quality</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Ensure all consumption figures are in the same units
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">Best Practice</h4>
                    <p className="text-xs text-green-700 mt-1">
                      Import data monthly for accurate forecasting
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-900">Templates</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Use provided templates to avoid formatting errors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Templates</CardTitle>
                <CardDescription>Standard formats for data import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Consumption Data Template
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Stock Level Template
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Forecast Data Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Entry Wizard */}
        <DataEntryWizard
          open={showWizard}
          onOpenChange={setShowWizard}
          onComplete={handleWizardComplete}
        />
      </div>
    </div>
  );
};

export default DataEntry;
