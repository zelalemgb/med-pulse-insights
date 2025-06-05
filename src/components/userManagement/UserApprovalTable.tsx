
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAssignableRoles } from '@/hooks/useAssignableRoles';
import { RoleSelectionDialog } from './RoleSelectionDialog';
import { UserManagementRecord } from '@/services/userManagement/types';
import { UserRole } from '@/types/pharmaceutical';
import { UserCheck, UserX, Calendar, Mail, Building } from 'lucide-react';
import { getRoleDisplayName } from '@/utils/roleMapping';

interface UserApprovalTableProps {
  users: UserManagementRecord[];
  isLoading: boolean;
}

export const UserApprovalTable: React.FC<UserApprovalTableProps> = ({
  users,
  isLoading,
}) => {
  const { approveUser, rejectUser, isApproving, isRejecting } = useUserManagement();
  const assignableRoles = useAssignableRoles();
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    userId: string;
    userEmail: string;
  }>({
    open: false,
    userId: '',
    userEmail: '',
  });

  const handleApprove = (userId: string, userEmail: string) => {
    setApprovalDialog({
      open: true,
      userId,
      userEmail,
    });
  };

  const handleApprovalConfirm = (role: UserRole, reason?: string) => {
    approveUser({ 
      userId: approvalDialog.userId, 
      newRole: role 
    });
    setApprovalDialog({ open: false, userId: '', userEmail: '' });
  };

  const handleReject = (userId: string) => {
    rejectUser({ userId, reason: 'Application rejected' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
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
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Approvals
            </h3>
            <p className="text-gray-600">
              All user registrations have been processed.
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
          <Card key={user.id} className="border-l-4 border-l-yellow-500">
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
                    <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                      Pending Approval
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Registered: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Current Role: {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    {user.department && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          Department: {user.department}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id, user.email)}
                    disabled={isApproving || isRejecting || assignableRoles.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(user.id)}
                    disabled={isApproving || isRejecting}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RoleSelectionDialog
        open={approvalDialog.open}
        onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}
        onConfirm={handleApprovalConfirm}
        title="Approve User Registration"
        description={`Select the role to assign to ${approvalDialog.userEmail}. You can only assign roles that are within your authority level.`}
        confirmText="Approve User"
        isLoading={isApproving}
      />
    </>
  );
};
