
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import { RoleBasedDashboard } from '@/components/dashboard/RoleBasedDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <RoleBasedDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
