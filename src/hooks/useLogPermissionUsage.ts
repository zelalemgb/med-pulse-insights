
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useLogPermissionUsage = () => {
  return useMutation({
    mutationFn: async ({
      permissionName,
      resourceType,
      resourceId,
      facilityId,
      accessGranted = true,
      accessMethod = 'global_role',
      conditionsMet = {},
      sessionId
    }: {
      permissionName: string;
      resourceType: string;
      resourceId?: string;
      facilityId?: string;
      accessGranted?: boolean;
      accessMethod?: string;
      conditionsMet?: Record<string, any>;
      sessionId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('log_permission_usage', {
        _user_id: user.id,
        _permission_name: permissionName,
        _resource_type: resourceType,
        _resource_id: resourceId,
        _facility_id: facilityId,
        _access_granted: accessGranted,
        _access_method: accessMethod,
        _conditions_met: conditionsMet,
        _session_id: sessionId
      });

      if (error) {
        logger.error('Permission usage logging failed:', error);
      }

      return data;
    },
  });
};
