
import { supabase } from '@/integrations/supabase/client';

export class AuthService {
  static async signIn(email: string, password: string) {
    console.log('🔐 Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
    } else {
      console.log('✅ Sign in successful');
    }
    
    return { error };
  }

  static async signUp(email: string, password: string, fullName?: string) {
    console.log('📝 Attempting sign up for:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('❌ Sign up error:', error);
    } else {
      console.log('✅ Sign up successful');
    }
    
    return { error };
  }

  static async signOut() {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
  }

  static async getEffectiveRoleForFacility(userId: string, facilityId: string) {
    try {
      const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
        _user_id: userId,
        _facility_id: facilityId
      });

      if (error) {
        console.error('❌ Error getting effective role:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('💥 Error getting effective role:', error);
      return null;
    }
  }
}
