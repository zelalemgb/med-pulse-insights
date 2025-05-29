
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { AuditLogEntry } from './AuditLogEntry';

interface AuditLogEntryData {
  id: string;
  action: string;
  role_type: string;
  old_role?: string;
  new_role?: string;
  reason?: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  target_profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  health_facilities?: {
    name: string;
  } | null;
}

interface AuditLogListProps {
  auditLog: AuditLogEntryData[] | undefined;
  isLoading: boolean;
}

export const AuditLogList: React.FC<AuditLogListProps> = ({
  auditLog,
  isLoading
}) => {
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'assign': return 'default';
      case 'revoke': return 'destructive';
      case 'modify': return 'secondary';
      case 'bulk_assign': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Role Change Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading audit log...</div>
        ) : auditLog && auditLog.length > 0 ? (
          <div className="space-y-3">
            {auditLog.map((entry) => (
              <AuditLogEntry
                key={entry.id}
                entry={entry}
                getActionBadgeVariant={getActionBadgeVariant}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No audit entries found for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
