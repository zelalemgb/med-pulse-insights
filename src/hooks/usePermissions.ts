
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
    
    // Define hierarchy for pharmaceutical roles
    const roleHierarchy: UserRole[] = [
      'facility_officer', 
      'facility_manager', 
      'zonal', 
      'regional', 
      'national', 
      'data_analyst',
      'program_manager',
      'procurement',
      'finance',
      'qa'
    ];
    
    const userRoleIndex = roleHierarchy.indexOf(profile.role);
    const minimumRoleIndex = roleHierarchy.indexOf(minimumRole);
    
    return userRoleIndex >= minimumRoleIndex;
  };

  const canAccess = {
    // National and Program Manager only
    userManagement: hasAnyRole(['national', 'program_manager']),
    systemSettings: hasAnyRole(['national', 'program_manager']),
    
    // Regional and above
    teamManagement: hasAnyRole(['national', 'regional', 'program_manager']),
    advancedReports: hasAnyRole(['national', 'regional', 'zonal', 'program_manager']),
    
    // Data analysts and managers
    dataAnalysis: hasAnyRole(['data_analyst', 'program_manager', 'national', 'regional', 'zonal']),
    customReports: hasAnyRole(['data_analyst', 'program_manager', 'national', 'regional', 'zonal', 'facility_manager']),
    
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
