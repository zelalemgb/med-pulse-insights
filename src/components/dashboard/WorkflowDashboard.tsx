
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FacilityWorkflowDashboard from './workflow/FacilityWorkflowDashboard';
import ZonalWorkflowDashboard from './workflow/ZonalWorkflowDashboard';
import RegionalWorkflowDashboard from './workflow/RegionalWorkflowDashboard';
import NationalWorkflowDashboard from './workflow/NationalWorkflowDashboard';

const WorkflowDashboard = () => {
  const { profile } = useAuth();

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'facility_officer':
      case 'facility_manager':
        return <FacilityWorkflowDashboard />;
      case 'zonal':
        return <ZonalWorkflowDashboard />;
      case 'regional':
        return <RegionalWorkflowDashboard />;
      case 'national':
        return <NationalWorkflowDashboard />;
      default:
        return <FacilityWorkflowDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboard()}
    </div>
  );
};

export default WorkflowDashboard;
