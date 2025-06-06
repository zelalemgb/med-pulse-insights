import { supabase } from '@/integrations/supabase/client';

export class QueryFilterService {
  static buildAllUsersQuery(userRole: string) {
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
    switch (userRole) {
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

    return query;
  }

  static buildPendingUsersQuery(userRole: string) {
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
    switch (userRole) {
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

    return query;
  }
}
