
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart3, Eye } from 'lucide-react';
import RoleGuard from '@/components/auth/RoleGuard';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();

  const getRoleConfig = () => {
    switch (profile?.role) {
      case 'admin':
        return {
          title: 'Administrator Dashboard',
          icon: Shield,
          color: 'text-red-600 bg-red-100',
          features: ['Full system access', 'User management', 'System configuration', 'All analytics'],
        };
      case 'manager':
        return {
          title: 'Manager Dashboard',
          icon: Users,
          color: 'text-blue-600 bg-blue-100',
          features: ['Team oversight', 'Advanced analytics', 'Inventory management', 'Reporting'],
        };
      case 'analyst':
        return {
          title: 'Analyst Dashboard',
          icon: BarChart3,
          color: 'text-green-600 bg-green-100',
          features: ['Data analysis', 'Consumption patterns', 'Forecasting', 'Custom reports'],
        };
      case 'viewer':
        return {
          title: 'Viewer Dashboard',
          icon: Eye,
          color: 'text-gray-600 bg-gray-100',
          features: ['Basic analytics', 'Read-only access', 'Standard reports'],
        };
      default:
        return {
          title: 'Dashboard',
          icon: Shield,
          color: 'text-gray-600 bg-gray-100',
          features: ['Limited access'],
        };
    }
  };

  const roleConfig = getRoleConfig();
  const IconComponent = roleConfig.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleConfig.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{roleConfig.title}</h2>
              <p className="text-sm text-gray-600">
                Welcome back, {profile?.full_name || 'User'}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Your Access Level</h3>
              <ul className="space-y-1">
                {roleConfig.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Account Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Role:</span> {profile?.role}</p>
                <p><span className="font-medium">Department:</span> {profile?.department || 'Not assigned'}</p>
                <p><span className="font-medium">Facility:</span> {profile?.facility_id || 'Not assigned'}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-1 ${profile?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific dashboard sections */}
      <RoleGuard allowedRoles={['admin']}>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Admin Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Advanced administrative features would go here.</p>
          </CardContent>
        </Card>
      </RoleGuard>

      <RoleGuard allowedRoles={['admin', 'manager']}>
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Management Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Management-level features accessible to admins and managers.</p>
          </CardContent>
        </Card>
      </RoleGuard>

      <RoleGuard allowedRoles={['admin', 'manager', 'analyst']}>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Analytics Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Advanced analytics available to analysts and above.</p>
          </CardContent>
        </Card>
      </RoleGuard>
    </div>
  );
};

export default RoleBasedDashboard;
