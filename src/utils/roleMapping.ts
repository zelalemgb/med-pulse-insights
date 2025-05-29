
import { UserRole } from '@/types/pharmaceutical';
import { SupabaseUserRole } from '@/types/facilityRoles';

// Map Supabase roles to pharmaceutical roles with better national admin handling
export const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole): UserRole => {
  console.log('Role mapping - input:', supabaseRole);
  
  switch (supabaseRole) {
    case 'national':
      return 'national';
    case 'regional':
      return 'regional';
    case 'zonal':
      return 'zonal';
    case 'admin':
      return 'national'; // Legacy admin maps to national
    case 'manager':
      return 'facility_manager';
    case 'analyst':
      return 'data_analyst';
    case 'viewer':
      return 'viewer';
    default:
      console.warn(`Unmapped role: ${supabaseRole}, using facility_officer`);
      return 'facility_officer';
  }
};

// Map pharmaceutical roles to Supabase roles
export const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
  switch (pharmaceuticalRole) {
    case 'national':
      return 'national';
    case 'regional':
      return 'regional';
    case 'zonal':
      return 'zonal';
    case 'facility_manager':
      return 'manager';
    case 'data_analyst':
      return 'analyst';
    case 'viewer':
      return 'viewer';
    case 'facility_officer':
    case 'procurement':
    case 'finance':
    case 'program_manager':
    case 'qa':
    default:
      return 'viewer'; // Default mapping for roles not in Supabase
  }
};
