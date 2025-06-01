import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';
import { hasHigherOrEqualRole, ROLE_HIERARCHY } from '@/utils/roleMapping';

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
  manageFacilities: boolean;
  approveAssociations: boolean;
  manageRoles: boolean;
}

// Enhanced role permissions with proper hierarchy
const rolePermissions: Record<UserRole, Permissions> = {
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
  },
  facility_officer: {
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: false,
    manageRoles: false,
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
    manageFacilities: false,
    approveAssociations: true,
    manageRoles: false,
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
    manageFacilities: true,
    approveAssociations: true,
    manageRoles: true,
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
    manageFacilities: true,
    approveAssociations: true,
    manageRoles: true,
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
    manageFacilities: true,
    approveAssociations: true,
    manageRoles: true,
  },
};

export const usePermissions = () => {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'viewer';
  
  // Get base permissions for user's role
  const basePermissions = rolePermissions[userRole] || rolePermissions['viewer'];
  
  // Enhanced permission checking with hierarchy
  const canAccess = {
    ...basePermissions,
    // Additional computed permissions based on role hierarchy
    hasAdminAccess: hasHigherOrEqualRole(userRole, 'zonal'),
    hasManagerAccess: hasHigherOrEqualRole(userRole, 'facility_manager'),
    hasAnalystAccess: hasHigherOrEqualRole(userRole, 'data_analyst'),
    
    // Specific permission checks
    canCreateFacilities: ['national', 'regional', 'zonal'].includes(userRole),
    canManageGlobalRoles: ['national', 'regional', 'zonal'].includes(userRole),
    canViewAuditLogs: hasHigherOrEqualRole(userRole, 'qa'),
    canExportSensitiveData: hasHigherOrEqualRole(userRole, 'finance'),
  };

  // Helper functions for common permission checks
  const checkPermission = (permission: keyof Permissions): boolean => {
    return canAccess[permission] || false;
  };

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    return hasHigherOrEqualRole(userRole, minimumRole);
  };

  const getRoleLevel = (): number => {
    return ROLE_HIERARCHY[userRole] || 0;
  };

  return {
    canAccess,
    userRole,
    checkPermission,
    hasMinimumRole,
    getRoleLevel,
  };
};
