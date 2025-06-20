
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import PharmaceuticalProductsTable from '@/components/pharmaceutical/PharmaceuticalProductsTable';

const PharmaceuticalProducts = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Pharmaceutical Products' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Products"
          description="Comprehensive pharmaceutical product inventory with pricing and availability data"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <PharmaceuticalProductsTable />
        </div>
      </div>
    </div>
  );
};

export default PharmaceuticalProducts;
