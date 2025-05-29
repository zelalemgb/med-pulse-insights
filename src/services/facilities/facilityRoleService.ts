
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

    // Log the role assignment
    await this.logRoleChange(user.id, userId, 'assign', 'facility_specific', undefined, role, facilityId);

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the current role before revoking for audit logging
    const { data: currentRole } = await supabase
      .from('facility_specific_roles')
      .select('user_id, facility_id, role')
      .eq('id', roleId)
      .single();

    const { error } = await supabase
      .from('facility_specific_roles')
      .update({ is_active: false })
      .eq('id', roleId);

    if (error) {
      throw new Error(`Failed to revoke facility role: ${error.message}`);
    }

    // Log the role revocation
    if (currentRole) {
      await this.logRoleChange(
        user.id,
        currentRole.user_id,
        'revoke',
        'facility_specific',
        mapSupabaseToPharmaceuticalRole(currentRole.role),
        undefined,
        currentRole.facility_id
      );
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

    // Log bulk assignment
    await this.logRoleChange(
      user.id,
      userIds[0], // Use first user as representative for bulk action
      'bulk_assign',
      'facility_specific',
      undefined,
      role,
      facilityId,
      `Bulk assigned to ${userIds.length} users`,
      { user_ids: userIds, total_users: userIds.length }
    );

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

  // Private method to log role changes
  private async logRoleChange(
    userId: string,
    targetUserId: string,
    action: string,
    roleType: string,
    oldRole?: UserRole,
    newRole?: UserRole,
    facilityId?: string,
    reason?: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const mappedOldRole = oldRole ? mapPharmaceuticalToSupabaseRole(oldRole) : undefined;
      const mappedNewRole = newRole ? mapPharmaceuticalToSupabaseRole(newRole) : undefined;

      await supabase.rpc('log_role_change', {
        _user_id: userId,
        _target_user_id: targetUserId,
        _action: action,
        _role_type: roleType,
        _old_role: mappedOldRole,
        _new_role: mappedNewRole,
        _facility_id: facilityId,
        _reason: reason,
        _metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          source: 'facility_role_service'
        }
      });
    } catch (error) {
      console.error('Failed to log role change:', error);
      // Don't throw here to avoid breaking the main operation
    }
  }

  // New method to log permission usage
  async logPermissionUsage(
    permissionName: string,
    resourceType: string,
    resourceId?: string,
    facilityId?: string,
    accessGranted: boolean = true,
    accessMethod: string = 'facility_role'
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    try {
      await supabase.rpc('log_permission_usage', {
        _user_id: user.id,
        _permission_name: permissionName,
        _resource_type: resourceType,
        _resource_id: resourceId,
        _facility_id: facilityId,
        _access_granted: accessGranted,
        _access_method: accessMethod,
        _conditions_met: {},
        _session_id: null
      });
    } catch (error) {
      console.error('Failed to log permission usage:', error);
    }
  }
}

export const facilityRoleService = new FacilityRoleService();
