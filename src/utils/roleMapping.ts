
import { UserRole } from '@/types/pharmaceutical';
import { SupabaseUserRole } from '@/types/facilityRoles';

// Map Supabase roles to pharmaceutical roles
export const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole): UserRole => {
  switch (supabaseRole) {
    case 'admin':
      return 'national';
    case 'manager':
      return 'facility_manager';
    case 'analyst':
      return 'data_analyst';
    case 'viewer':
      return 'viewer';
    case 'zonal':
      return 'zonal';
    case 'regional':
      return 'regional';
    case 'national':
      return 'national';
    default:
      return 'facility_officer';
  }
};

// Map pharmaceutical roles to Supabase roles
export const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
  switch (pharmaceuticalRole) {
    case 'national':
      return 'national';
    case 'facility_manager':
      return 'manager';
    case 'data_analyst':
      return 'analyst';
    case 'viewer':
      return 'viewer';
    case 'zonal':
      return 'zonal';
    case 'regional':
      return 'regional';
    case 'facility_officer':
    case 'procurement':
    case 'finance':
    case 'program_manager':
    case 'qa':
    default:
      return 'viewer'; // Default mapping for roles not in Supabase
  }
};
