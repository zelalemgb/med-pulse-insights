
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BarChart3, Map, Upload, Database, Plus, TrendingUp, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavigationItemsProps {
  className?: string;
  onClick?: () => void;
}

const isActive = (location: any, path: string) => {
  return location.pathname === path ? 'text-blue-600 dark:text-blue-400 bg-blue-50' : 'text-gray-600 dark:text-gray-400';
};

const NavigationItems = ({ className, onClick }: NavigationItemsProps) => {
  const { profile } = useAuth();
  const location = useLocation();

  // Check if user can manage other users (national, regional, zonal roles)
  const canManageUsers = profile?.role && ['national', 'regional', 'zonal'].includes(profile.role);
  const isFacilityLevel = profile?.role && ['facility_officer', 'facility_manager'].includes(profile.role);
  const isManagementLevel = profile?.role && ['national', 'regional', 'zonal'].includes(profile.role);

  // Core workflow navigation items organized by mental model
  const coreWorkflow = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      requiresAuth: false,
      description: 'Home page and map'
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      requiresAuth: true,
      description: 'Overview and metrics'
    },
    {
      href: '/data-entry',
      label: isFacilityLevel ? 'Import Data' : 'Data Import',
      icon: Upload,
      requiresAuth: true,
      description: 'Upload consumption data',
      badge: isFacilityLevel ? 'Primary' : null
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      requiresAuth: true,
      description: 'Insights and forecasting'
    }
  ];

  // Management navigation items
  const managementItems = [
    {
      href: '/data-management',
      label: 'Manage Data',
      icon: Database,
      requiresAuth: true,
      description: 'Data oversight and quality'
    },
    {
      href: '/facilities',
      label: 'Facilities',
      icon: Map,
      requiresAuth: true,
      description: 'Facility management'
    },
    ...(canManageUsers ? [{
      href: '/user-management',
      label: 'Users',
      icon: Users,
      requiresAuth: true,
      description: 'User administration'
    }] : [])
  ];

  // Quick action items based on role
  const getQuickActions = () => {
    if (isFacilityLevel) {
      return [
        { 
          href: '/data-entry?quick=consumption',
          label: 'Quick Import',
          icon: Plus,
          color: 'bg-blue-600'
        }
      ];
    }
    
    if (isManagementLevel) {
      return [
        { 
          href: '/analytics?view=performance',
          label: 'Performance',
          icon: TrendingUp,
          color: 'bg-green-600'
        },
        { 
          href: '/data-management?tab=overview',
          label: 'Overview',
          icon: FileText,
          color: 'bg-purple-600'
        }
      ];
    }
    
    return [];
  };

  const quickActions = getQuickActions();

  // Filter items based on authentication status
  const visibleCoreItems = coreWorkflow.filter(item => 
    !item.requiresAuth || (item.requiresAuth && profile)
  );

  const visibleManagementItems = profile ? managementItems : [];

  return (
    <div className={cn('flex flex-col lg:flex-row space-y-1 lg:space-y-0 lg:space-x-1', className)}>
      {/* Core workflow items */}
      {visibleCoreItems.map((item) => (
        <div key={item.label} className="flex-shrink-0 group relative">
          <Link
            to={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center space-x-1 lg:space-x-2 py-2 px-2 lg:px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm whitespace-nowrap",
              isActive(location, item.href)
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-xs lg:text-sm">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
                {item.badge}
              </Badge>
            )}
          </Link>
          
          {/* Tooltip for larger screens */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
            {item.description}
          </div>
        </div>
      ))}

      {/* Management items */}
      {profile && visibleManagementItems.length > 0 && (
        <>
          <div className="hidden lg:block w-px bg-gray-200 mx-2"></div>
          {visibleManagementItems.map((item) => (
            <div key={item.label} className="flex-shrink-0 group relative">
              <Link
                to={item.href}
                onClick={onClick}
                className={cn(
                  "flex items-center space-x-1 lg:space-x-2 py-2 px-2 lg:px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm whitespace-nowrap",
                  isActive(location, item.href)
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-xs lg:text-sm">{item.label}</span>
              </Link>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                {item.description}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Quick actions for larger screens */}
      {profile && quickActions.length > 0 && (
        <>
          <div className="hidden lg:block w-px bg-gray-200 mx-2"></div>
          <div className="hidden lg:flex items-center space-x-1">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href} onClick={onClick}>
                <Button 
                  size="sm" 
                  className={cn("text-white text-xs px-2 py-1 h-8", action.color)}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationItems;
