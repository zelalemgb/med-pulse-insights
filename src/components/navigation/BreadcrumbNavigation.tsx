
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ items, className }) => {
  const location = useLocation();

  // Default breadcrumb mapping based on current route
  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/', icon: Home }
    ];

    const routeMapping: Record<string, string> = {
      'dashboard': 'Dashboard',
      'facilities': 'Facilities',
      'analytics': 'Analytics',
      'role-testing': 'Role Testing',
      'auth': 'Authentication',
      'import': 'Data Import'
    };

    pathSegments.forEach((segment, index) => {
      const label = routeMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const path = index === pathSegments.length - 1 ? undefined : `/${pathSegments.slice(0, index + 1).join('/')}`;
      
      breadcrumbs.push({ label, path });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || getDefaultBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <div className={`mb-6 ${className || ''}`}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.path ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNavigation;
