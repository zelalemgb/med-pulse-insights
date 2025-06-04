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

    // Build query based on user's role hierarchy
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

    // Apply hierarchical filtering based on current user's role
    switch (currentProfile.role) {
      case 'national':
        // National users can manage regional users
        query = query.eq('role', 'regional');
        break;
      
      case 'regional':
        // Regional users can manage zonal users in their region
        // For now, we'll implement basic filtering - in a real system, 
        // you'd have proper region-zone mapping
        query = query.eq('role', 'zonal');
        break;
      
      case 'zonal':
        // Zonal users can manage facility users in their zone
        // They can manage facility_officer and facility_manager roles
        query = query.in('role', ['facility_officer', 'facility_manager']);
        break;
      
      default:
        // Other roles cannot manage users
        throw new Error('Insufficient permissions to manage users');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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

    // Build query for pending users based on hierarchy
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
      .eq('approval_status', 'pending');

    // Apply hierarchical filtering for pending approvals
    switch (currentProfile.role) {
      case 'national':
        // National can approve regional registrations
        query = query.eq('role', 'regional');
        break;
      
      case 'regional':
        // Regional can approve zonal registrations
        query = query.eq('role', 'zonal');
        break;
      
      case 'zonal':
        // Zonal can approve facility user registrations
        query = query.in('role', ['facility_officer', 'facility_manager']);
        break;
      
      default:
        // Other roles cannot approve users
        throw new Error('Insufficient permissions to approve users');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error in getPendingProfiles:', error);
      throw new Error(`Failed to fetch pending users: ${error.message}`);
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
