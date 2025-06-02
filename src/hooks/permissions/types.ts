
export interface Permissions {
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

export interface EnhancedPermissions extends Permissions {
  hasAdminAccess: boolean;
  hasManagerAccess: boolean;
  hasAnalystAccess: boolean;
  canCreateFacilities: boolean;
  canManageGlobalRoles: boolean;
  canViewAuditLogs: boolean;
  canExportSensitiveData: boolean;
}
