
import { supabase } from '@/integrations/supabase/client';
import { HealthFacility, CreateFacilityRequest } from '@/types/healthFacilities';

export class FacilityService {
  // Create a new health facility
  async createFacility(facilityData: CreateFacilityRequest): Promise<HealthFacility> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate a unique facility code if not provided
    const facilityCode = facilityData.code || `FAC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const { data, error } = await supabase
      .from('health_facilities')
      .insert({
        name: facilityData.name,
        code: facilityCode,
        facility_type: facilityData.facility_type,
        level: facilityData.level,
        region: facilityData.region,
        zone: facilityData.zone,
        wereda: facilityData.wereda,
        latitude: facilityData.latitude,
        longitude: facilityData.longitude,
        catchment_area: facilityData.catchment_area,
        capacity: facilityData.capacity,
        staff_count: facilityData.staff_count,
        services_offered: facilityData.services_offered,
        operational_status: facilityData.operational_status || 'active',
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating facility:', error);
      throw new Error(`Failed to create facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Get facilities for the current user - simplified query
  async getUserFacilities(): Promise<HealthFacility[]> {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Supabase error fetching facilities:', error);
      throw new Error(`Failed to fetch facilities: ${error.message}`);
    }

    return data as HealthFacility[];
  }

  // Get a specific facility by ID
  async getFacilityById(facilityId: string): Promise<HealthFacility | null> {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*')
      .eq('id', facilityId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error fetching facility:', error);
      throw new Error(`Failed to fetch facility: ${error.message}`);
    }

    return data as HealthFacility | null;
  }

  // Update a facility
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
      console.error('Supabase error updating facility:', error);
      throw new Error(`Failed to update facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Delete a facility
  async deleteFacility(facilityId: string): Promise<void> {
    const { error } = await supabase
      .from('health_facilities')
      .delete()
      .eq('id', facilityId);

    if (error) {
      console.error('Supabase error deleting facility:', error);
      throw new Error(`Failed to delete facility: ${error.message}`);
    }
  }

  // Simple facility access check without RLS complications
  async checkFacilityAccess(facilityId: string, requiredType: string = 'approved_user'): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Check if user is the creator
    const { data: facility } = await supabase
      .from('health_facilities')
      .select('created_by')
      .eq('id', facilityId)
      .maybeSingle();

    if (facility && facility.created_by === user.id) {
      return true;
    }

    // Check associations
    const { data: association } = await supabase
      .from('user_facility_associations')
      .select('*')
      .eq('user_id', user.id)
      .eq('facility_id', facilityId)
      .eq('approval_status', 'approved')
      .maybeSingle();

    return !!association;
  }
}

export const facilityService = new FacilityService();
