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
      .limit(500);

    if (error) {
      console.error('Database error in getAllProfiles:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    console.log('📊 All profiles query result:', data?.length || 0, 'total users found');
    console.log('🔍 Sample profiles:', data?.slice(0, 3).map(u => ({ 
      id: u.id.slice(0, 8), 
      email: u.email, 
      role: u.role, 
      approval_status: u.approval_status,
      full_name: u.full_name,
      created_at: u.created_at
    })));

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

    console.log('🔍 Current user role for pending query:', currentProfile.role);

    // Query for ALL pending users first for debugging
    console.log('🔍 Querying ALL pending users...');
    const { data: allPendingData, error: allPendingError } = await supabase
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
      .order('created_at', { ascending: false });

    if (allPendingError) {
      console.error('Database error in getAllPending:', allPendingError);
    } else {
      console.log('📊 ALL pending users found:', allPendingData?.length || 0);
      console.log('🔍 All pending users details:', allPendingData?.map(u => ({ 
        id: u.id.slice(0, 8), 
        email: u.email, 
        role: u.role, 
        approval_status: u.approval_status,
        full_name: u.full_name,
        created_at: u.created_at
      })));
    }

    // For testing, let's return ALL pending users regardless of role filtering
    // This will help us see if the issue is with role filtering or profile creation
    if (allPendingData && allPendingData.length > 0) {
      console.log('🎯 Returning ALL pending users for debugging');
      return allPendingData;
    }

    // If no pending users found at all, there might be an issue with profile creation
    console.log('⚠️ No pending users found in the database');
    return [];
  }

  static async getApprovedProfiles(): Promise<any[]> {
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
      .eq('approval_status', 'approved');

    // Apply role-based filtering for approved users
    switch (currentProfile.role) {
      case 'national':
        // National users can see all approved users - no filtering needed
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
        // Other roles have limited access
        query = query.in('role', ['facility_officer', 'viewer']);
    }

    const { data, error } = await query.order('approved_at', { ascending: false });

    if (error) {
      console.error('Database error in getApprovedProfiles:', error);
      throw new Error(`Failed to fetch approved users: ${error.message}`);
    }

    return data || [];
  }

  static async getRejectedProfiles(): Promise<any[]> {
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
      .eq('approval_status', 'rejected');

    // Apply role-based filtering for rejected users
    switch (currentProfile.role) {
      case 'national':
        // National users can see all rejected users - no filtering needed
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
        // Other roles have limited access
        query = query.in('role', ['facility_officer', 'viewer']);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error in getRejectedProfiles:', error);
      throw new Error(`Failed to fetch rejected users: ${error.message}`);
    }

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
