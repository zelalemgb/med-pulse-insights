
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import FacilityOfficerDashboard from './FacilityOfficerDashboard';
import FacilityManagerDashboard from './FacilityManagerDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReportGenerator from '@/components/reporting/ReportGenerator';
import ReportTemplates from '@/components/reporting/ReportTemplates';
import RoleGuard from '@/components/auth/RoleGuard';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  const { canAccess } = usePermissions();

  const getDashboardComponent = () => {
    if (!profile?.role) return <FacilityOfficerDashboard />;

    switch (profile.role) {
      case 'facility_manager':
      case 'zonal':
      case 'regional':
      case 'national':
        return <FacilityManagerDashboard />;
      case 'data_analyst':
      case 'program_manager':
        return <AnalyticsDashboard />;
      default:
        return <FacilityOfficerDashboard />;
    }
  };

  const getAvailableTabs = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', component: getDashboardComponent() },
      { id: 'reports', label: 'Reports', component: <ReportGenerator /> },
      { id: 'templates', label: 'Templates', component: <ReportTemplates /> }
    ];

    // Add analytics tab for authorized roles
    if (canAccess.dataAnalysis || ['data_analyst', 'program_manager', 'national', 'regional'].includes(profile?.role || '')) {
      tabs.push({
        id: 'analytics',
        label: 'Advanced Analytics',
        component: <AnalyticsDashboard />
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.id === 'analytics' ? (
              <RoleGuard allowedRoles={['data_analyst', 'program_manager', 'national', 'regional', 'zonal']}>
                {tab.component}
              </RoleGuard>
            ) : (
              tab.component
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RoleBasedDashboard;
