
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';

export class AuthValidationService {
  static async getCurrentUserInfo() {
    const { data: currentUser, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', currentUser.user?.email, 'Error:', userError);

    if (!currentUser.user) {
      console.error('❌ No authenticated user found');
      throw new Error('Authentication required');
    }

    return currentUser.user;
  }

  static async getCurrentUserProfile(userId: string) {
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Current user profile:', currentProfile, 'Error:', profileError);
    return { profile: currentProfile, error: profileError };
  }

  static async validateAuthUsers(profileUserIds: string[]) {
    try {
      console.log('🔍 Checking auth users vs profiles...');
      
      // Try to get auth users - this might fail in some environments
      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authResponse?.users && Array.isArray(authResponse.users)) {
        console.log('Auth users count:', authResponse.users.length);
        console.log('Profiles count:', profileUserIds.length);
        
        // Find users in auth but not in profiles
        const authUserIds = authResponse.users.map(u => u.id);
        const missingProfiles = authUserIds.filter(id => !profileUserIds.includes(id));
        
        if (missingProfiles.length > 0) {
          console.warn('⚠️ Users found in auth without profiles:', missingProfiles.length);
          console.log('Missing profile user IDs:', missingProfiles);
          
          await this.createMissingProfiles(missingProfiles, authResponse.users);
          return true; // Indicates profiles were created
        }
      } else if (authError) {
        console.log('Cannot access auth.admin.listUsers (expected in some environments):', authError.message);
      }
      
      return false; // No profiles were created
    } catch (err) {
      console.log('Auth users check failed (this may be normal):', err);
      return false;
    }
  }

  private static async createMissingProfiles(missingUserIds: string[], authUsers: any[]) {
    console.log('🔧 Creating missing profiles for users:', missingUserIds.length);
    
    for (const userId of missingUserIds) {
      const authUser = authUsers.find(u => u.id === userId);
      
      if (authUser?.id && authUser?.email) {
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
  }
}
