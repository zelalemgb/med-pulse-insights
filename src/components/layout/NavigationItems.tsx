
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Users, Settings, BarChart3, Activity, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/pharmaceutical';

interface NavigationItemsProps {
  className?: string;
  onClick?: () => void;
}

const isActive = (location: any, path: string) => {
  return location.pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400';
};

const NavigationItems = ({ className, onClick }: NavigationItemsProps) => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      requiresAuth: true,
    },
    {
      href: '/supply-chain',
      label: 'Supply Chain',
      icon: Package,
      requiresAuth: true,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      requiresAuth: true,
      allowedRoles: ['data_analyst', 'national', 'regional'],
    },
    {
      href: '/system-health',
      label: 'System Health',
      icon: Activity,
      requiresAuth: true,
      allowedRoles: ['national', 'regional', 'zonal'],
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      requiresAuth: true,
    },
    {
      href: '/user-management',
      label: 'User Management',
      icon: Users,
      requiresAuth: true,
      allowedRoles: ['national', 'regional', 'zonal'] as UserRole[],
    },
  ];

  return (
    <ul className={cn('flex flex-col space-y-2', className)}>
      {navigationItems.map((item) => {
        if (item.requiresAuth && !profile) {
          return null;
        }

        if (item.allowedRoles && !item.allowedRoles.includes(profile?.role as UserRole)) {
          return null;
        }

        return (
          <li key={item.label}>
            <Link
              to={item.href}
              onClick={onClick}
              className={`flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive(location, item.href)}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavigationItems;
