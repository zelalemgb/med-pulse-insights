
import { supabase } from '@/integrations/supabase/client';
import { FacilityRoleAssignment } from '@/types/facilityRoles';
import { UserRole } from '@/types/pharmaceutical';
import { mapSupabaseToPharmaceuticalRole } from '@/utils/roleMapping';

export class FacilityRoleQueries {
  // Get all roles for a specific facility
  async getFacilityRoles(facilityId: string): Promise<FacilityRoleAssignment[]> {
    const { data, error } = await supabase
      .from('facility_specific_roles')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .eq('facility_id', facilityId)
      .eq('is_active', true)
      .order('granted_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch facility roles: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      role: mapSupabaseToPharmaceuticalRole(item.role)
    })) as FacilityRoleAssignment[];
  }

  // Get all facility roles for a specific user
  async getUserFacilityRoles(userId: string): Promise<FacilityRoleAssignment[]> {
    const { data, error } = await supabase
      .from('facility_specific_roles')
      .select(`
        *,
        health_facilities (
          name,
          facility_type,
          region,
          zone
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('granted_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user facility roles: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      role: mapSupabaseToPharmaceuticalRole(item.role)
    })) as FacilityRoleAssignment[];
  }

  // Get effective role for a user at a specific facility
  async getEffectiveRole(userId: string, facilityId: string): Promise<UserRole | null> {
    const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
      _user_id: userId,
      _facility_id: facilityId
    });

    if (error) {
      throw new Error(`Failed to get effective role: ${error.message}`);
    }

    return data ? mapSupabaseToPharmaceuticalRole(data) : null;
  }
}

export const facilityRoleQueries = new FacilityRoleQueries();
