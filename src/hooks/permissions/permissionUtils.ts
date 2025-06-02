
import { UserRole } from '@/types/pharmaceutical';
import { hasHigherOrEqualRole } from '@/utils/roleMapping';
import { Permissions, EnhancedPermissions } from './types';
import { rolePermissions } from './rolePermissions';

/**
 * Get base permissions for a user role
 */
export const getBasePermissions = (userRole: UserRole): Permissions => {
  return rolePermissions[userRole] || rolePermissions['viewer'];
};

/**
 * Enhance permissions with computed access levels
 */
export const enhancePermissions = (basePermissions: Permissions, userRole: UserRole): EnhancedPermissions => {
  return {
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
};

/**
 * Check if user has a specific permission
 */
export const checkPermission = (permissions: Permissions, permission: keyof Permissions): boolean => {
  return permissions[permission] || false;
};

/**
 * Check if user has minimum required role
 */
export const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
  return hasHigherOrEqualRole(userRole, minimumRole);
};
