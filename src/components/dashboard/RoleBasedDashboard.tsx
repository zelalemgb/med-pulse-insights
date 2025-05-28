
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useUserAssociations } from '@/hooks/useHealthFacilities';
import FacilityOfficerDashboard from './FacilityOfficerDashboard';
import FacilityManagerDashboard from './FacilityManagerDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReportGenerator from '@/components/reporting/ReportGenerator';
import ReportTemplates from '@/components/reporting/ReportTemplates';
import RoleGuard from '@/components/auth/RoleGuard';
import { FacilitySpecificDashboard } from '@/components/facilities/FacilitySpecificDashboard';
import { Building } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  const { canAccess } = usePermissions();
  const { data: associations } = useUserAssociations();

  // Get user's primary facility
  const primaryFacility = associations?.find(a => a.association_type === 'owner') || 
                         associations?.find(a => a.approval_status === 'approved');

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
      case 'procurement':
      case 'finance':
      case 'qa':
        return <FacilityManagerDashboard />;
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

    // Add facility-specific tab if user has facility access
    if (primaryFacility) {
      tabs.splice(1, 0, {
        id: 'facility',
        label: 'My Facility',
        component: <FacilitySpecificDashboard facilityId={primaryFacility.facility_id} />
      });
    }

    // Add analytics tab for authorized roles
    if (canAccess.dataAnalysis) {
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
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
              {tab.id === 'facility' && <Building className="h-4 w-4 mr-2" />}
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
