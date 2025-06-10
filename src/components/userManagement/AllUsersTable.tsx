
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAssignableRoles } from '@/hooks/useAssignableRoles';
import { RoleSelectionDialog } from './RoleSelectionDialog';
import { UserManagementRecord } from '@/services/userManagement/types';
import { UserRole } from '@/types/pharmaceutical';
import { Users, Calendar, Mail, Building, Settings, CheckCircle, XCircle } from 'lucide-react';
import { getRoleDisplayName } from '@/utils/roleMapping';

interface AllUsersTableProps {
  users: UserManagementRecord[];
  isLoading: boolean;
}

export const AllUsersTable: React.FC<AllUsersTableProps> = ({
  users,
  isLoading,
}) => {
  const { changeUserRole, isChangingRole } = useUserManagement();
  const assignableRoles = useAssignableRoles();
  const [roleChangeDialog, setRoleChangeDialog] = useState<{
    open: boolean;
    userId: string;
    userEmail: string;
    currentRole: string;
  }>({
    open: false,
    userId: '',
    userEmail: '',
    currentRole: '',
  });

  const handleChangeRole = (userId: string, userEmail: string, currentRole: string) => {
    setRoleChangeDialog({
      open: true,
      userId,
      userEmail,
      currentRole,
    });
  };

  const handleRoleChangeConfirm = (newRole: UserRole, reason?: string) => {
    changeUserRole({ 
      userId: roleChangeDialog.userId, 
      newRole,
      reason
    });
    setRoleChangeDialog({ open: false, userId: '', userEmail: '', currentRole: '' });
  };

  const getStatusBadge = (user: UserManagementRecord) => {
    if (user.approval_status === 'approved') {
      return (
        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    } else if (user.approval_status === 'rejected') {
      return (
        <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
          Pending
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-600">
              No users are available to manage at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className={`border-l-4 ${
            user.approval_status === 'approved' 
              ? 'border-l-green-500' 
              : user.approval_status === 'rejected'
              ? 'border-l-red-500'
              : 'border-l-yellow-500'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {user.full_name || 'No Name Provided'}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </div>
                    {getStatusBadge(user)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Role: {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    {user.department && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          Dept: {user.department}
                        </span>
                      </div>
                    )}
                    {user.last_login_at && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          Last Login: {new Date(user.last_login_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {user.approval_status === 'approved' && assignableRoles.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeRole(user.id, user.email, user.role)}
                      disabled={isChangingRole}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {isChangingRole ? 'Changing...' : 'Change Role'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoleSelectionDialog
        open={roleChangeDialog.open}
        onOpenChange={(open) => setRoleChangeDialog({ ...roleChangeDialog, open })}
        onConfirm={handleRoleChangeConfirm}
        title="Change User Role"
        description={`Change the role for ${roleChangeDialog.userEmail}. Current role: ${getRoleDisplayName(roleChangeDialog.currentRole as UserRole)}. You can only assign roles within your authority level.`}
        confirmText="Change Role"
        isLoading={isChangingRole}
      />
    </>
  );
};
