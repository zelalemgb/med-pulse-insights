
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { ProfileService } from '@/services/auth/profileService';

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
    
    // Check if user has admin privileges
    if (currentProfile && !['national', 'regional', 'zonal'].includes(currentProfile.role)) {
      console.warn('⚠️ User does not have admin privileges:', currentProfile.role);
      throw new Error(`Access denied. Your role (${currentProfile.role}) does not have permission to view all users. Contact a system administrator.`);
    }
    
    return { profile: currentProfile, error: profileError };
  }

  static async validateAuthUsers(profileUserIds: string[]) {
    try {
      console.log('🔍 Checking profiles data consistency...');
      console.log('📊 Current profiles count:', profileUserIds.length);

      const { data: authData, error: authError } = await supabase.functions.invoke('list-users');

      if (authError) {
        console.log('Error fetching auth users:', authError);
        return false;
      }

      const authUsers = authData?.users || [];
      const missingAuthUsers = authUsers.filter(u => !profileUserIds.includes(u.id));

      if (missingAuthUsers.length > 0) {
        console.log('➕ Creating profiles for auth users missing profiles:', missingAuthUsers.length);
        for (const user of missingAuthUsers) {
          await ProfileService.createProfile(
            user.id,
            user.email ?? '',
            (user.user_metadata as any)?.full_name ?? null
          );
        }
        return true;
      }

      // Check if there are any profiles that might need attention (like missing fields)
      const { data: incompleteProfiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .or('full_name.is.null,email.is.null');
      
      if (error) {
        console.log('Error checking incomplete profiles:', error);
        return false;
      }
      
      if (incompleteProfiles && incompleteProfiles.length > 0) {
        console.log('⚠️ Found profiles with missing data:', incompleteProfiles.length);
        incompleteProfiles.forEach(profile => {
          console.log('Incomplete profile:', profile.id, profile.email);
        });
      }
      
      return false; // No profiles were created, just validated
    } catch (err) {
      console.log('Profile validation check failed:', err);
      return false;
    }
  }
}
