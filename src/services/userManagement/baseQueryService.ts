
import { supabase } from '@/integrations/supabase/client';

export class BaseQueryService {
  static async getCurrentUserInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    return user;
  }

  static async getCurrentUserProfile(userId: string) {
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, facility_id, primary_facility_id')
      .eq('id', userId)
      .single();

    if (profileError || !currentProfile) {
      throw new Error('Failed to get user profile');
    }

    return currentProfile;
  }

  static async executeProfileQuery(query: any) {
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Database error in query:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }
}
