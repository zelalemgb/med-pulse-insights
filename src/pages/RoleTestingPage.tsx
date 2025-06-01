
import React from 'react';
import { RoleJourneyTester } from '@/components/testing/RoleJourneyTester';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import { Users, TestTube } from 'lucide-react';

const RoleTestingPage = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Role Testing' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Role Testing & Validation"
            description="Comprehensive testing suite for user roles and permissions validation"
            breadcrumbItems={breadcrumbItems}
          />
          
          <div className="mt-8">
            <RoleJourneyTester />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RoleTestingPage;
