
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
    
    // Check if user has admin privileges
    if (currentProfile && !['national', 'regional', 'zonal'].includes(currentProfile.role)) {
      console.warn('⚠️ User does not have admin privileges:', currentProfile.role);
    }
    
    return { profile: currentProfile, error: profileError };
  }

  static async validateAuthUsers(profileUserIds: string[]) {
    try {
      console.log('🔍 Checking for missing profiles...');
      
      // Since we can't access auth.admin.listUsers, we'll focus on ensuring
      // all users in the profiles table are properly handled
      console.log('📊 Current profiles count:', profileUserIds.length);
      
      // Instead of trying to access auth users, we'll check if there are any
      // profiles that might need attention (like missing fields)
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
        // We could fix these, but for now just log them
        incompleteProfiles.forEach(profile => {
          console.log('Incomplete profile:', profile.id, profile.email);
        });
      }
      
      return false; // No profiles were created
    } catch (err) {
      console.log('Profile validation check failed:', err);
      return false;
    }
  }
}
