
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';

const Analytics = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Analytics' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Advanced Analytics"
            description="Comprehensive analytics and insights for pharmaceutical supply chain management"
            breadcrumbItems={breadcrumbItems}
          />
          
          <div className="mt-8">
            <AdvancedAnalytics />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
