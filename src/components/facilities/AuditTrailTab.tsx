
import React, { useState } from 'react';
import { useRoleAuditLog, useRoleAuditAnalytics } from '@/hooks/useRoleAudit';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { AuditAnalyticsOverview } from './audit/AuditAnalyticsOverview';
import { AuditSearchFilters } from './audit/AuditSearchFilters';
import { AuditLogList } from './audit/AuditLogList';
import { AuditAnalyticsBreakdown } from './audit/AuditAnalyticsBreakdown';

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
      <AuditAnalyticsOverview analytics={analytics} isLoading={analyticsLoading} />
      
      <AuditSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <AuditLogList auditLog={filteredAuditLog} isLoading={logLoading} />

      <AuditAnalyticsBreakdown analytics={analytics} />
    </div>
  );
};
