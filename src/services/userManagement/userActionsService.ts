
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { isValidPharmaceuticalRole } from '@/utils/roleMapping';

export class UserActionsService {
  static async getCurrentUser() {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      throw new Error('Not authenticated');
    }
    return currentUser.user;
  }

  static async validateUserManagementPermission(targetUserId: string, action: string): Promise<void> {
    const currentUser = await this.getCurrentUser();

    // Get current user's profile
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('role, facility_id, primary_facility_id')
      .eq('id', currentUser.id)
      .single();

    if (currentProfileError || !currentProfile) {
      throw new Error('Failed to get current user profile');
    }

    // Get target user's profile
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('role, facility_id, primary_facility_id')
      .eq('id', targetUserId)
      .single();

    if (targetProfileError || !targetProfile) {
      throw new Error('Failed to get target user profile');
    }

    // Validate roles are valid pharmaceutical roles
    if (!isValidPharmaceuticalRole(currentProfile.role)) {
      throw new Error(`Invalid current user role: ${currentProfile.role}`);
    }

    if (!isValidPharmaceuticalRole(targetProfile.role)) {
      throw new Error(`Invalid target user role: ${targetProfile.role}`);
    }

    // Validate hierarchical permissions
    const canManage = this.canManageUser(currentProfile.role as UserRole, targetProfile.role as UserRole);
    
    if (!canManage) {
      throw new Error(`Insufficient permissions: ${currentProfile.role} cannot ${action} ${targetProfile.role} users`);
    }
  }

  static canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
    const hierarchyMap: Record<UserRole, UserRole[]> = {
      'national': ['regional'],
      'regional': ['zonal'],
      'zonal': ['facility_manager', 'facility_officer'],
      'facility_manager': [],
      'facility_officer': [],
      'viewer': [],
      'qa': [],
      'procurement': [],
      'finance': [],
      'data_analyst': [],
      'program_manager': []
    };

    const managableRoles = hierarchyMap[currentUserRole] || [];
    return managableRoles.includes(targetUserRole);
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer'): Promise<void> {
    await this.validateUserManagementPermission(userId, 'approve');
    
    const currentUser = await this.getCurrentUser();

    const { error } = await supabase.rpc('approve_user', {
      _user_id: userId,
      _approved_by: currentUser.id,
      _new_role: newRole
    });

    if (error) {
      throw new Error(`Failed to approve user: ${error.message}`);
    }
  }

  static async rejectUser(userId: string, reason?: string): Promise<void> {
    await this.validateUserManagementPermission(userId, 'reject');
    
    const currentUser = await this.getCurrentUser();

    const { error } = await supabase.rpc('reject_user', {
      _user_id: userId,
      _rejected_by: currentUser.id,
      _reason: reason
    });

    if (error) {
      throw new Error(`Failed to reject user: ${error.message}`);
    }
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string): Promise<void> {
    await this.validateUserManagementPermission(userId, 'change role for');
    
    const currentUser = await this.getCurrentUser();

    // Additional validation: ensure the new role is manageable by current user
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (currentProfile && 
        isValidPharmaceuticalRole(currentProfile.role) && 
        !this.canManageUser(currentProfile.role as UserRole, newRole)) {
      throw new Error(`You cannot assign ${newRole} role`);
    }

    const { error } = await supabase.rpc('change_user_role', {
      _user_id: userId,
      _changed_by: currentUser.id,
      _new_role: newRole,
      _reason: reason
    });

    if (error) {
      throw new Error(`Failed to change user role: ${error.message}`);
    }
  }
}
