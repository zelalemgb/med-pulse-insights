
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

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
    
    const roleHierarchy: UserRole[] = ['viewer', 'analyst', 'manager', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(profile.role);
    const minimumRoleIndex = roleHierarchy.indexOf(minimumRole);
    
    return userRoleIndex >= minimumRoleIndex;
  };

  const canAccess = {
    // Admin only
    userManagement: hasRole('admin'),
    systemSettings: hasRole('admin'),
    
    // Manager and above
    teamManagement: hasAnyRole(['admin', 'manager']),
    advancedReports: hasAnyRole(['admin', 'manager']),
    
    // Analyst and above
    dataAnalysis: hasAnyRole(['admin', 'manager', 'analyst']),
    customReports: hasAnyRole(['admin', 'manager', 'analyst']),
    
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
