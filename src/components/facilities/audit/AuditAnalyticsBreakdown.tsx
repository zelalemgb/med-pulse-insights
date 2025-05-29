
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuditAnalytics {
  changes_by_action: Record<string, number>;
  changes_by_role: Record<string, number>;
}

interface AuditAnalyticsBreakdownProps {
  analytics: AuditAnalytics | undefined;
}

export const AuditAnalyticsBreakdown: React.FC<AuditAnalyticsBreakdownProps> = ({
  analytics
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

  if (!analytics || Object.keys(analytics.changes_by_action || {}).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Changes by Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analytics.changes_by_action).map(([action, count]) => (
              <div key={action} className="flex justify-between items-center">
                <Badge variant={getActionBadgeVariant(action)}>
                  {action.toUpperCase()}
                </Badge>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(analytics.changes_by_role).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center">
                <Badge variant="outline">
                  {role?.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
