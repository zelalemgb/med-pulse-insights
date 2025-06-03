
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
    console.log('🔍 Fetching all users with comprehensive debugging...');
    
    // Get current user info for debugging
    const { data: currentUser, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', currentUser.user?.email, 'Error:', userError);

    if (!currentUser.user) {
      console.error('❌ No authenticated user found');
      throw new Error('Authentication required');
    }

    // Check current user's profile and permissions
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.user.id)
      .single();

    console.log('Current user profile:', currentProfile, 'Error:', profileError);

    // Try to fetch all profiles with detailed logging
    console.log('🔍 Attempting to fetch all profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Query results:');
    console.log('- Data:', data);
    console.log('- Error:', error);
    console.log('- Data length:', data?.length || 0);

    if (error) {
      console.error('❌ Database error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // If it's a permission error, try to check RLS policies
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('🔒 This appears to be a Row Level Security (RLS) issue');
        console.log('Current user role:', currentProfile?.role);
        console.log('Current user is_active:', currentProfile?.is_active);
        
        // Try a different approach - check if we can query specific records
        const { data: sampleData, error: sampleError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .limit(5);
        
        console.log('Sample query results:', sampleData, 'Error:', sampleError);
      }
      
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No users found in profiles table');
      
      // Let's check if there are users in auth.users but not in profiles
      console.log('🔍 Checking for potential data inconsistencies...');
      
      // Try to get auth users count - using the correct approach for auth.admin.listUsers()
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        console.log('Auth users data attempt:', authData?.users?.length || 0, 'Error:', authError);
      } catch (err) {
        console.log('Error accessing auth.admin.listUsers:', err);
      }
    }

    // Map the data to ensure type compatibility
    const mappedUsers = (data || []).map(user => {
      console.log('Processing user:', { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        status: user.approval_status 
      });
      
      return {
        ...user,
        role: user.role as UserRole,
        approval_status: (user.approval_status || 'pending') as 'pending' | 'approved' | 'rejected'
      };
    });

    console.log('✅ Final mapped users:', mappedUsers.length, 'users');
    console.log('User details:', mappedUsers.map(u => ({ 
      email: u.email, 
      status: u.approval_status, 
      role: u.role,
      active: u.is_active 
    })));
    
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
      console.log('📝 No log entries found');
      return [];
    }

    // Get unique user IDs
    const adminUserIds = [...new Set(logData.map(entry => entry.admin_user_id))];
    const targetUserIds = [...new Set(logData.map(entry => entry.target_user_id))];
    const allUserIds = [...new Set([...adminUserIds, ...targetUserIds])];

    console.log('Fetching profiles for log entries:', allUserIds.length, 'unique users');

    // Fetch profile data for all users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', allUserIds);

    if (profilesError) {
      console.error('Database error fetching profiles for log:', profilesError);
      throw new Error(`Failed to fetch user profiles: ${profilesError.message}`);
    }

    console.log('Profiles for log:', profilesData);

    // Create a map for quick profile lookup
    const profilesMap = new Map(
      (profilesData || []).map(profile => [profile.id, profile])
    );

    // Combine log data with profile data
    const enrichedLog = logData.map(entry => ({
      ...entry,
      old_role: entry.old_role as UserRole | null,
      new_role: entry.new_role as UserRole | null,
      admin_profile: profilesMap.get(entry.admin_user_id) || { full_name: 'Unknown', email: 'Unknown' },
      target_profile: profilesMap.get(entry.target_user_id) || { full_name: 'Unknown', email: 'Unknown' }
    }));

    console.log('✅ Enriched log entries:', enrichedLog.length);
    return enrichedLog;
  }
}
