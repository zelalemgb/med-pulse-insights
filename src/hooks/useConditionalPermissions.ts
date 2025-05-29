
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConditionalPermission {
  id: string;
  user_id: string;
  facility_id: string;
  permission_name: string;
  conditions: {
    time_windows?: Array<{
      start_hour: number;
      end_hour: number;
      allowed_days?: number[];
    }>;
    location_constraints?: {
      required_facility?: string;
    };
  };
  is_active: boolean;
  granted_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  health_facilities?: {
    name: string;
  } | null;
}

interface PermissionUsageEntry {
  id: string;
  user_id: string;
  permission_name: string;
  resource_type: string;
  resource_id?: string;
  facility_id?: string;
  access_granted: boolean;
  access_method: string;
  conditions_met: Record<string, any>;
  created_at: string;
}

export const useConditionalPermissions = (facilityId?: string) => {
  return useQuery({
    queryKey: ['conditional-permissions', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('conditional_permissions')
        .select(`
          *,
          profiles (full_name, email),
          health_facilities (name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch conditional permissions: ${error.message}`);
      }
      
      // Properly map and type the results
      const mappedData: ConditionalPermission[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        facility_id: item.facility_id || '',
        permission_name: item.permission_name,
        conditions: (item.conditions as any) || {},
        is_active: item.is_active,
        granted_by: item.granted_by || undefined,
        expires_at: item.expires_at || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        health_facilities: Array.isArray(item.health_facilities) ? item.health_facilities[0] : item.health_facilities
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};

export const usePermissionUsageLog = (facilityId?: string) => {
  return useQuery({
    queryKey: ['permission-usage', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('permission_usage_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch permission usage log: ${error.message}`);
      }
      
      const mappedData: PermissionUsageEntry[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        permission_name: item.permission_name,
        resource_type: item.resource_type,
        resource_id: item.resource_id || undefined,
        facility_id: item.facility_id || undefined,
        access_granted: item.access_granted,
        access_method: item.access_method || 'global_role',
        conditions_met: (item.conditions_met as Record<string, any>) || {},
        created_at: item.created_at
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};

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
        console.error('Permission usage logging failed:', error);
      }

      return data;
    },
  });
};
