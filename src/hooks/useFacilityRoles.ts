
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

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
  } | null;
  health_facilities?: {
    name: string;
    facility_type: string;
  } | null;
}

// Map Supabase roles to pharmaceutical roles
const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole): UserRole => {
  switch (supabaseRole) {
    case 'admin':
      return 'national';
    case 'manager':
      return 'facility_manager';
    case 'analyst':
      return 'data_analyst';
    case 'viewer':
      return 'viewer';
    case 'zonal':
      return 'zonal';
    case 'regional':
      return 'regional';
    case 'national':
      return 'national';
    default:
      return 'facility_officer';
  }
};

// Map pharmaceutical roles to Supabase roles
const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
  switch (pharmaceuticalRole) {
    case 'national':
      return 'national';
    case 'facility_manager':
      return 'manager';
    case 'data_analyst':
      return 'analyst';
    case 'viewer':
      return 'viewer';
    case 'zonal':
      return 'zonal';
    case 'regional':
      return 'regional';
    case 'facility_officer':
    case 'procurement':
    case 'finance':
    case 'program_manager':
    case 'qa':
    default:
      return 'viewer'; // Default mapping for roles not in Supabase
  }
};

export const useFacilityRoles = (facilityId?: string) => {
  return useQuery({
    queryKey: ['facility-roles', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('facility_specific_roles')
        .select(`
          *,
          profiles!inner (full_name, email),
          health_facilities!inner (name, facility_type)
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
      
      // Map the results to our expected type
      const mappedData: FacilitySpecificRole[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        facility_id: item.facility_id,
        role: mapSupabaseToPharmaceuticalRole(item.role),
        granted_by: item.granted_by,
        granted_at: item.granted_at,
        is_active: item.is_active,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        health_facilities: Array.isArray(item.health_facilities) ? item.health_facilities[0] : item.health_facilities
      }));
      
      return mappedData;
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

      return data ? mapSupabaseToPharmaceuticalRole(data) : null;
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
        _new_role: role,
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
          _old_role: mapSupabaseToPharmaceuticalRole(currentRole.role),
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
