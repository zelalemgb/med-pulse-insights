
import React from 'react';
import { FacilityManagement } from '@/components/facilities/FacilityManagement';
import PageHeader from '@/components/layout/PageHeader';
import { Building2 } from 'lucide-react';

const Facilities = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Facilities' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Facility Management"
          description="Manage health facilities, associations, and role assignments across your organization"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <FacilityManagement />
        </div>
      </div>
    </div>
  );
};

export default Facilities;
