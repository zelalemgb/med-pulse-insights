
import { useCallback } from 'react';
import { UserRole } from '@/types/pharmaceutical';
import { UserProfile } from '@/types/auth';
import { AuthService } from '@/services/auth/authService';
import { ProfileService } from '@/services/auth/profileService';
import { isValidPharmaceuticalRole, mapSupabaseToPharmaceuticalRole } from '@/utils/roleMapping';
import { logger } from '@/utils/logger';

export const useAuthOperations = (
  profile: UserProfile | null,
  user: any,
  refreshProfile: () => Promise<void>
) => {
  const hasRole = useCallback((role: UserRole): boolean => {
    const hasRoleResult = profile?.role === role;
    logger.log(`🔍 Checking if user has role ${role}:`, hasRoleResult, 'Current role:', profile?.role);
    return hasRoleResult;
  }, [profile?.role]);

  const validateRole = useCallback((role: string): boolean => {
    const isValid = isValidPharmaceuticalRole(role);
    logger.log(`🔍 Validating role ${role}:`, isValid);
    return isValid;
  }, []);

  const updateUserRole = useCallback(async (userId: string, newRole: UserRole) => {
    const result = await ProfileService.updateUserRole(userId, newRole, profile, user?.id);
    
    // If updating own role, refresh profile
    if (result.error === null && userId === user?.id) {
      await refreshProfile();
    }

    return result;
  }, [profile, user?.id, refreshProfile]);

  const getEffectiveRoleForFacility = useCallback(async (userId: string, facilityId: string): Promise<UserRole | null> => {
    const supabaseRole = await AuthService.getEffectiveRoleForFacility(userId, facilityId);
    return supabaseRole ? mapSupabaseToPharmaceuticalRole(supabaseRole) : null;
  }, []);

  const hasFacilityRole = useCallback(async (facilityId: string, role: UserRole): Promise<boolean> => {
    if (!user) return false;

    try {
      const effectiveRole = await getEffectiveRoleForFacility(user.id, facilityId);
      return effectiveRole === role;
    } catch (error) {
      logger.error('💥 Error checking facility role:', error);
      return false;
    }
  }, [user, getEffectiveRoleForFacility]);

  return {
    hasRole,
    validateRole,
    updateUserRole,
    getEffectiveRoleForFacility,
    hasFacilityRole
  };
};
