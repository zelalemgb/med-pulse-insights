
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementRecord } from './types';

export class UserQueryService {
  static async getAllProfiles(): Promise<any[]> {
    console.log('🔍 Fetching all profiles...');
    
    // Try the main profiles query first
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
      
      // If RLS is blocking, try to provide more specific error info
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('🔒 RLS policy is blocking access to profiles');
        
        // Check current user's role
        const { data: currentUserProfile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        
        console.log('Current user profile:', currentUserProfile);
        
        if (currentUserProfile?.role && !['national', 'regional', 'zonal'].includes(currentUserProfile.role)) {
          throw new Error(`Access denied. Your role (${currentUserProfile.role}) does not have permission to view all users. Contact a system administrator.`);
        }
      }
      
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  static async getPendingProfiles(): Promise<any[]> {
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

    return data || [];
  }

  static mapUsersToRecords(users: any[]): UserManagementRecord[] {
    return users.map(user => {
      console.log('Processing user:', { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        status: user.approval_status 
      });
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role as UserRole,
        facility_id: user.facility_id,
        department: user.department,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        approval_status: (user.approval_status || 'pending') as 'pending' | 'approved' | 'rejected',
        approved_by: user.approved_by,
        approved_at: user.approved_at,
        can_approve_associations: user.can_approve_associations,
        primary_facility_id: user.primary_facility_id,
        is_facility_owner: user.is_facility_owner,
        last_login_at: user.last_login_at,
        login_count: user.login_count,
        timezone: user.timezone,
        language: user.language
      };
    });
  }
}
