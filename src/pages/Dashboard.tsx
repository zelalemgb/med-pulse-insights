
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import { DashboardStatsCards } from '@/components/dashboard/DashboardStatsCards';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';

const Dashboard = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Dashboard"
            description="Overview of your pharmaceutical analytics and facility management"
            breadcrumbItems={breadcrumbItems}
          />
          
          <div className="mt-8 space-y-8">
            <DashboardStatsCards />
            <RoleBasedDashboard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
