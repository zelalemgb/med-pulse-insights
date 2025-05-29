
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/pharmaceutical';
import { mapPharmaceuticalToSupabaseRole } from '@/utils/roleMapping';

export const useBulkAssignRoles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userIds, 
      facilityId, 
      role 
    }: { 
      userIds: string[]; 
      facilityId: string; 
      role: UserRole; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const supabaseRole = mapPharmaceuticalToSupabaseRole(role);

      const { data, error } = await supabase.rpc('bulk_assign_facility_roles', {
        _user_ids: userIds,
        _facility_id: facilityId,
        _role: supabaseRole,
        _granted_by: user.id
      });

      if (error) {
        throw new Error(`Failed to bulk assign roles: ${error.message}`);
      }

      return data;
    },
    onSuccess: (assignedCount) => {
      queryClient.invalidateQueries({ queryKey: ['facility-roles'] });
      toast({
        title: "Success",
        description: `Successfully assigned roles to ${assignedCount} users`,
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
