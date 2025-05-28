
import { supabase } from '@/integrations/supabase/client';
import { HealthFacility, CreateFacilityRequest, UserFacilityAssociation } from '@/types/healthFacilities';

export class HealthFacilitiesService {
  // Create a new health facility
  async createFacility(facilityData: CreateFacilityRequest): Promise<HealthFacility> {
    const { data, error } = await supabase
      .from('health_facilities')
      .insert({
        ...facilityData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Get facilities accessible to the current user
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

  // Get a specific facility by ID
  async getFacilityById(facilityId: string): Promise<HealthFacility | null> {
    const { data, error } = await supabase
      .from('health_facilities')
      .select('*')
      .eq('id', facilityId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch facility: ${error.message}`);
    }

    return data as HealthFacility;
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
      throw new Error(`Failed to update facility: ${error.message}`);
    }

    return data as HealthFacility;
  }

  // Request association with a facility
  async requestFacilityAssociation(facilityId: string, notes?: string): Promise<UserFacilityAssociation> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_facility_associations')
      .insert({
        user_id: user.data.user.id,
        facility_id: facilityId,
        association_type: 'pending_approval',
        approval_status: 'pending',
        notes
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to request facility association: ${error.message}`);
    }

    return data as UserFacilityAssociation;
  }

  // Get user's facility associations
  async getUserAssociations(): Promise<UserFacilityAssociation[]> {
    const { data, error } = await supabase
      .from('user_facility_associations')
      .select(`
        *,
        health_facilities (
          id,
          name,
          facility_type,
          region,
          zone
        )
      `)
      .order('requested_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user associations: ${error.message}`);
    }

    return data as UserFacilityAssociation[];
  }

  // Approve or reject facility association (for facility owners/super admins)
  async updateAssociationStatus(
    associationId: string, 
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<UserFacilityAssociation> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_facility_associations')
      .update({
        approval_status: status,
        approved_by: user.data.user.id,
        approved_at: new Date().toISOString(),
        notes
      })
      .eq('id', associationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update association status: ${error.message}`);
    }

    return data as UserFacilityAssociation;
  }

  // Get pending associations for facilities owned by the current user
  async getPendingAssociations(): Promise<UserFacilityAssociation[]> {
    const { data, error } = await supabase
      .from('user_facility_associations')
      .select(`
        *,
        health_facilities (
          id,
          name,
          facility_type,
          region,
          zone
        ),
        profiles (
          full_name,
          email
        )
      `)
      .eq('approval_status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pending associations: ${error.message}`);
    }

    return data as UserFacilityAssociation[];
  }

  // Check if user has access to a facility
  async checkFacilityAccess(facilityId: string, requiredType: string = 'approved_user'): Promise<boolean> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return false;
    }

    const { data, error } = await supabase.rpc('user_has_facility_access', {
      _user_id: user.data.user.id,
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

export const healthFacilitiesService = new HealthFacilitiesService();
