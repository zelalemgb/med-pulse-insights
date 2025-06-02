
import React from 'react';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  action?: React.ReactNode;
}

const PageHeader = ({ title, description, breadcrumbItems, action }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="mb-4">
          <BreadcrumbNavigation items={breadcrumbItems} />
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl">{description}</p>
          )}
        </div>
        
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
