
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';

interface Permissions {
  createProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;
  viewProducts: boolean;
  importData: boolean;
  exportData: boolean;
  viewAnalytics: boolean;
  dataAnalysis: boolean;
  systemIntegration: boolean;
  auditTrail: boolean;
  scenarioPlanning: boolean;
  manageUsers: boolean;
  viewReports: boolean;
  manageSystem: boolean;
}

const rolePermissions: Record<UserRole, Permissions> = {
  facility_officer: {
    createProducts: true,
    editProducts: true,
    deleteProducts: false,
    viewProducts: true,
    importData: true,
    exportData: true,
    viewAnalytics: false,
    dataAnalysis: false,
    systemIntegration: false,
    auditTrail: false,
    scenarioPlanning: false,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  facility_manager: {
    createProducts: true,
    editProducts: true,
    deleteProducts: true,
    viewProducts: true,
    importData: true,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: false,
    systemIntegration: false,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  zonal: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: true,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: true,
    viewReports: true,
    manageSystem: false,
  },
  regional: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: true,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: true,
    viewReports: true,
    manageSystem: true,
  },
  national: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: true,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: true,
    viewReports: true,
    manageSystem: true,
  },
  procurement: {
    createProducts: true,
    editProducts: true,
    deleteProducts: false,
    viewProducts: true,
    importData: true,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: false,
    systemIntegration: false,
    auditTrail: false,
    scenarioPlanning: true,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  finance: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: false,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  program_manager: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: true,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  qa: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: false,
    systemIntegration: false,
    auditTrail: true,
    scenarioPlanning: false,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
  data_analyst: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: true,
    viewAnalytics: true,
    dataAnalysis: true,
    systemIntegration: false,
    auditTrail: true,
    scenarioPlanning: true,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
  },
};

export const usePermissions = () => {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'facility_officer';
  const canAccess = rolePermissions[userRole];

  return {
    canAccess,
    userRole,
  };
};
