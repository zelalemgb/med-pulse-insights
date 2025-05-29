
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/pharmaceutical';
import { Database } from '@/integrations/supabase/types';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

interface RoleAuditEntry {
  id: string;
  user_id: string;
  target_user_id: string;
  action: string;
  role_type: string;
  old_role?: UserRole;
  new_role?: UserRole;
  facility_id?: string;
  reason?: string;
  metadata: Record<string, any>;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  target_profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  health_facilities?: {
    name: string;
  } | null;
}

interface AuditAnalytics {
  period: {
    start_date: string;
    end_date: string;
  };
  total_changes: number;
  changes_by_action: Record<string, number>;
  changes_by_role: Record<string, number>;
  most_active_admins: Array<{
    user_id: string;
    changes_made: number;
  }>;
}

// Map Supabase roles to pharmaceutical roles
const mapSupabaseToPharmaceuticalRole = (supabaseRole: SupabaseUserRole | null): UserRole | undefined => {
  if (!supabaseRole) return undefined;
  
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

export const useRoleAuditLog = (facilityId?: string) => {
  return useQuery({
    queryKey: ['role-audit', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('role_audit_log')
        .select(`
          *,
          profiles!role_audit_log_user_id_fkey (full_name, email),
          target_profiles:profiles!role_audit_log_target_user_id_fkey (full_name, email),
          health_facilities (name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch audit log: ${error.message}`);
      }
      
      // Properly map and type the results
      const mappedData: RoleAuditEntry[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        target_user_id: item.target_user_id,
        action: item.action,
        role_type: item.role_type,
        old_role: mapSupabaseToPharmaceuticalRole(item.old_role),
        new_role: mapSupabaseToPharmaceuticalRole(item.new_role),
        facility_id: item.facility_id || undefined,
        reason: item.reason || undefined,
        metadata: (item.metadata as Record<string, any>) || {},
        created_at: item.created_at,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        target_profiles: Array.isArray(item.target_profiles) ? item.target_profiles[0] : item.target_profiles,
        health_facilities: Array.isArray(item.health_facilities) ? item.health_facilities[0] : item.health_facilities
      }));
      
      return mappedData;
    },
    enabled: true,
  });
};

export const useRoleAuditAnalytics = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['role-audit-analytics', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_role_audit_analytics', {
        _start_date: startDate?.toISOString(),
        _end_date: endDate?.toISOString()
      });

      if (error) {
        throw new Error(`Failed to get audit analytics: ${error.message}`);
      }

      return data as AuditAnalytics;
    },
    enabled: true,
  });
};

export const useLogRoleChange = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUserId,
      action,
      roleType,
      oldRole,
      newRole,
      facilityId,
      reason,
      metadata = {}
    }: {
      targetUserId: string;
      action: string;
      roleType: string;
      oldRole?: UserRole;
      newRole?: UserRole;
      facilityId?: string;
      reason?: string;
      metadata?: Record<string, any>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const mappedOldRole = oldRole ? mapPharmaceuticalToSupabaseRole(oldRole) : undefined;
      const mappedNewRole = newRole ? mapPharmaceuticalToSupabaseRole(newRole) : undefined;

      const { data, error } = await supabase.rpc('log_role_change', {
        _user_id: user.id,
        _target_user_id: targetUserId,
        _action: action,
        _role_type: roleType,
        _old_role: mappedOldRole,
        _new_role: mappedNewRole,
        _facility_id: facilityId,
        _reason: reason,
        _metadata: metadata
      });

      if (error) {
        throw new Error(`Failed to log role change: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-audit'] });
      queryClient.invalidateQueries({ queryKey: ['role-audit-analytics'] });
    },
    onError: (error: Error) => {
      console.error('Role audit logging failed:', error);
    },
  });
};
