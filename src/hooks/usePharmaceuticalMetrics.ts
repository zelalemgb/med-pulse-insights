
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PharmaceuticalMetrics {
  total_products: number;
  total_value: number;
  unique_facilities: number;
  unique_regions: number;
  unique_zones: number;
  unique_categories: number;
  avg_miazia_price: number;
  avg_regular_price: number;
  last_updated: string;
}

interface CategoryBreakdown {
  category: string;
  product_count: number;
  total_value: number;
  avg_price: number;
}

interface SourceBreakdown {
  source: string;
  product_count: number;
  total_value: number;
  avg_price: number;
}

export const usePharmaceuticalMetrics = () => {
  const metricsQuery = useQuery({
    queryKey: ['pharmaceutical-metrics'],
    queryFn: async (): Promise<PharmaceuticalMetrics> => {
      const { data, error } = await supabase
        .from('pharmaceutical_metrics_summary')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const categoryBreakdownQuery = useQuery({
    queryKey: ['pharmaceutical-category-breakdown'],
    queryFn: async (): Promise<CategoryBreakdown[]> => {
      const { data, error } = await supabase.rpc('get_pharmaceutical_category_breakdown', {
        limit_count: 8
      });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sourceBreakdownQuery = useQuery({
    queryKey: ['pharmaceutical-source-breakdown'],
    queryFn: async (): Promise<SourceBreakdown[]> => {
      const { data, error } = await supabase.rpc('get_pharmaceutical_source_breakdown', {
        limit_count: 6
      });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const refreshMetrics = async () => {
    await supabase.rpc('refresh_pharmaceutical_metrics');
    // Invalidate cached data to trigger refetch
    metricsQuery.refetch();
    categoryBreakdownQuery.refetch();
    sourceBreakdownQuery.refetch();
  };

  return {
    metrics: metricsQuery.data,
    categoryBreakdown: categoryBreakdownQuery.data || [],
    sourceBreakdown: sourceBreakdownQuery.data || [],
    isLoading: metricsQuery.isLoading || categoryBreakdownQuery.isLoading || sourceBreakdownQuery.isLoading,
    error: metricsQuery.error || categoryBreakdownQuery.error || sourceBreakdownQuery.error,
    refreshMetrics
  };
};
