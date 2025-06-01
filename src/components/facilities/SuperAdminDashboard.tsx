
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePendingAssociations, useHealthFacilities } from '@/hooks/useHealthFacilities';
import { AdminStatsCards } from './dashboard/AdminStatsCards';
import { AdminTabsList } from './dashboard/AdminTabsList';
import { AdminTabsContent } from './dashboard/AdminTabsContent';
import { AccessDeniedCard } from './dashboard/AccessDeniedCard';

export const SuperAdminDashboard = () => {
  const { profile } = useAuth();
  const { data: pendingAssociations } = usePendingAssociations();
  const { data: facilities } = useHealthFacilities();

  const isAuthorized = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal' ||
    (profile as any)?.can_approve_associations;

  if (!isAuthorized) {
    return <AccessDeniedCard />;
  }

  const pendingCount = pendingAssociations?.length || 0;
  const totalFacilities = facilities?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
        <Badge variant="secondary" className="text-sm">
          {profile?.role?.toUpperCase()} ADMIN
        </Badge>
      </div>

      <AdminStatsCards 
        totalFacilities={totalFacilities} 
        pendingCount={pendingCount} 
      />

      <Tabs defaultValue="auth-testing" className="w-full">
        <AdminTabsList pendingCount={pendingCount} />
        <AdminTabsContent pendingCount={pendingCount} />
      </Tabs>
    </div>
  );
};
