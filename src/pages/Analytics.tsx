
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import PageHeader from '@/components/layout/PageHeader';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { BarChart, Home } from 'lucide-react';

const Analytics = () => {
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
    { label: 'Analytics', icon: BarChart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="Advanced Analytics"
          description="Deep insights into pharmaceutical supply chain performance, forecasting, and optimization"
          breadcrumbItems={breadcrumbItems}
        />
        <AdvancedAnalytics />
      </main>
    </div>
  );
};

export default Analytics;
