
import { supabase } from '@/integrations/supabase/client';
import { UserManagementRecord } from './types';

export class UserDataService {
  static async fetchAllProfiles(): Promise<any[]> {
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
      }
      
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  static async fetchPendingProfiles(): Promise<any[]> {
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
        ...user,
        role: user.role,
        approval_status: (user.approval_status || 'pending') as 'pending' | 'approved' | 'rejected'
      };
    });
  }
}
