
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
import { Settings, Loader2, Users } from 'lucide-react';
import { UserManagementRecord } from '@/services/userManagement/userManagementService';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserRole } from '@/types/pharmaceutical';
import { getRoleDisplayName } from '@/utils/roleMapping';

interface AllUsersTableProps {
  users: UserManagementRecord[];
  isLoading: boolean;
}

export const AllUsersTable: React.FC<AllUsersTableProps> = ({ users, isLoading }) => {
  const { changeUserRole, isChangingRole } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('facility_officer');
  const [reason, setReason] = useState('');

  const handleRoleChange = () => {
    if (selectedUser) {
      console.log('Changing role for user:', selectedUser, 'to:', newRole, 'reason:', reason);
      changeUserRole({ userId: selectedUser, newRole, reason });
      setSelectedUser(null);
      setReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const roleOptions: UserRole[] = [
    'facility_officer',
    'facility_manager',
    'qa',
    'procurement',
    'finance',
    'data_analyst',
    'program_manager',
    'zonal',
    'regional',
    'national',
    'viewer'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg border">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">No users have been registered in the system yet.</p>
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
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Registration Date</TableHead>
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
                <Badge variant="outline" className="font-medium">
                  {getRoleDisplayName(user.role)}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(user.approval_status)}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <Dialog 
                  open={selectedUser === user.id} 
                  onOpenChange={(open) => setSelectedUser(open ? user.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Current Role: {getRoleDisplayName(user.role)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {user.approval_status}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">New Role</label>
                        <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                          <SelectTrigger>
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
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                        <Textarea
                          placeholder="Reason for role change..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedUser(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRoleChange}
                          disabled={isChangingRole || newRole === user.role}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isChangingRole ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            'Change Role'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
