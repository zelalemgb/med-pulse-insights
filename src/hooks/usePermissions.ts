
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';

export const usePermissions = () => {
  const { profile } = useAuth();

  const hasRole = (requiredRole: UserRole): boolean => {
    return profile?.role === requiredRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return profile ? roles.includes(profile.role) : false;
  };

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!profile) return false;
    
    // Define hierarchy for pharmaceutical roles (higher index = higher privilege)
    const roleHierarchy: UserRole[] = [
      'facility_officer',    // Level 0 - Lowest
      'facility_manager',    // Level 1
      'data_analyst',        // Level 2
      'zonal',              // Level 3
      'regional',           // Level 4
      'national',           // Level 5 - Highest
      'procurement',        // Level 2 (same as data_analyst)
      'finance',            // Level 2 (same as data_analyst)
      'program_manager',    // Level 4 (same as regional)
      'qa'                  // Level 2 (same as data_analyst)
    ];
    
    const userRoleIndex = roleHierarchy.indexOf(profile.role);
    const minimumRoleIndex = roleHierarchy.indexOf(minimumRole);
    
    return userRoleIndex >= minimumRoleIndex;
  };

  const canAccess = {
    // National only
    userManagement: hasAnyRole(['national']),
    systemSettings: hasAnyRole(['national']),
    
    // Regional and above (includes national)
    teamManagement: hasAnyRole(['national', 'regional', 'program_manager']),
    advancedReports: hasAnyRole(['national', 'regional', 'zonal', 'program_manager']),
    
    // Zonal and above
    zonalReports: hasAnyRole(['national', 'regional', 'zonal', 'program_manager']),
    
    // Data analysts and managers
    dataAnalysis: hasAnyRole(['data_analyst', 'program_manager', 'national', 'regional', 'zonal']),
    customReports: hasAnyRole(['data_analyst', 'program_manager', 'national', 'regional', 'zonal', 'facility_manager']),
    
    // Facility level and above
    facilityReports: hasAnyRole(['facility_manager', 'zonal', 'regional', 'national', 'program_manager']),
    
    // All authenticated users
    basicDashboard: true,
    viewReports: true,
  };

  return {
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    canAccess,
    currentRole: profile?.role,
  };
};
