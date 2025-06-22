
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PharmaceuticalProduct, PharmaceuticalProductFilters } from '@/types/pharmaceuticalProducts';
import { useToast } from '@/hooks/use-toast';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

interface ProductQueryResult {
  products: PharmaceuticalProduct[];
  totalCount: number;
  nextCursor?: string;
  hasMore: boolean;
}

export const useOptimizedPharmaceuticalProducts = (
  filters?: PharmaceuticalProductFilters, 
  pagination?: PaginationOptions
) => {
  const [filterValues, setFilterValues] = useState<{
    facilities: string[];
    regions: string[];
    zones: string[];
    woredas: string[];
  }>({ facilities: [], regions: [], zones: [], woredas: [] });

  const { toast } = useToast();

  // Optimized product query with cursor-based pagination
  const productsQuery = useQuery({
    queryKey: ['pharmaceutical-products', filters, pagination?.page, pagination?.pageSize],
    queryFn: async (): Promise<ProductQueryResult> => {
      console.log('Fetching optimized pharmaceutical products...');
      
      let query = supabase
        .from('pharmaceutical_products')
        .select(`
          id,
          facility,
          product_name,
          unit,
          product_category,
          price,
          procurement_source,
          quantity,
          miazia_price,
          region,
          zone,
          woreda,
          created_at,
          updated_at,
          regions!region_id(id, name, code, created_at, updated_at),
          zones!zone_id(id, name, code, region_id, created_at, updated_at),
          woredas!woreda_id(id, name, code, zone_id, created_at, updated_at)
        `, { count: 'exact' });

      // Apply filters efficiently
      if (filters?.facility) {
        query = query.ilike('facility', `%${filters.facility}%`);
      }
      if (filters?.region) {
        query = query.eq('region', filters.region);
      }
      if (filters?.region_id) {
        query = query.eq('region_id', filters.region_id);
      }
      if (filters?.zone) {
        query = query.eq('zone', filters.zone);
      }
      if (filters?.zone_id) {
        query = query.eq('zone_id', filters.zone_id);
      }
      if (filters?.woreda) {
        query = query.eq('woreda', filters.woreda);
      }
      if (filters?.woreda_id) {
        query = query.eq('woreda_id', filters.woreda_id);
      }
      if (filters?.product_category) {
        query = query.eq('product_category', filters.product_category);
      }
      if (filters?.procurement_source) {
        query = query.eq('procurement_source', filters.procurement_source);
      }
      if (filters?.search) {
        query = query.ilike('product_name', `%${filters.search}%`);
      }

      // Efficient pagination
      const page = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 50, 100); // Cap at 100
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .range(from, to)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Optimized query error:', error);
        throw new Error(`Failed to load pharmaceutical data: ${error.message}`);
      }

      return {
        products: data || [],
        totalCount: count || 0,
        hasMore: (data?.length || 0) === pageSize,
        nextCursor: data && data.length > 0 ? data[data.length - 1].id : undefined
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Lightweight filter values query (cached separately)
  const filterValuesQuery = useQuery({
    queryKey: ['pharmaceutical-filter-values'],
    queryFn: async () => {
      const { data: facilitiesData } = await supabase
        .from('pharmaceutical_products')
        .select('facility')
        .limit(100);

      const facilities = Array.from(new Set(
        (facilitiesData || []).map(d => d.facility).filter(Boolean)
      )).slice(0, 50);

      return { 
        facilities, 
        regions: [], 
        zones: [], 
        woredas: [] 
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Update filter values when query succeeds
  if (filterValuesQuery.data && filterValues.facilities.length === 0) {
    setFilterValues(filterValuesQuery.data);
  }

  const refetch = () => {
    productsQuery.refetch();
  };

  return {
    products: productsQuery.data?.products || [],
    totalCount: productsQuery.data?.totalCount || 0,
    hasMore: productsQuery.data?.hasMore || false,
    filterValues,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error?.message || null,
    refetch,
    isFetching: productsQuery.isFetching
  };
};
