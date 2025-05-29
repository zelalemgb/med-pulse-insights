
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { Database } from '@/integrations/supabase/types';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

interface FacilityRoleAssignment {
  id: string;
  user_id: string;
  facility_id: string;
  role: UserRole;
  granted_by: string | null;
  granted_at: string;
  is_active: boolean;
}

// Map Supabase roles to pharmaceutical roles
const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole): UserRole => {
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
const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
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

export class FacilityRoleService {
  // Assign a role to a user for a specific facility
  async assignFacilityRole(
    userId: string,
    facilityId: string,
    role: UserRole,
    grantedBy?: string
  ): Promise<FacilityRoleAssignment> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const supabaseRole = mapPharmaceuticalToSupabaseRole(role);

    const { data, error } = await supabase
      .from('facility_specific_roles')
      .insert({
        user_id: userId,
        facility_id: facilityId,
        role: supabaseRole,
        granted_by: grantedBy || user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('User already has this role for this facility');
      }
      throw new Error(`Failed to assign facility role: ${error.message}`);
    }

    return {
      ...data,
      role: mapSupabaseToPharmaceuticalRole(data.role)
    } as FacilityRoleAssignment;
  }

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

  // Get all roles for a specific user
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

  // Get effective role for user at facility (with inheritance)
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

  // Revoke a facility role
  async revokeFacilityRole(roleId: string): Promise<void> {
    const { error } = await supabase
      .from('facility_specific_roles')
      .update({ is_active: false })
      .eq('id', roleId);

    if (error) {
      throw new Error(`Failed to revoke facility role: ${error.message}`);
    }
  }

  // Bulk assign roles to multiple users for a facility
  async bulkAssignRoles(
    userIds: string[],
    facilityId: string,
    role: UserRole
  ): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const supabaseRole = mapPharmaceuticalToSupabaseRole(role);

    const { data, error } = await supabase.rpc('bulk_assign_facility_roles', {
      _user_ids: userIds,
      _facility_id: facilityId,
      _role: supabaseRole,
      _granted_by: user.id
    });

    if (error) {
      throw new Error(`Failed to bulk assign roles: ${error.message}`);
    }

    return data as number;
  }

  // Check if user can manage roles for a facility
  async canManageFacilityRoles(facilityId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Check if user is super admin
    const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
      user_uuid: user.id
    });

    if (isSuperAdmin) {
      return true;
    }

    // Check if user is facility owner
    const { data: hasAccess } = await supabase.rpc('user_has_facility_access', {
      _user_id: user.id,
      _facility_id: facilityId,
      _required_type: 'owner'
    });

    return hasAccess || false;
  }
}

export const facilityRoleService = new FacilityRoleService();
