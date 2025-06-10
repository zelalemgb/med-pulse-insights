
import { useMemo } from 'react';
import { UserRole } from '@/types/pharmaceutical';
import { useAuth } from '@/contexts/AuthContext';
import { getAssignableRoles, getRoleDisplayName } from '@/utils/roleMapping';

export const useAssignableRoles = () => {
  const { profile } = useAuth();

  const assignableRoles = useMemo(() => {
    if (!profile?.role) {
      return [];
    }

    const roles = getAssignableRoles(profile.role as UserRole);
    
    return roles.map(role => ({
      value: role,
      label: getRoleDisplayName(role),
      description: getRoleDescription(role)
    }));
  }, [profile?.role]);

  return assignableRoles;
};

const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    'facility_officer': 'Basic facility operations and data entry',
    'facility_manager': 'Full facility management and oversight',
    'zonal': 'Zone-level administration and coordination',
    'regional': 'Regional oversight and management',
    'national': 'National-level administration',
    'procurement': 'Procurement and supply chain operations',
    'finance': 'Financial oversight and budget management',
    'program_manager': 'Program coordination and management',
    'qa': 'Quality assurance and compliance',
    'data_analyst': 'Data analysis and reporting',
    'viewer': 'Read-only access to system data'
  };
  
  return descriptions[role] || 'Standard user access';
};
