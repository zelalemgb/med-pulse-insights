
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  path: string;
  label: string;
  roles?: string[];
}

interface NavigationItemsProps {
  className?: string;
  onClick?: () => void;
}

const navigationItems: NavigationItem[] = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/facilities', label: 'Facilities', roles: ['national', 'regional', 'zonal'] },
  { path: '/products', label: 'Products', roles: ['national', 'regional', 'zonal', 'facility_manager'] },
  { path: '/profile', label: 'Profile' },
];

export const NavigationItems = ({ className, onClick }: NavigationItemsProps) => {
  const location = useLocation();
  const { profile } = useAuth();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const hasAccessToRoute = (item: NavigationItem) => {
    if (!item.roles) return true;
    return profile?.role && item.roles.includes(profile.role);
  };

  const filteredItems = navigationItems.filter(hasAccessToRoute);

  return (
    <div className={className}>
      {filteredItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClick}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center",
            className?.includes('block') 
              ? "block px-4 py-3 rounded-md text-base font-medium min-h-[48px]"
              : "",
            isActiveRoute(item.path)
              ? "bg-blue-100 text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};
