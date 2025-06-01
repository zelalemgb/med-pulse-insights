
import React from 'react';
import { ComprehensiveAuthTester } from '@/components/testing/ComprehensiveAuthTester';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';

const ComprehensiveTestingPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Comprehensive Testing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Complete System Testing"
          description="Comprehensive testing of authentication, roles, database, and frontend systems"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <ComprehensiveAuthTester />
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveTestingPage;
