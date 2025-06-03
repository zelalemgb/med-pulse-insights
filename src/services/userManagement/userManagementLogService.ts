
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementLogEntry } from './types';

export class UserManagementLogService {
  static async getUserManagementLog(): Promise<UserManagementLogEntry[]> {
    console.log('🔍 Fetching user management log...');
    
    // Fetch log entries first
    const { data: logData, error: logError } = await supabase
      .from('user_management_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    console.log('Log data:', logData);
    console.log('Log query error:', logError);

    if (logError) {
      console.error('Database error fetching log:', logError);
      throw new Error(`Failed to fetch user management log: ${logError.message}`);
    }

    if (!logData || logData.length === 0) {
      console.log('📝 No log entries found');
      return [];
    }

    // Get unique user IDs
    const adminUserIds = [...new Set(logData.map(entry => entry.admin_user_id))];
    const targetUserIds = [...new Set(logData.map(entry => entry.target_user_id))];
    const allUserIds = [...new Set([...adminUserIds, ...targetUserIds])];

    console.log('Fetching profiles for log entries:', allUserIds.length, 'unique users');

    // Fetch profile data for all users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', allUserIds);

    if (profilesError) {
      console.error('Database error fetching profiles for log:', profilesError);
      throw new Error(`Failed to fetch user profiles: ${profilesError.message}`);
    }

    console.log('Profiles for log:', profilesData);

    // Create a map for quick profile lookup
    const profilesMap = new Map(
      (profilesData || []).map(profile => [profile.id, profile])
    );

    // Combine log data with profile data
    const enrichedLog = logData.map(entry => ({
      ...entry,
      old_role: entry.old_role as UserRole | null,
      new_role: entry.new_role as UserRole | null,
      admin_profile: profilesMap.get(entry.admin_user_id) || { full_name: 'Unknown', email: 'Unknown' },
      target_profile: profilesMap.get(entry.target_user_id) || { full_name: 'Unknown', email: 'Unknown' }
    }));

    console.log('✅ Enriched log entries:', enrichedLog.length);
    return enrichedLog;
  }
}
