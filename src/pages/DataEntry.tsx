
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DataEntry = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Data Entry', icon: PlusCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="Data Entry"
          description="Manual entry of pharmaceutical supply chain data"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Data
              </CardTitle>
              <CardDescription>
                Manually enter pharmaceutical inventory and consumption data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Data entry forms will be implemented here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DataEntry;
