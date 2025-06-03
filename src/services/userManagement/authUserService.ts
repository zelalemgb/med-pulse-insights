
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';

export class AuthUserService {
  static async createMissingProfiles(missingUserIds: string[], authUsers: any[]) {
    console.log('🔧 Creating missing profiles for users:', missingUserIds.length);
    
    for (const userId of missingUserIds) {
      const authUser = authUsers.find(u => u.id === userId);
      
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
  }

  static async checkAuthUsers(profileUserIds: string[]) {
    try {
      console.log('🔍 Checking auth users vs profiles...');
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
}
