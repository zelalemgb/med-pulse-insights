
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { getRoleDisplayName } from '@/utils/roleMapping';

export const UserManagementLog: React.FC = () => {
  const { userManagementLog, isLoading } = useUserManagement();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'approve':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'reject':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'role_change':
        return <Badge className="bg-blue-100 text-blue-800">Role Changed</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (userManagementLog.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No activity log entries found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Admin</TableHead>
          <TableHead>Target User</TableHead>
          <TableHead>Changes</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userManagementLog.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              {new Date(entry.created_at).toLocaleString()}
            </TableCell>
            <TableCell>{getActionBadge(entry.action)}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {entry.admin_profile?.full_name || 'Unknown'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.admin_profile?.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {entry.target_profile?.full_name || 'Unknown'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.target_profile?.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {entry.old_status && entry.new_status && (
                  <div>Status: {entry.old_status} → {entry.new_status}</div>
                )}
                {entry.old_role && entry.new_role && (
                  <div>
                    Role: {getRoleDisplayName(entry.old_role)} → {getRoleDisplayName(entry.new_role)}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {entry.reason && (
                <div className="text-sm text-muted-foreground max-w-xs truncate">
                  {entry.reason}
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
