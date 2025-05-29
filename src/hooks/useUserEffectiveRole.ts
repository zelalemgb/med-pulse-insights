
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseToPharmaceuticalRole } from '@/utils/roleMapping';

export const useUserEffectiveRole = (userId: string, facilityId: string) => {
  return useQuery({
    queryKey: ['effective-role', userId, facilityId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
        _user_id: userId,
        _facility_id: facilityId
      });

      if (error) {
        throw new Error(`Failed to get effective role: ${error.message}`);
      }

      return data ? mapSupabaseToPharmaceuticalRole(data) : null;
    },
    enabled: !!userId && !!facilityId,
  });
};
