
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
import { Loader2, FileText } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { getRoleDisplayName } from '@/utils/roleMapping';

export const UserManagementLog: React.FC = () => {
  const { userManagementLog, isLoading } = useUserManagement();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'approve':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'reject':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'role_change':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Role Changed</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg border">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading activity log...</p>
        </div>
      </div>
    );
  }

  if (userManagementLog.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activity log entries</h3>
        <p className="text-gray-600">User management activities will appear here once actions are performed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
            <TableHead className="font-semibold">Admin</TableHead>
            <TableHead className="font-semibold">Target User</TableHead>
            <TableHead className="font-semibold">Changes</TableHead>
            <TableHead className="font-semibold">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userManagementLog.map((entry) => (
            <TableRow key={entry.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-600">
                    {new Date(entry.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getActionBadge(entry.action)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {entry.admin_profile?.full_name || 'Unknown Admin'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.admin_profile?.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {entry.target_profile?.full_name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.target_profile?.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm space-y-1">
                  {entry.old_status && entry.new_status && (
                    <div>
                      <span className="font-medium">Status:</span> {entry.old_status} → {entry.new_status}
                    </div>
                  )}
                  {entry.old_role && entry.new_role && (
                    <div>
                      <span className="font-medium">Role:</span> {getRoleDisplayName(entry.old_role)} → {getRoleDisplayName(entry.new_role)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {entry.reason && (
                  <div className="text-sm text-gray-600 max-w-xs">
                    <div className="truncate" title={entry.reason}>
                      {entry.reason}
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
