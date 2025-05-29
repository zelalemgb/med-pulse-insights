
import { supabase } from '@/integrations/supabase/client';

export class RolePermissionService {
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

  // Log permission usage
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

export const rolePermissionService = new RolePermissionService();
