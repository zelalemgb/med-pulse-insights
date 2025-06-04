
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserProfile } from '@/types/auth';
import { Database } from '@/integrations/supabase/types';
import { 
  mapSupabaseToPharmaceuticalRole, 
  mapPharmaceuticalToSupabaseRole,
  isValidPharmaceuticalRole 
} from '@/utils/roleMapping';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

export class ProfileService {
  static async fetchUserProfile(userId: string, userEmail?: string): Promise<UserProfile | null> {
    try {
      console.log(`🔍 Fetching profile for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      if (!data) {
        console.log('⚠️ No profile found for user:', userId);
        
        // Create a default profile if none exists
        console.log('🔧 Creating default profile for user');
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

      console.log('📋 Raw profile data from database:', data);

      // Enhanced role mapping with validation
      let pharmaceuticalRole: UserRole;
      if (data.role && typeof data.role === 'string') {
        pharmaceuticalRole = mapSupabaseToPharmaceuticalRole(data.role as SupabaseUserRole);
      } else {
        console.warn('⚠️ Invalid or missing role in profile, defaulting to viewer');
        pharmaceuticalRole = 'viewer';
      }

      // Double-check role validity
      if (!isValidPharmaceuticalRole(pharmaceuticalRole)) {
        console.warn(`⚠️ Invalid pharmaceutical role: ${pharmaceuticalRole}, using viewer`);
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

      console.log('✅ Final mapped pharmaceutical profile:', pharmaceuticalProfile);
      console.log(`🎯 User role confirmed as: ${pharmaceuticalRole}`);
      
      return pharmaceuticalProfile;
    } catch (error) {
      console.error('💥 Unexpected error fetching profile:', error);
      return null;
    }
  }

  static async createProfile(userId: string, email: string, fullName?: string | null) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName ?? null,
          role: 'viewer',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          approval_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        return { data: null, error };
      }

      return { data: data as UserProfile, error: null };
    } catch (error) {
      console.error('💥 Unexpected error creating profile:', error);
      return { data: null, error };
    }
  }

  static async updateUserRole(userId: string, newRole: UserRole, currentUserProfile: UserProfile | null, currentUserId?: string) {
    // Enhanced validation
    if (!isValidPharmaceuticalRole(newRole)) {
      console.error(`❌ Invalid role: ${newRole}`);
      return { error: { message: `Invalid role: ${newRole}` } };
    }

    // Enhanced permission check
    if (!currentUserProfile || !['national', 'regional', 'zonal'].includes(currentUserProfile.role)) {
      console.error('❌ Insufficient permissions to change user roles');
      return { error: { message: 'Insufficient permissions to change user roles' } };
    }

    try {
      console.log(`🔄 Updating user ${userId} role to ${newRole}`);
      
      // Convert pharmaceutical role to Supabase role for database update
      const supabaseRole = mapPharmaceuticalToSupabaseRole(newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: supabaseRole })
        .eq('id', userId);

      if (error) {
        console.error('❌ Error updating user role:', error);
        return { error };
      }

      console.log('✅ User role updated successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected error updating user role:', error);
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
