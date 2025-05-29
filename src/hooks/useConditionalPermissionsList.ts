
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConditionalPermission } from '@/types/conditionalPermissions';

export const useConditionalPermissions = (facilityId?: string) => {
  return useQuery({
    queryKey: ['conditional-permissions', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('conditional_permissions')
        .select(`
          *,
          profiles (full_name, email),
          health_facilities (name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch conditional permissions: ${error.message}`);
      }
      
      // Properly map and type the results
      const mappedData: ConditionalPermission[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        facility_id: item.facility_id || '',
        permission_name: item.permission_name,
        conditions: (item.conditions as any) || {},
        is_active: item.is_active,
        granted_by: item.granted_by || undefined,
        expires_at: item.expires_at || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        health_facilities: Array.isArray(item.health_facilities) ? item.health_facilities[0] : item.health_facilities
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};
