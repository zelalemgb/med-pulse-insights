
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AdminUsersListProps {
  adminUsers: UserWithRole[];
  user: any;
  showCreateButton: boolean;
}

export const AdminUsersList = ({ adminUsers, user, showCreateButton }: AdminUsersListProps) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-orange-100 text-orange-800';
      case 'zonal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-2 flex items-center">
        <Users className="h-4 w-4 mr-2" />
        Current Admin Users ({adminUsers.length})
      </h4>
      
      {adminUsers.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">No admin users found</p>
          {showCreateButton && (
            <p className="text-green-600 text-sm font-medium">
              👆 Click "Create First Admin" above to get started!
            </p>
          )}
          {!user && (
            <p className="text-orange-600 text-sm font-medium">
              Please sign in first to create the first admin.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {adminUsers.map((adminUser) => (
            <div key={adminUser.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{adminUser.full_name || 'Unnamed User'}</div>
                <div className="text-sm text-gray-600">{adminUser.email}</div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(adminUser.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge className={getRoleBadgeColor(adminUser.role)}>
                {adminUser.role.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
