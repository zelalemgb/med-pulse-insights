
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementRecord } from './types';

export class UserOperationsService {
  static async getAllUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching all users...');
    
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

    // Try to fetch all profiles
    console.log('🔍 Fetching all profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Profiles query results:');
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
      
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('🔒 This appears to be a Row Level Security (RLS) issue');
        console.log('Current user role:', currentProfile?.role);
        console.log('Current user is_active:', currentProfile?.is_active);
      }
      
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    // Check for users in auth who might not have profiles
    try {
      console.log('🔍 Checking auth users vs profiles...');
      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authResponse?.users && Array.isArray(authResponse.users)) {
        console.log('Auth users count:', authResponse.users.length);
        console.log('Profiles count:', data?.length || 0);
        
        // Find users in auth but not in profiles
        const authUserIds = authResponse.users.map(u => u.id);
        const profileUserIds = (data || []).map(p => p.id);
        const missingProfiles = authUserIds.filter(id => !profileUserIds.includes(id));
        
        if (missingProfiles.length > 0) {
          console.warn('⚠️ Users found in auth without profiles:', missingProfiles.length);
          console.log('Missing profile user IDs:', missingProfiles);
          
          // Attempt to create missing profiles
          for (const userId of missingProfiles) {
            const authUser = authResponse.users.find(u => u.id === userId);
            if (authUser && authUser.id && authUser.email) {
              console.log('🔧 Creating missing profile for user:', authUser.email);
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: authUser.id,
                  email: authUser.email,
                  full_name: authUser.user_metadata?.full_name || '',
                  role: 'facility_officer' as UserRole,
                  approval_status: 'pending',
                  is_active: true,
                  created_at: authUser.created_at
                });
              
              if (insertError) {
                console.error('❌ Failed to create profile for user:', authUser.email, insertError);
              } else {
                console.log('✅ Created profile for user:', authUser.email);
              }
            }
          }
          
          // Re-fetch profiles after creating missing ones
          const { data: updatedData, error: refetchError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!refetchError && updatedData) {
            console.log('✅ Re-fetched profiles after creating missing ones:', updatedData.length);
            return this.mapUsersToRecords(updatedData);
          }
        }
      } else if (authError) {
        console.log('Cannot access auth.admin.listUsers (expected in some environments):', authError.message);
      }
    } catch (err) {
      console.log('Auth users check failed (this may be normal):', err);
    }

    return this.mapUsersToRecords(data || []);
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

    return this.mapUsersToRecords(data || []);
  }

  private static mapUsersToRecords(users: any[]): UserManagementRecord[] {
    return users.map(user => {
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
}
