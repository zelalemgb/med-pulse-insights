
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ConditionalPermission } from '@/types/conditionalPermissions';

export const useCreateConditionalPermission = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      facilityId,
      permissionName,
      conditions,
      expiresAt
    }: {
      userId: string;
      facilityId: string;
      permissionName: string;
      conditions: ConditionalPermission['conditions'];
      expiresAt?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conditional_permissions')
        .insert({
          user_id: userId,
          facility_id: facilityId,
          permission_name: permissionName,
          conditions,
          granted_by: user.id,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create conditional permission: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditional-permissions'] });
      toast({
        title: "Success",
        description: "Conditional permission created successfully",
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
