
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';
import { 
  hasHigherOrEqualRole,
  canManageRoles,
  canApproveAssociations,
  getAssignableRoles,
  isValidPharmaceuticalRole
} from '@/utils/roleMapping';

export const useRoleValidation = () => {
  const { profile } = useAuth();

  const currentRole = profile?.role || 'viewer';

  const validation = {
    // Basic role checks
    hasRole: (role: UserRole): boolean => {
      return currentRole === role;
    },

    // Hierarchy checks
    hasMinimumRole: (minimumRole: UserRole): boolean => {
      return hasHigherOrEqualRole(currentRole, minimumRole);
    },

    // Administrative capabilities
    canManageRoles: (): boolean => {
      return canManageRoles(currentRole);
    },

    canApproveAssociations: (): boolean => {
      return canApproveAssociations(currentRole);
    },

    canAssignRole: (targetRole: UserRole): boolean => {
      const assignableRoles = getAssignableRoles(currentRole);
      return assignableRoles.includes(targetRole);
    },

    // Specific permission checks
    canCreateFacilities: (): boolean => {
      return ['national', 'regional', 'zonal'].includes(currentRole);
    },

    canViewSystemAnalytics: (): boolean => {
      return hasHigherOrEqualRole(currentRole, 'data_analyst');
    },

    canManageUsers: (): boolean => {
      return hasHigherOrEqualRole(currentRole, 'zonal');
    },

    canAccessAdminDashboard: (): boolean => {
      return hasHigherOrEqualRole(currentRole, 'zonal');
    },

    canModifySystemSettings: (): boolean => {
      return hasHigherOrEqualRole(currentRole, 'regional');
    },

    // Validation utilities
    isValidRole: (role: string): role is UserRole => {
      return isValidPharmaceuticalRole(role);
    },

    getCurrentRole: (): UserRole => {
      return currentRole;
    },

    getAssignableRoles: (): UserRole[] => {
      return getAssignableRoles(currentRole);
    },

    // Role comparison
    isHigherRoleThan: (otherRole: UserRole): boolean => {
      return hasHigherOrEqualRole(currentRole, otherRole) && currentRole !== otherRole;
    },

    isSameRoleAs: (otherRole: UserRole): boolean => {
      return currentRole === otherRole;
    },

    // Role context helpers
    isAdministrator: (): boolean => {
      return ['national', 'regional', 'zonal'].includes(currentRole);
    },

    isFacilityLevel: (): boolean => {
      return ['facility_officer', 'facility_manager'].includes(currentRole);
    },

    isSpecialist: (): boolean => {
      return ['data_analyst', 'program_manager', 'procurement', 'finance', 'qa'].includes(currentRole);
    },

    isSystemLevel: (): boolean => {
      return ['national', 'regional'].includes(currentRole);
    }
  };

  return validation;
};
