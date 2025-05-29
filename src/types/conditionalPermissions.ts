
export interface ConditionalPermission {
  id: string;
  user_id: string;
  facility_id: string;
  permission_name: string;
  conditions: {
    time_windows?: Array<{
      start_hour: number;
      end_hour: number;
      allowed_days?: number[];
    }>;
    location_constraints?: {
      required_facility?: string;
    };
  };
  is_active: boolean;
  granted_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  health_facilities?: {
    name: string;
  } | null;
}

export interface PermissionUsageEntry {
  id: string;
  user_id: string;
  permission_name: string;
  resource_type: string;
  resource_id?: string;
  facility_id?: string;
  access_granted: boolean;
  access_method: string;
  conditions_met: Record<string, any>;
  created_at: string;
}
