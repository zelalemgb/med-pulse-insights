
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/pharmaceutical';

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
  };
  target_profiles?: {
    full_name: string | null;
    email: string;
  };
  health_facilities?: {
    name: string;
  };
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
      
      return data as RoleAuditEntry[];
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

      const { data, error } = await supabase.rpc('log_role_change', {
        _user_id: user.id,
        _target_user_id: targetUserId,
        _action: action,
        _role_type: roleType,
        _old_role: oldRole,
        _new_role: newRole,
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
