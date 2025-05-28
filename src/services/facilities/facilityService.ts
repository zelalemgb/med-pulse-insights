
import { supabase } from '@/integrations/supabase/client';
import { HealthFacility, CreateFacilityRequest } from '@/types/healthFacilities';

export class FacilityService {
  // Create a new health facility
  async createFacility(facilityData: CreateFacilityRequest): Promise<HealthFacility> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('health_facilities')
      .insert({
        ...facilityData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Get facilities accessible to the current user (RLS will filter automatically)
  async getUserFacilities(): Promise<HealthFacility[]> {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch facilities: ${error.message}`);
    }

    return data as HealthFacility[];
  }

  // Get a specific facility by ID (RLS will check access)
  async getFacilityById(facilityId: string): Promise<HealthFacility | null> {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*')
      .eq('id', facilityId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch facility: ${error.message}`);
    }

    return data as HealthFacility | null;
  }

  // Update a facility (RLS will check ownership)
  async updateFacility(facilityId: string, updates: Partial<CreateFacilityRequest>): Promise<HealthFacility> {
    const { data, error } = await supabase
      .from('health_facilities')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', facilityId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Check if user has access to a facility (uses RLS function)
  async checkFacilityAccess(facilityId: string, requiredType: string = 'approved_user'): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase.rpc('user_has_facility_access', {
      _user_id: user.id,
      _facility_id: facilityId,
      _required_type: requiredType
    });

    if (error) {
      console.error('Error checking facility access:', error);
      return false;
    }

    return data as boolean;
  }
}

export const facilityService = new FacilityService();
