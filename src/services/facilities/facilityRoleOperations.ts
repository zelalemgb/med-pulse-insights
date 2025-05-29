
import { supabase } from '@/integrations/supabase/client';
import { FacilityRoleAssignment, BulkRoleAssignmentResult } from '@/types/facilityRoles';
import { UserRole } from '@/types/pharmaceutical';
import { mapSupabaseToPharmaceuticalRole, mapPharmaceuticalToSupabaseRole } from '@/utils/roleMapping';
import { roleAuditService } from './roleAuditService';

export class FacilityRoleOperations {
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
    await roleAuditService.logRoleChange(user.id, userId, 'assign', 'facility_specific', undefined, role, facilityId);

    return {
      ...data,
      role: mapSupabaseToPharmaceuticalRole(data.role)
    } as FacilityRoleAssignment;
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
      await roleAuditService.logRoleChange(
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
    await roleAuditService.logRoleChange(
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
}

export const facilityRoleOperations = new FacilityRoleOperations();
