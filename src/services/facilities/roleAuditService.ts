
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { RoleChangeLogEntry } from '@/types/facilityRoles';
import { mapPharmaceuticalToSupabaseRole } from '@/utils/roleMapping';

export class RoleAuditService {
  // Log role changes for audit trail
  async logRoleChange(
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
}

export const roleAuditService = new RoleAuditService();
