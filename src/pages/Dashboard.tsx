
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import { DashboardStatsCards } from '@/components/dashboard/DashboardStatsCards';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';
import QuickActionCards from '@/components/dashboard/QuickActionCards';
import { useAuth } from "@/contexts/AuthContext";
import WelcomeSection from "@/components/welcome/WelcomeSection";

const Dashboard = () => {
  const { user, loading, profile } = useAuth();

  const breadcrumbItems = [
    { label: 'Dashboard' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome section for unauthenticated users
  if (!user) {
    return <WelcomeSection />;
  }

  // Show dashboard for authenticated users
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title={`Welcome back, ${profile?.full_name || 'User'}!`}
            description="Overview of your pharmaceutical analytics and facility management"
            breadcrumbItems={breadcrumbItems}
          />
          
          <div className="mt-8 space-y-8">
            <QuickActionCards />
            <DashboardStatsCards />
            <RoleBasedDashboard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
