
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';

interface FacilitySpecificRole {
  id: string;
  user_id: string;
  facility_id: string;
  role: UserRole;
  granted_by: string | null;
  granted_at: string;
  is_active: boolean;
  profiles?: {
    full_name: string | null;
    email: string;
  };
  health_facilities?: {
    name: string;
    facility_type: string;
  };
}

export const useFacilityRoles = (facilityId?: string) => {
  return useQuery({
    queryKey: ['facility-roles', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('facility_specific_roles')
        .select(`
          *,
          profiles (full_name, email),
          health_facilities (name, facility_type)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch facility roles: ${error.message}`);
      }
      
      return data as FacilitySpecificRole[];
    },
    enabled: true,
  });
};

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

      return data as UserRole;
    },
    enabled: !!userId && !!facilityId,
  });
};

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

      const { data, error } = await supabase
        .from('facility_specific_roles')
        .insert({
          user_id: userId,
          facility_id: facilityId,
          role,
          granted_by: user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to assign role: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-roles'] });
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

      const { data, error } = await supabase.rpc('bulk_assign_facility_roles', {
        _user_ids: userIds,
        _facility_id: facilityId,
        _role: role,
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

export const useRevokeFacilityRole = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('facility_specific_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) {
        throw new Error(`Failed to revoke role: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-roles'] });
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
