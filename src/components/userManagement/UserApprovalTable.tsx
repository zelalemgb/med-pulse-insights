
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Loader2, Clock } from 'lucide-react';
import { UserManagementRecord } from '@/services/userManagement/userManagementService';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserRole } from '@/types/pharmaceutical';
import { getRoleDisplayName } from '@/utils/roleMapping';
import { useAuth } from '@/contexts/AuthContext';

interface UserApprovalTableProps {
  users: UserManagementRecord[];
  isLoading: boolean;
}

export const UserApprovalTable: React.FC<UserApprovalTableProps> = ({ users, isLoading }) => {
  const { approveUser, rejectUser, isApproving, isRejecting } = useUserManagement();
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Record<string, UserRole>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [openRejectDialog, setOpenRejectDialog] = useState<string | null>(null);

  const handleApprove = (userId: string) => {
    const role = selectedRole[userId] || getDefaultRoleForUserLevel();
    console.log('Approving user:', userId, 'with role:', role);
    approveUser({ userId, newRole: role });
  };

  const handleReject = (userId: string) => {
    const reason = rejectReason[userId];
    console.log('Rejecting user:', userId, 'with reason:', reason);
    rejectUser({ userId, reason });
    setOpenRejectDialog(null);
    setRejectReason(prev => ({ ...prev, [userId]: '' }));
  };

  // Get appropriate role options based on current user's role
  const getAvailableRoles = (): UserRole[] => {
    switch (profile?.role) {
      case 'national':
        return ['regional'];
      case 'regional':
        return ['zonal'];
      case 'zonal':
        return ['facility_officer', 'facility_manager'];
      default:
        return ['facility_officer'];
    }
  };

  const getDefaultRoleForUserLevel = (): UserRole => {
    switch (profile?.role) {
      case 'national':
        return 'regional';
      case 'regional':
        return 'zonal';
      case 'zonal':
        return 'facility_officer';
      default:
        return 'facility_officer';
    }
  };

  const roleOptions = getAvailableRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg border">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading pending users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border">
        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
        <p className="text-gray-600">
          All user registration requests in your jurisdiction have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Registration Date</TableHead>
            <TableHead className="font-semibold">Assign Role</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {user.full_name || 'No name provided'}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <Select
                  value={selectedRole[user.id] || getDefaultRoleForUserLevel()}
                  onValueChange={(value: UserRole) =>
                    setSelectedRole(prev => ({ ...prev, [user.id]: value }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id)}
                    disabled={isApproving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  
                  <Dialog 
                    open={openRejectDialog === user.id} 
                    onOpenChange={(open) => setOpenRejectDialog(open ? user.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isRejecting}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject User Registration</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Are you sure you want to reject the registration for{' '}
                          <span className="font-semibold">{user.email}</span>?
                        </p>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Reason for rejection (optional)
                          </label>
                          <Textarea
                            placeholder="Provide a reason for rejection..."
                            value={rejectReason[user.id] || ''}
                            onChange={(e) =>
                              setRejectReason(prev => ({ ...prev, [user.id]: e.target.value }))
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setOpenRejectDialog(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(user.id)}
                            disabled={isRejecting}
                          >
                            {isRejecting ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              'Reject User'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
