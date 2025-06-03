
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';

export interface UserManagementRecord {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  approved_by: string | null;
  approved_at: string | null;
}

export interface UserManagementLogEntry {
  id: string;
  admin_user_id: string;
  target_user_id: string;
  action: string;
  old_status: string | null;
  new_status: string | null;
  old_role: UserRole | null;
  new_role: UserRole | null;
  reason: string | null;
  created_at: string;
  admin_profile?: {
    full_name: string | null;
    email: string;
  };
  target_profile?: {
    full_name: string | null;
    email: string;
  };
}

export class UserManagementService {
  static async getAllUsers(): Promise<UserManagementRecord[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  static async getPendingUsers(): Promise<UserManagementRecord[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pending users: ${error.message}`);
    }

    return data || [];
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer'): Promise<void> {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase.rpc('approve_user', {
      _user_id: userId,
      _approved_by: currentUser.user.id,
      _new_role: newRole
    });

    if (error) {
      throw new Error(`Failed to approve user: ${error.message}`);
    }
  }

  static async rejectUser(userId: string, reason?: string): Promise<void> {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase.rpc('reject_user', {
      _user_id: userId,
      _rejected_by: currentUser.user.id,
      _reason: reason
    });

    if (error) {
      throw new Error(`Failed to reject user: ${error.message}`);
    }
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string): Promise<void> {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase.rpc('change_user_role', {
      _user_id: userId,
      _changed_by: currentUser.user.id,
      _new_role: newRole,
      _reason: reason
    });

    if (error) {
      throw new Error(`Failed to change user role: ${error.message}`);
    }
  }

  static async getUserManagementLog(): Promise<UserManagementLogEntry[]> {
    const { data, error } = await supabase
      .from('user_management_log')
      .select(`
        *,
        admin_profile:profiles!admin_user_id(full_name, email),
        target_profile:profiles!target_user_id(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(`Failed to fetch user management log: ${error.message}`);
    }

    return data || [];
  }
}
