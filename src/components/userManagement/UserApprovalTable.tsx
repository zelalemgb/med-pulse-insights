
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
import { Check, X, Loader2 } from 'lucide-react';
import { UserManagementRecord } from '@/services/userManagement/userManagementService';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserRole } from '@/types/pharmaceutical';
import { getRoleDisplayName } from '@/utils/roleMapping';

interface UserApprovalTableProps {
  users: UserManagementRecord[];
  isLoading: boolean;
}

export const UserApprovalTable: React.FC<UserApprovalTableProps> = ({ users, isLoading }) => {
  const { approveUser, rejectUser, isApproving, isRejecting } = useUserManagement();
  const [selectedRole, setSelectedRole] = useState<Record<string, UserRole>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [openRejectDialog, setOpenRejectDialog] = useState<string | null>(null);

  const handleApprove = (userId: string) => {
    const role = selectedRole[userId] || 'facility_officer';
    approveUser({ userId, newRole: role });
  };

  const handleReject = (userId: string) => {
    const reason = rejectReason[userId];
    rejectUser({ userId, reason });
    setOpenRejectDialog(null);
    setRejectReason(prev => ({ ...prev, [userId]: '' }));
  };

  const roleOptions: UserRole[] = [
    'facility_officer',
    'facility_manager',
    'qa',
    'procurement',
    'finance',
    'data_analyst',
    'program_manager',
    'viewer'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No pending user approvals
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Assign Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.full_name || 'No name provided'}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Select
                value={selectedRole[user.id] || 'facility_officer'}
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
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
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Are you sure you want to reject {user.email}?</p>
                      <Textarea
                        placeholder="Reason for rejection (optional)"
                        value={rejectReason[user.id] || ''}
                        onChange={(e) =>
                          setRejectReason(prev => ({ ...prev, [user.id]: e.target.value }))
                        }
                      />
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
                            <Loader2 className="h-4 w-4 animate-spin" />
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
  );
};
