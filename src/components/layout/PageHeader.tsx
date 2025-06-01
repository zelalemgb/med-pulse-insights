
import React from 'react';
import { Separator } from "@/components/ui/separator";
import BreadcrumbNavigation from "@/components/navigation/BreadcrumbNavigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  breadcrumbItems?: Array<{ label: string; path?: string; icon?: React.ComponentType<any> }>;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  breadcrumbItems,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <BreadcrumbNavigation items={breadcrumbItems} />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-4xl">
              {description}
            </p>
          )}
        </div>
        
        {children && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {children}
          </div>
        )}
      </div>
      
      <Separator className="bg-gray-200" />
    </div>
  );
};

export default PageHeader;
