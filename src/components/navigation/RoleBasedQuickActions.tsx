
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  Upload, 
  BarChart3, 
  Plus, 
  Users, 
  Building, 
  TrendingUp,
  FileText,
  Settings,
  Download
} from 'lucide-react';

export const RoleBasedQuickActions = () => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const getFacilityActions = () => [
    {
      title: 'Import Consumption Data',
      description: 'Upload monthly consumption data',
      href: '/data-entry?type=consumption',
      icon: Upload,
      priority: 'high',
      color: 'bg-blue-600'
    },
    {
      title: 'View Stock Analysis',
      description: 'Check current stock levels and alerts',
      href: '/analytics?view=stock',
      icon: BarChart3,
      priority: 'medium',
      color: 'bg-green-600'
    },
    {
      title: 'Generate Report',
      description: 'Create monthly consumption report',
      href: '/analytics?action=report',
      icon: FileText,
      priority: 'low',
      color: 'bg-purple-600'
    }
  ];

  const getManagementActions = () => [
    {
      title: 'System Performance',
      description: 'View regional/national metrics',
      href: '/analytics?view=performance',
      icon: TrendingUp,
      priority: 'high',
      color: 'bg-green-600'
    },
    {
      title: 'Manage Users',
      description: 'User access and permissions',
      href: '/user-management',
      icon: Users,
      priority: 'medium',
      color: 'bg-blue-600'
    },
    {
      title: 'Add Facility',
      description: 'Register new health facility',
      href: '/facilities?action=add',
      icon: Building,
      priority: 'medium',
      color: 'bg-purple-600'
    },
    {
      title: 'Data Quality Check',
      description: 'Review data integrity and completeness',
      href: '/data-management?tab=quality',
      icon: Settings,
      priority: 'low',
      color: 'bg-orange-600'
    }
  ];

  const actions = profile.role && ['facility_officer', 'facility_manager'].includes(profile.role)
    ? getFacilityActions()
    : getManagementActions();

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedActions = actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Actions
          <Badge variant="secondary" className="text-xs">
            {profile.role?.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-gray-200 hover:border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${action.color} p-2 rounded-lg flex-shrink-0`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                      <Badge 
                        variant={action.priority === 'high' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {action.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Workflow shortcuts */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Common Workflows</h4>
          <div className="flex flex-wrap gap-2">
            {profile.role && ['facility_officer', 'facility_manager'].includes(profile.role) ? (
              <>
                <Link to="/data-entry?flow=monthly">
                  <Button size="sm" variant="outline" className="text-xs">
                    Monthly Data Entry
                  </Button>
                </Link>
                <Link to="/analytics?flow=consumption">
                  <Button size="sm" variant="outline" className="text-xs">
                    Consumption Analysis
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export Template
                </Button>
              </>
            ) : (
              <>
                <Link to="/analytics?flow=regional">
                  <Button size="sm" variant="outline" className="text-xs">
                    Regional Overview
                  </Button>
                </Link>
                <Link to="/data-management?flow=quality">
                  <Button size="sm" variant="outline" className="text-xs">
                    Data Quality Review
                  </Button>
                </Link>
                <Link to="/user-management?flow=approval">
                  <Button size="sm" variant="outline" className="text-xs">
                    Pending Approvals
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
