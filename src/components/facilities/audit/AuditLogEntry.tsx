
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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

interface AuditLogEntryProps {
  entry: AuditLogEntryData;
  getActionBadgeVariant: (action: string) => "default" | "destructive" | "secondary" | "outline";
}

export const AuditLogEntry: React.FC<AuditLogEntryProps> = ({
  entry,
  getActionBadgeVariant
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant={getActionBadgeVariant(entry.action)}>
              {entry.action.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {entry.role_type}
            </Badge>
            {entry.health_facilities && (
              <Badge variant="secondary">
                {entry.health_facilities.name}
              </Badge>
            )}
          </div>
          
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Administrator:</span>{' '}
              {entry.profiles?.full_name || entry.profiles?.email}
            </div>
            <div>
              <span className="font-medium">Target User:</span>{' '}
              {entry.target_profiles?.full_name || entry.target_profiles?.email}
            </div>
            {entry.old_role && (
              <div>
                <span className="font-medium">Role Change:</span>{' '}
                <span className="text-red-600">{entry.old_role}</span>
                {' → '}
                <span className="text-green-600">{entry.new_role}</span>
              </div>
            )}
            {entry.reason && (
              <div>
                <span className="font-medium">Reason:</span> {entry.reason}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right text-xs text-gray-500">
          <div>{format(new Date(entry.created_at), 'MMM d, yyyy')}</div>
          <div>{format(new Date(entry.created_at), 'h:mm a')}</div>
        </div>
      </div>
    </div>
  );
};
