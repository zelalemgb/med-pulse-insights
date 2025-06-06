import { supabase } from '@/integrations/supabase/client';
import { UserManagementRecord } from './types';

export class UserQueryService {
  static async getAllProfiles(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    // Get current user's profile to determine their role and scope
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, facility_id, primary_facility_id')
      .eq('id', user.id)
      .single();

    if (profileError || !currentProfile) {
      throw new Error('Failed to get user profile');
    }

    // Build query based on user's role hierarchy - more permissive approach
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        facility_id,
        department,
        is_active,
        approval_status,
        created_at,
        approved_at,
        approved_by,
        last_login_at,
        login_count
      `);

    // Apply role-based filtering with more inclusive logic
    switch (currentProfile.role) {
      case 'national':
        // National users can see all users - no filtering needed
        break;
      
      case 'regional':
        // Regional users can see zonal, facility, and functional role users
        query = query.in('role', ['zonal', 'facility_officer', 'facility_manager', 'data_analyst', 'procurement', 'finance', 'qa', 'program_manager', 'viewer']);
        break;
      
      case 'zonal':
        // Zonal users can see facility and functional role users
        query = query.in('role', ['facility_officer', 'facility_manager', 'data_analyst', 'procurement', 'finance', 'qa', 'program_manager', 'viewer']);
        break;
      
      default:
        // Other roles have limited access - only see users they can directly manage
        query = query.in('role', ['facility_officer', 'viewer']);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(500); // Increase limit to see more users

    if (error) {
      console.error('Database error in getAllProfiles:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  static async getPendingProfiles(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    // Get current user's profile to determine their role and scope
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, facility_id, primary_facility_id')
      .eq('id', user.id)
      .single();

    if (profileError || !currentProfile) {
      throw new Error('Failed to get user profile');
    }

    // Build query for pending users - exclude admin users from pending list
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        facility_id,
        department,
        is_active,
        approval_status,
        created_at,
        approved_at,
        approved_by,
        last_login_at,
        login_count
      `)
      .eq('approval_status', 'pending')
      .not('role', 'in', '(national,regional,zonal)'); // Exclude admin roles from pending list

    // Apply additional role-based filtering for pending approvals
    switch (currentProfile.role) {
      case 'national':
        // National can see all pending non-admin users - no additional filtering needed
        break;
      
      case 'regional':
        // Regional can approve zonal and below (but we already filtered out admin roles above)
        query = query.in('role', ['facility_officer', 'facility_manager', 'data_analyst', 'procurement', 'finance', 'qa', 'program_manager', 'viewer']);
        break;
      
      case 'zonal':
        // Zonal can approve facility and functional roles
        query = query.in('role', ['facility_officer', 'facility_manager', 'data_analyst', 'procurement', 'finance', 'qa', 'program_manager', 'viewer']);
        break;
      
      default:
        // Other roles have limited approval rights
        query = query.in('role', ['facility_officer', 'viewer']);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error in getPendingProfiles:', error);
      throw new Error(`Failed to fetch pending users: ${error.message}`);
    }

    console.log('🔍 Pending users query result:', data?.length || 0, 'users found');
    console.log('📋 Pending users details:', data?.map(u => ({ 
      id: u.id.slice(0, 8), 
      email: u.email, 
      role: u.role, 
      approval_status: u.approval_status 
    })));

    return data || [];
  }

  static mapUsersToRecords(profiles: any[]): UserManagementRecord[] {
    return profiles.map(profile => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      facility_id: profile.facility_id,
      department: profile.department,
      is_active: profile.is_active,
      approval_status: profile.approval_status || 'pending',
      created_at: profile.created_at,
      approved_at: profile.approved_at,
      approved_by: profile.approved_by,
      last_login_at: profile.last_login_at,
      login_count: profile.login_count || 0,
    }));
  }
}
