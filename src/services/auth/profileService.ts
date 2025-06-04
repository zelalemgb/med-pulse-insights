
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserProfile } from '@/types/auth';
import { Database } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import { 
  mapSupabaseToPharmaceuticalRole, 
  mapPharmaceuticalToSupabaseRole,
  isValidPharmaceuticalRole 
} from '@/utils/roleMapping';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

export class ProfileService {
  static async fetchUserProfile(userId: string, userEmail?: string): Promise<UserProfile | null> {
    try {
      logger.log(`🔍 Fetching profile for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        logger.error('❌ Error fetching profile:', error);
        return null;
      }

      if (!data) {
        logger.log('⚠️ No profile found for user:', userId);
        
        // Create a default profile if none exists
        logger.log('🔧 Creating default profile for user');
        return {
          id: userId,
          email: userEmail || '',
          full_name: null,
          role: 'viewer',
          facility_id: null,
          department: null,
          is_active: true
        };
      }

      logger.log('📋 Raw profile data from database:', data);

      // Enhanced role mapping with validation
      let pharmaceuticalRole: UserRole;
      if (data.role && typeof data.role === 'string') {
        pharmaceuticalRole = mapSupabaseToPharmaceuticalRole(data.role as SupabaseUserRole);
      } else {
        logger.warn('⚠️ Invalid or missing role in profile, defaulting to viewer');
        pharmaceuticalRole = 'viewer';
      }

      // Double-check role validity
      if (!isValidPharmaceuticalRole(pharmaceuticalRole)) {
        logger.warn(`⚠️ Invalid pharmaceutical role: ${pharmaceuticalRole}, using viewer`);
        pharmaceuticalRole = 'viewer';
      }
      
      const pharmaceuticalProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: pharmaceuticalRole,
        facility_id: data.facility_id,
        department: data.department,
        is_active: data.is_active
      };

      logger.log('✅ Final mapped pharmaceutical profile:', pharmaceuticalProfile);
      logger.log(`🎯 User role confirmed as: ${pharmaceuticalRole}`);
      
      return pharmaceuticalProfile;
    } catch (error) {
      logger.error('💥 Unexpected error fetching profile:', error);
      return null;
    }
  }

  static async updateUserRole(userId: string, newRole: UserRole, currentUserProfile: UserProfile | null, currentUserId?: string) {
    // Enhanced validation
    if (!isValidPharmaceuticalRole(newRole)) {
      logger.error(`❌ Invalid role: ${newRole}`);
      return { error: { message: `Invalid role: ${newRole}` } };
    }

    // Enhanced permission check
    if (!currentUserProfile || !['national', 'regional', 'zonal'].includes(currentUserProfile.role)) {
      logger.error('❌ Insufficient permissions to change user roles');
      return { error: { message: 'Insufficient permissions to change user roles' } };
    }

    try {
      logger.log(`🔄 Updating user ${userId} role to ${newRole}`);
      
      // Convert pharmaceutical role to Supabase role for database update
      const supabaseRole = mapPharmaceuticalToSupabaseRole(newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: supabaseRole })
        .eq('id', userId);

      if (error) {
        logger.error('❌ Error updating user role:', error);
        return { error };
      }

      logger.log('✅ User role updated successfully');
      return { error: null };
    } catch (error) {
      logger.error('💥 Unexpected error updating user role:', error);
      return { error };
    }
  }

  static async updateProfile(userId: string, updates: Partial<Pick<UserProfile, 'full_name' | 'department'>>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        return { data: null, error };
      }

      return { data: data as UserProfile, error: null };
    } catch (error) {
      console.error('💥 Unexpected error updating profile:', error);
      return { data: null, error };
    }
  }
}
