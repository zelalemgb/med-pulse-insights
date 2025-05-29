
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoleAuditLog, useRoleAuditAnalytics } from '@/hooks/useRoleAudit';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { Calendar, Users, TrendingUp, Shield, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';

interface AuditTrailTabProps {
  facilityId?: string;
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({ facilityId }) => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data: facilities } = useHealthFacilities();
  const { data: auditLog, isLoading: logLoading } = useRoleAuditLog(facilityId);
  const { data: analytics, isLoading: analyticsLoading } = useRoleAuditAnalytics(dateRange.start, dateRange.end);

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'assign': return 'default';
      case 'revoke': return 'destructive';
      case 'modify': return 'secondary';
      case 'bulk_assign': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredAuditLog = auditLog?.filter(entry => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.profiles?.email?.toLowerCase().includes(searchLower) ||
      entry.target_profiles?.email?.toLowerCase().includes(searchLower) ||
      entry.action.toLowerCase().includes(searchLower) ||
      entry.new_role?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
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
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Users/Actions</Label>
              <Input
                id="search"
                placeholder="Search by email, action, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  start: e.target.value ? new Date(e.target.value) : undefined 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  end: e.target.value ? new Date(e.target.value) : undefined 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Role Change Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logLoading ? (
            <div className="text-center py-8">Loading audit log...</div>
          ) : filteredAuditLog && filteredAuditLog.length > 0 ? (
            <div className="space-y-3">
              {filteredAuditLog.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No audit entries found for the selected criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Breakdown */}
      {analytics && Object.keys(analytics.changes_by_action || {}).length > 0 && (
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
      )}
    </div>
  );
};
