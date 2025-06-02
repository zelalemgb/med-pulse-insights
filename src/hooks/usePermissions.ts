
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';
import { ROLE_HIERARCHY } from '@/utils/roleMapping';
import { Permissions } from './permissions/types';
import { getBasePermissions, enhancePermissions, checkPermission, hasMinimumRole } from './permissions/permissionUtils';

export const usePermissions = () => {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'viewer';
  
  // Get base permissions for user's role
  const basePermissions = getBasePermissions(userRole);
  
  // Enhanced permission checking with hierarchy
  const canAccess = enhancePermissions(basePermissions, userRole);

  // Helper functions for common permission checks
  const checkUserPermission = (permission: keyof Permissions): boolean => {
    return checkPermission(basePermissions, permission);
  };

  const hasUserMinimumRole = (minimumRole: UserRole): boolean => {
    return hasMinimumRole(userRole, minimumRole);
  };

  const getRoleLevel = (): number => {
    return ROLE_HIERARCHY[userRole] || 0;
  };

  return {
    canAccess,
    userRole,
    checkPermission: checkUserPermission,
    hasMinimumRole: hasUserMinimumRole,
    getRoleLevel,
  };
};
