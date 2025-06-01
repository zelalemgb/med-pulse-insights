
import { UserRole } from '@/types/pharmaceutical';
import { SupabaseUserRole } from '@/types/facilityRoles';

// Enhanced role hierarchy for proper validation
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'viewer': 1,
  'facility_officer': 2,
  'qa': 3,
  'procurement': 4,
  'finance': 5,
  'data_analyst': 6,
  'program_manager': 7,
  'facility_manager': 8,
  'zonal': 9,
  'regional': 10,
  'national': 11
};

// All valid pharmaceutical roles
export const VALID_PHARMACEUTICAL_ROLES: UserRole[] = [
  'facility_officer',
  'facility_manager',
  'zonal',
  'regional',
  'national',
  'procurement',
  'finance',
  'program_manager',
  'qa',
  'data_analyst',
  'viewer'
];

// All valid Supabase roles
export const VALID_SUPABASE_ROLES: SupabaseUserRole[] = [
  'national',
  'regional', 
  'zonal',
  'admin',
  'manager',
  'analyst',
  'viewer'
];

// Enhanced mapping with better fallback handling - Complete mapping for all SupabaseUserRole values
export const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole): UserRole => {
  console.log('🔄 Role mapping - Supabase role:', supabaseRole);
  
  if (!supabaseRole) {
    console.warn('⚠️ No Supabase role provided, defaulting to viewer');
    return 'viewer';
  }

  // Complete mapping that includes all valid SupabaseUserRole values
  const roleMap: Partial<Record<SupabaseUserRole, UserRole>> = {
    'national': 'national',
    'regional': 'regional',
    'zonal': 'zonal',
    'admin': 'national', // Legacy admin maps to national
    'manager': 'facility_manager',
    'analyst': 'data_analyst',
    'viewer': 'viewer'
  };

  const mappedRole = roleMap[supabaseRole];
  if (!mappedRole) {
    console.warn(`⚠️ Unmapped Supabase role: ${supabaseRole}, defaulting to facility_officer`);
    return 'facility_officer';
  }

  console.log('✅ Role mapped successfully:', supabaseRole, '->', mappedRole);
  return mappedRole;
};

// Enhanced reverse mapping with complete coverage
export const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
  console.log('🔄 Reverse mapping - Pharmaceutical role:', pharmaceuticalRole);
  
  if (!pharmaceuticalRole) {
    console.warn('⚠️ No pharmaceutical role provided, defaulting to viewer');
    return 'viewer';
  }

  const reverseMap: Record<UserRole, SupabaseUserRole> = {
    'national': 'national',
    'regional': 'regional',
    'zonal': 'zonal',
    'facility_manager': 'manager',
    'data_analyst': 'analyst',
    'viewer': 'viewer',
    'facility_officer': 'viewer', // Map to viewer in Supabase
    'procurement': 'viewer',
    'finance': 'viewer',
    'program_manager': 'analyst', // Map to analyst for better permissions
    'qa': 'viewer'
  };

  const mappedRole = reverseMap[pharmaceuticalRole];
  console.log('✅ Reverse mapping successful:', pharmaceuticalRole, '->', mappedRole);
  return mappedRole;
};

// Role validation functions
export const isValidPharmaceuticalRole = (role: string): role is UserRole => {
  return VALID_PHARMACEUTICAL_ROLES.includes(role as UserRole);
};

export const isValidSupabaseRole = (role: string): role is SupabaseUserRole => {
  return VALID_SUPABASE_ROLES.includes(role as SupabaseUserRole);
};

// Role hierarchy comparison
export const hasHigherOrEqualRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    'facility_officer': 'Facility Officer',
    'facility_manager': 'Facility Manager',
    'zonal': 'Zonal Administrator',
    'regional': 'Regional Administrator',
    'national': 'National Administrator',
    'procurement': 'Procurement Officer',
    'finance': 'Finance Officer',
    'program_manager': 'Program Manager',
    'qa': 'Quality Assurance',
    'data_analyst': 'Data Analyst',
    'viewer': 'Viewer'
  };
  
  return displayNames[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

// Check if role can manage other roles
export const canManageRoles = (userRole: UserRole): boolean => {
  return ['national', 'regional', 'zonal'].includes(userRole);
};

// Check if role can approve associations
export const canApproveAssociations = (userRole: UserRole): boolean => {
  return ['national', 'regional', 'zonal', 'facility_manager'].includes(userRole);
};

// Get roles that a user can assign to others
export const getAssignableRoles = (userRole: UserRole): UserRole[] => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  
  return VALID_PHARMACEUTICAL_ROLES.filter(role => {
    const roleLevel = ROLE_HIERARCHY[role] || 0;
    return roleLevel < userLevel; // Can only assign lower-level roles
  });
};
