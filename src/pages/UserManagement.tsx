
import React from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserManagementPage } from '@/components/userManagement/UserManagementPage';

const UserManagement = () => {
  return (
    <RoleGuard 
      allowedRoles={['national', 'regional', 'zonal']}
      fallback={
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to access user management.
            </p>
          </div>
        </div>
      }
    >
      <UserManagementPage />
    </RoleGuard>
  );
};

export default UserManagement;
