
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseToPharmaceuticalRole } from '@/utils/roleMapping';
import { FacilitySpecificRole } from '@/types/facilityRoles';

export const useFacilityRoles = (facilityId?: string) => {
  return useQuery({
    queryKey: ['facility-roles', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('facility_specific_roles')
        .select(`
          *,
          profiles!inner (full_name, email),
          health_facilities!inner (name, facility_type)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch facility roles: ${error.message}`);
      }
      
      // Map the results to our expected type
      const mappedData: FacilitySpecificRole[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        facility_id: item.facility_id,
        role: mapSupabaseToPharmaceuticalRole(item.role),
        granted_by: item.granted_by,
        granted_at: item.granted_at,
        is_active: item.is_active,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        health_facilities: Array.isArray(item.health_facilities) ? item.health_facilities[0] : item.health_facilities
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};
