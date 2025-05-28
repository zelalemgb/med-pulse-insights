
import { supabase } from '@/integrations/supabase/client';
import { HealthFacility, CreateFacilityRequest, UserFacilityAssociation } from '@/types/healthFacilities';

export class HealthFacilitiesService {
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

  // Request association with a facility
  async requestFacilityAssociation(facilityId: string, notes?: string): Promise<UserFacilityAssociation> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_facility_associations')
      .insert({
        user_id: user.id,
        facility_id: facilityId,
        association_type: 'pending_approval',
        approval_status: 'pending',
        notes
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('You have already requested access to this facility');
      }
      throw new Error(`Failed to request facility association: ${error.message}`);
    }

    return data as UserFacilityAssociation;
  }

  // Get user's facility associations (RLS will filter automatically)
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

  // Approve or reject facility association (RLS will check permissions)
  async updateAssociationStatus(
    associationId: string, 
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<UserFacilityAssociation> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      approval_status: status,
      approved_by: user.id,
      approved_at: new Date().toISOString()
    };

    // If approving, change association type to approved_user
    if (status === 'approved') {
      updateData.association_type = 'approved_user';
    }

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('user_facility_associations')
      .update(updateData)
      .eq('id', associationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update association status: ${error.message}`);
    }

    return data as UserFacilityAssociation;
  }

  // Get pending associations for facilities owned by the current user (RLS will filter)
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

export const healthFacilitiesService = new HealthFacilitiesService();
