
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
      // Use RPC call to get metrics since materialized view might not be in types yet
      const { data, error } = await supabase.rpc('get_pharmaceutical_metrics');
      
      if (error) throw error;
      
      // If no RPC function available, fallback to direct query
      if (!data) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('pharmaceutical_products')
          .select('miazia_price, price, facility, region, zone, product_category, procurement_source', { count: 'exact' });
        
        if (fallbackError) throw fallbackError;
        
        const totalProducts = fallbackData?.length || 0;
        const totalValue = fallbackData?.reduce((sum, item) => sum + (item.miazia_price || 0), 0) || 0;
        const uniqueFacilities = new Set(fallbackData?.map(item => item.facility)).size;
        const uniqueRegions = new Set(fallbackData?.map(item => item.region).filter(Boolean)).size;
        const uniqueZones = new Set(fallbackData?.map(item => item.zone).filter(Boolean)).size;
        const uniqueCategories = new Set(fallbackData?.map(item => item.product_category).filter(Boolean)).size;
        const avgMiaziaPrice = fallbackData?.filter(item => item.miazia_price).reduce((sum, item) => sum + (item.miazia_price || 0), 0) / fallbackData?.filter(item => item.miazia_price).length || 0;
        const avgRegularPrice = fallbackData?.filter(item => item.price).reduce((sum, item) => sum + (item.price || 0), 0) / fallbackData?.filter(item => item.price).length || 0;
        
        return {
          total_products: totalProducts,
          total_value: totalValue,
          unique_facilities: uniqueFacilities,
          unique_regions: uniqueRegions,
          unique_zones: uniqueZones,
          unique_categories: uniqueCategories,
          avg_miazia_price: avgMiaziaPrice,
          avg_regular_price: avgRegularPrice,
          last_updated: new Date().toISOString()
        };
      }
      
      return data as PharmaceuticalMetrics;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const categoryBreakdownQuery = useQuery({
    queryKey: ['pharmaceutical-category-breakdown'],
    queryFn: async (): Promise<CategoryBreakdown[]> => {
      // Direct query since RPC might not be available yet
      const { data, error } = await supabase
        .from('pharmaceutical_products')
        .select('product_category, miazia_price')
        .not('miazia_price', 'is', null);
      
      if (error) throw error;
      
      // Group by category
      const categoryMap = new Map<string, { count: number, totalValue: number, prices: number[] }>();
      
      data?.forEach(item => {
        const category = item.product_category || 'Uncategorized';
        const price = item.miazia_price || 0;
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { count: 0, totalValue: 0, prices: [] });
        }
        
        const existing = categoryMap.get(category)!;
        existing.count++;
        existing.totalValue += price;
        existing.prices.push(price);
      });
      
      return Array.from(categoryMap.entries())
        .map(([category, stats]) => ({
          category,
          product_count: stats.count,
          total_value: stats.totalValue,
          avg_price: stats.prices.length > 0 ? stats.totalValue / stats.prices.length : 0
        }))
        .sort((a, b) => b.product_count - a.product_count)
        .slice(0, 8);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sourceBreakdownQuery = useQuery({
    queryKey: ['pharmaceutical-source-breakdown'],
    queryFn: async (): Promise<SourceBreakdown[]> => {
      // Direct query since RPC might not be available yet
      const { data, error } = await supabase
        .from('pharmaceutical_products')
        .select('procurement_source, miazia_price')
        .not('miazia_price', 'is', null);
      
      if (error) throw error;
      
      // Group by source
      const sourceMap = new Map<string, { count: number, totalValue: number, prices: number[] }>();
      
      data?.forEach(item => {
        const source = item.procurement_source || 'Unknown';
        const price = item.miazia_price || 0;
        
        if (!sourceMap.has(source)) {
          sourceMap.set(source, { count: 0, totalValue: 0, prices: [] });
        }
        
        const existing = sourceMap.get(source)!;
        existing.count++;
        existing.totalValue += price;
        existing.prices.push(price);
      });
      
      return Array.from(sourceMap.entries())
        .map(([source, stats]) => ({
          source,
          product_count: stats.count,
          total_value: stats.totalValue,
          avg_price: stats.prices.length > 0 ? stats.totalValue / stats.prices.length : 0
        }))
        .sort((a, b) => b.product_count - a.product_count)
        .slice(0, 6);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const refreshMetrics = async () => {
    // Refresh all queries
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
