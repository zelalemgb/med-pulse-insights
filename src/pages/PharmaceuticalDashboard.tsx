
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import PharmaceuticalDashboard from '@/components/pharmaceutical/PharmaceuticalDashboard';

const PharmaceuticalDashboardPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Pharmaceutical Dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Analytics Dashboard"
          description="Comprehensive insights and metrics for pharmaceutical products inventory"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <PharmaceuticalDashboard />
        </div>
      </div>
    </div>
  );
};

export default PharmaceuticalDashboardPage;
