
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
  advancedReports: boolean;
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
    advancedReports: false,
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
    advancedReports: true,
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
    advancedReports: true,
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
    advancedReports: true,
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
    advancedReports: true,
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
    advancedReports: false,
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
    advancedReports: true,
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
    advancedReports: true,
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
    advancedReports: false,
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
    advancedReports: true,
  },
  // Added missing viewer role with basic permissions
  viewer: {
    createProducts: false,
    editProducts: false,
    deleteProducts: false,
    viewProducts: true,
    importData: false,
    exportData: false,
    viewAnalytics: false,
    dataAnalysis: false,
    systemIntegration: false,
    auditTrail: false,
    scenarioPlanning: false,
    manageUsers: false,
    viewReports: true,
    manageSystem: false,
    advancedReports: false,
  },
};

export const usePermissions = () => {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'viewer';
  const canAccess = rolePermissions[userRole] || rolePermissions['viewer'];

  return {
    canAccess,
    userRole,
  };
};
