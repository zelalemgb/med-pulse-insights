
import React from 'react';
import { RoleJourneyTester } from '@/components/testing/RoleJourneyTester';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const RoleTestingPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Role Testing & Validation</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive testing suite for user roles and permissions validation
              </p>
            </div>
            <RoleJourneyTester />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RoleTestingPage;
