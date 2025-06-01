
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { FacilityManagement } from '@/components/facilities/FacilityManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';

const Facilities = () => {
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
    { label: 'Facilities', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="Facilities Management"
          description="Manage health facilities, roles, and organizational structure"
          breadcrumbItems={breadcrumbItems}
        />
        <FacilityManagement />
      </main>
    </div>
  );
};

export default Facilities;
