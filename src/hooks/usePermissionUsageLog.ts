
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PermissionUsageEntry } from '@/types/conditionalPermissions';

export const usePermissionUsageLog = (facilityId?: string) => {
  return useQuery({
    queryKey: ['permission-usage', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('permission_usage_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch permission usage log: ${error.message}`);
      }
      
      const mappedData: PermissionUsageEntry[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        permission_name: item.permission_name,
        resource_type: item.resource_type,
        resource_id: item.resource_id || undefined,
        facility_id: item.facility_id || undefined,
        access_granted: item.access_granted,
        access_method: item.access_method || 'global_role',
        conditions_met: (item.conditions_met as Record<string, any>) || {},
        created_at: item.created_at
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};
