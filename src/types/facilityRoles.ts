
import { UserRole } from '@/types/pharmaceutical';
import { Database } from '@/integrations/supabase/types';

export type SupabaseUserRole = Database['public']['Enums']['user_role'];

export interface FacilityRoleAssignment {
  id: string;
  user_id: string;
  facility_id: string;
  role: UserRole;
  granted_by: string | null;
  granted_at: string;
  is_active: boolean;
}

export interface BulkRoleAssignmentResult {
  assignedCount: number;
  failedAssignments: string[];
}

export interface RoleChangeLogEntry {
  userId: string;
  targetUserId: string;
  action: string;
  roleType: string;
  oldRole?: UserRole;
  newRole?: UserRole;
  facilityId?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface FacilitySpecificRole {
  id: string;
  user_id: string;
  facility_id: string;
  role: UserRole;
  granted_by: string | null;
  granted_at: string;
  is_active: boolean;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  health_facilities?: {
    name: string;
    facility_type: string;
  } | null;
}
