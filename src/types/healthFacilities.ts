
export interface HealthFacility {
  id: string;
  name: string;
  code?: string;
  facility_type: string;
  level: string;
  region: string;
  zone: string;
  wereda?: string;
  latitude?: number;
  longitude?: number;
  catchment_area?: number;
  capacity?: number;
  staff_count?: number;
  services_offered?: string[];
  hmis_indicators?: Record<string, any>;
  operational_status: 'active' | 'inactive' | 'under_maintenance';
  equipment_inventory?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface UserFacilityAssociation {
  id: string;
  user_id: string;
  facility_id: string;
  association_type: 'owner' | 'approved_user' | 'pending_approval';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  requested_at: string;
  notes?: string;
}

export interface CreateFacilityRequest {
  name: string;
  code?: string;
  facility_type: string;
  level: string;
  region: string;
  zone: string;
  wereda?: string;
  latitude?: number;
  longitude?: number;
  catchment_area?: number;
  capacity?: number;
  staff_count?: number;
  services_offered?: string[];
  hmis_indicators?: Record<string, any>;
  operational_status?: 'active' | 'inactive' | 'under_maintenance';
  equipment_inventory?: Record<string, any>;
}
