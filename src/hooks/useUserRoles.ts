
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { mapSupabaseToPharmaceuticalRole } from '@/utils/roleMapping';

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .not('role', 'is', null);

      if (error) {
        throw new Error(`Failed to fetch user roles: ${error.message}`);
      }

      // Extract unique roles and map them to pharmaceutical roles
      const uniqueRoles = [...new Set(data.map(item => item.role))];
      const mappedRoles: UserRole[] = uniqueRoles.map(role => 
        mapSupabaseToPharmaceuticalRole(role)
      );

      // Remove duplicates after mapping
      return [...new Set(mappedRoles)];
    },
  });
};
