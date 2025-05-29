
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Shield } from 'lucide-react';

interface AuditAnalytics {
  total_changes: number;
  most_active_admins?: Array<{
    user_id: string;
    changes_made: number;
  }>;
  changes_by_action: Record<string, number>;
}

interface AuditAnalyticsOverviewProps {
  analytics: AuditAnalytics | undefined;
  isLoading: boolean;
}

export const AuditAnalyticsOverview: React.FC<AuditAnalyticsOverviewProps> = ({
  analytics,
  isLoading
}) => {
  if (isLoading || !analytics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{analytics.total_changes}</p>
              <p className="text-xs text-gray-600">Total Role Changes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{analytics.most_active_admins?.length || 0}</p>
              <p className="text-xs text-gray-600">Active Administrators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">
                {Object.keys(analytics.changes_by_action || {}).length}
              </p>
              <p className="text-xs text-gray-600">Action Types</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
