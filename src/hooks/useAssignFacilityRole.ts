
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/pharmaceutical';
import { mapPharmaceuticalToSupabaseRole } from '@/utils/roleMapping';

export const useAssignFacilityRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, facilityId, role }: { 
      userId: string; 
      facilityId: string; 
      role: UserRole; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const supabaseRole = mapPharmaceuticalToSupabaseRole(role);

      const { data, error } = await supabase
        .from('facility_specific_roles')
        .insert({
          user_id: userId,
          facility_id: facilityId,
          role: supabaseRole,
          granted_by: user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to assign role: ${error.message}`);
      }

      // Log the role assignment
      await supabase.rpc('log_role_change', {
        _user_id: user.id,
        _target_user_id: userId,
        _action: 'assign',
        _role_type: 'facility_specific',
        _old_role: null,
        _new_role: supabaseRole,
        _facility_id: facilityId,
        _reason: 'Facility role assignment',
        _metadata: { source: 'facility_roles_hook' }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-roles'] });
      queryClient.invalidateQueries({ queryKey: ['role-audit'] });
      toast({
        title: "Success",
        description: "Role assigned successfully",
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
