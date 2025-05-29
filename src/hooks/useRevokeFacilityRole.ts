
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRevokeFacilityRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the current role before revoking for audit logging
      const { data: currentRole } = await supabase
        .from('facility_specific_roles')
        .select('user_id, facility_id, role')
        .eq('id', roleId)
        .single();

      const { error } = await supabase
        .from('facility_specific_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) {
        throw new Error(`Failed to revoke role: ${error.message}`);
      }

      // Log the role revocation
      if (currentRole) {
        await supabase.rpc('log_role_change', {
          _user_id: user.id,
          _target_user_id: currentRole.user_id,
          _action: 'revoke',
          _role_type: 'facility_specific',
          _old_role: currentRole.role,
          _new_role: null,
          _facility_id: currentRole.facility_id,
          _reason: 'Facility role revocation',
          _metadata: { source: 'facility_roles_hook' }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-roles'] });
      queryClient.invalidateQueries({ queryKey: ['role-audit'] });
      toast({
        title: "Success",
        description: "Role revoked successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });
};
