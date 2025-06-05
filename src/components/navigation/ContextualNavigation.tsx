
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Download, 
  Upload, 
  BarChart3, 
  Settings,
  Users,
  Building,
  FileText
} from 'lucide-react';

export const ContextualNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const getContextualActions = () => {
    const path = location.pathname;
    const isManagement = ['national', 'regional', 'zonal'].includes(profile?.role || '');
    const isFacility = ['facility_officer', 'facility_manager'].includes(profile?.role || '');

    switch (path) {
      case '/dashboard':
        return {
          title: 'Dashboard Actions',
          actions: [
            ...(isFacility ? [
              { label: 'Import Data', href: '/data-entry', icon: Upload, variant: 'default' as const },
              { label: 'View Analytics', href: '/analytics', icon: BarChart3, variant: 'outline' as const }
            ] : []),
            ...(isManagement ? [
              { label: 'System Overview', href: '/data-management', icon: Settings, variant: 'outline' as const },
              { label: 'User Management', href: '/user-management', icon: Users, variant: 'outline' as const }
            ] : [])
          ]
        };

      case '/data-entry':
        return {
          title: 'Data Entry Actions',
          actions: [
            { label: 'View Dashboard', href: '/dashboard', icon: ArrowLeft, variant: 'outline' as const },
            { label: 'Download Template', href: '#', icon: Download, variant: 'outline' as const },
            { label: 'View Analytics', href: '/analytics', icon: BarChart3, variant: 'outline' as const }
          ]
        };

      case '/analytics':
        return {
          title: 'Analytics Actions',
          actions: [
            { label: 'Import More Data', href: '/data-entry', icon: Plus, variant: 'default' as const },
            { label: 'Export Report', href: '#', icon: Download, variant: 'outline' as const },
            ...(isManagement ? [
              { label: 'Manage Data', href: '/data-management', icon: Settings, variant: 'outline' as const }
            ] : [])
          ]
        };

      case '/data-management':
        return {
          title: 'Data Management Actions',
          actions: [
            { label: 'Add Product', href: '#', icon: Plus, variant: 'default' as const },
            ...(isManagement ? [
              { label: 'Add Facility', href: '/facilities', icon: Building, variant: 'outline' as const },
              { label: 'Export Data', href: '#', icon: Download, variant: 'outline' as const }
            ] : [])
          ]
        };

      case '/facilities':
        return {
          title: 'Facility Actions',
          actions: [
            ...(isManagement ? [
              { label: 'Add Facility', href: '#', icon: Plus, variant: 'default' as const },
              { label: 'Import Facilities', href: '#', icon: Upload, variant: 'outline' as const },
              { label: 'Export List', href: '#', icon: Download, variant: 'outline' as const }
            ] : [])
          ]
        };

      case '/user-management':
        return {
          title: 'User Management Actions',
          actions: [
            ...(isManagement ? [
              { label: 'Invite User', href: '#', icon: Plus, variant: 'default' as const },
              { label: 'Export Users', href: '#', icon: Download, variant: 'outline' as const },
              { label: 'Audit Log', href: '#', icon: FileText, variant: 'outline' as const }
            ] : [])
          ]
        };

      default:
        return null;
    }
  };

  const contextualData = getContextualActions();

  if (!contextualData || !profile) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {contextualData.title}
          </h3>
          <div className="flex items-center space-x-2">
            {contextualData.actions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button 
                  size="sm" 
                  variant={action.variant}
                  className="text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
