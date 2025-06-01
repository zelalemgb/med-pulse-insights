
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export class AuthService {
  static async signIn(email: string, password: string) {
    logger.log('🔐 Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('❌ Sign in error:', error);
    } else {
      logger.log('✅ Sign in successful');
    }

    return { data, error };
  }

  static async signUp(email: string, password: string, fullName?: string) {
    logger.log('📝 Attempting sign up for:', email);
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
      logger.error('❌ Sign up error:', error);
    } else {
      logger.log('✅ Sign up successful');
    }
    
    return { error };
  }

  static async signOut() {
    logger.log('🚪 Signing out...');
    await supabase.auth.signOut();
  }

  static async getEffectiveRoleForFacility(userId: string, facilityId: string) {
    try {
      const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
        _user_id: userId,
        _facility_id: facilityId
      });

      if (error) {
        logger.error('❌ Error getting effective role:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('💥 Error getting effective role:', error);
      return null;
    }
  }
}
