
import { supabase } from '@/integrations/supabase/client';
import { UserFacilityAssociation } from '@/types/healthFacilities';

export class AssociationService {
  // Request association with a facility
  async requestFacilityAssociation(facilityId: string, notes?: string): Promise<UserFacilityAssociation> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Requesting facility association for facility:', facilityId);

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
      console.error('Supabase error creating association:', error);
      throw new Error(`Failed to request facility association: ${error.message}`);
    }

    console.log('Association request created successfully:', data);
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
      console.error('Supabase error fetching associations:', error);
      throw new Error(`Failed to fetch user associations: ${error.message}`);
    }

    return data as UserFacilityAssociation[];
  }

  // Approve or reject facility association
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
      console.error('Supabase error updating association:', error);
      throw new Error(`Failed to update association status: ${error.message}`);
    }

    return data as UserFacilityAssociation;
  }

  // Get pending associations for facilities
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
      console.error('Supabase error fetching pending associations:', error);
      throw new Error(`Failed to fetch pending associations: ${error.message}`);
    }

    return data as UserFacilityAssociation[];
  }
}

export const associationService = new AssociationService();
