
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  facility_count: number;
  unread_notifications: number;
  recent_activity: Array<{
    page: string;
    visited_at: string;
  }>;
}

export const useDashboardStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
        _user_id: user.id,
      });

      if (error) throw error;
      return data as DashboardStats;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    stats,
    isLoading,
  };
};
