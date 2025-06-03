
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
import { Settings, Loader2 } from 'lucide-react';
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
      changeUserRole({ userId: selectedUser, newRole, reason });
      setSelectedUser(null);
      setReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration Date</TableHead>
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
                <Badge variant="outline">
                  {getRoleDisplayName(user.role)}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(user.approval_status)}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Dialog 
                  open={selectedUser === user.id} 
                  onOpenChange={(open) => setSelectedUser(open ? user.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">User: {user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Current Role: {getRoleDisplayName(user.role)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">New Role</label>
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
                        <label className="text-sm font-medium">Reason (optional)</label>
                        <Textarea
                          placeholder="Reason for role change"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
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
                        >
                          {isChangingRole ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
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
    </>
  );
};
