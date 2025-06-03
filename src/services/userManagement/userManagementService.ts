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
    console.log('🔍 Fetching all users with current user context...');
    
    // Get current user info for debugging
    const { data: currentUser } = await supabase.auth.getUser();
    console.log('Current user:', currentUser.user?.email);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Raw profiles data:', data);
    console.log('Query error:', error);

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    // Map the data to ensure type compatibility
    const mappedUsers = (data || []).map(user => ({
      ...user,
      role: user.role as UserRole,
      approval_status: (user.approval_status || 'pending') as 'pending' | 'approved' | 'rejected'
    }));

    console.log('Mapped users count:', mappedUsers.length);
    return mappedUsers;
  }

  static async getPendingUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching pending users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    console.log('Pending users raw data:', data);
    console.log('Pending users query error:', error);

    if (error) {
      console.error('Database error fetching pending users:', error);
      throw new Error(`Failed to fetch pending users: ${error.message}`);
    }

    // Map the data to ensure type compatibility
    const mappedUsers = (data || []).map(user => ({
      ...user,
      role: user.role as UserRole,
      approval_status: (user.approval_status || 'pending') as 'pending' | 'approved' | 'rejected'
    }));

    console.log('Mapped pending users count:', mappedUsers.length);
    return mappedUsers;
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
    console.log('🔍 Fetching user management log...');
    
    // Fetch log entries first
    const { data: logData, error: logError } = await supabase
      .from('user_management_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    console.log('Log data:', logData);
    console.log('Log query error:', logError);

    if (logError) {
      console.error('Database error fetching log:', logError);
      throw new Error(`Failed to fetch user management log: ${logError.message}`);
    }

    if (!logData || logData.length === 0) {
      return [];
    }

    // Get unique user IDs
    const adminUserIds = [...new Set(logData.map(entry => entry.admin_user_id))];
    const targetUserIds = [...new Set(logData.map(entry => entry.target_user_id))];
    const allUserIds = [...new Set([...adminUserIds, ...targetUserIds])];

    // Fetch profile data for all users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', allUserIds);

    if (profilesError) {
      console.error('Database error fetching profiles for log:', profilesError);
      throw new Error(`Failed to fetch user profiles: ${profilesError.message}`);
    }

    // Create a map for quick profile lookup
    const profilesMap = new Map(
      (profilesData || []).map(profile => [profile.id, profile])
    );

    // Combine log data with profile data
    return logData.map(entry => ({
      ...entry,
      old_role: entry.old_role as UserRole | null,
      new_role: entry.new_role as UserRole | null,
      admin_profile: profilesMap.get(entry.admin_user_id) || { full_name: 'Unknown', email: 'Unknown' },
      target_profile: profilesMap.get(entry.target_user_id) || { full_name: 'Unknown', email: 'Unknown' }
    }));
  }
}
