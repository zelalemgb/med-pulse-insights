
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCheckConditionalPermissions = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      facilityId,
      permissionName,
      userLocation = {}
    }: {
      userId: string;
      facilityId: string;
      permissionName: string;
      userLocation?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.rpc('check_conditional_permissions', {
        _user_id: userId,
        _facility_id: facilityId,
        _permission_name: permissionName,
        _user_location: userLocation
      });

      if (error) {
        throw new Error(`Failed to check conditional permissions: ${error.message}`);
      }

      return data as boolean;
    },
  });
};
