
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PharmaceuticalProduct, PharmaceuticalProductFilters } from '@/types/pharmaceuticalProducts';
import { useToast } from '@/hooks/use-toast';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  enablePagination?: boolean;
}

export const usePharmaceuticalProducts = (filters?: PharmaceuticalProductFilters, pagination?: PaginationOptions) => {
  const [products, setProducts] = useState<PharmaceuticalProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [allProductsMetrics, setAllProductsMetrics] = useState<{
    totalProducts: number;
    totalValue: number;
    uniqueFacilities: number;
    uniqueRegions: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      console.log('Fetching complete dataset metrics...');
      
      // Get total count
      let countQuery = supabase
        .from('pharmaceutical_products')
        .select('*', { count: 'exact', head: true });

      const { count } = await countQuery;
      
      // Get aggregated metrics from ALL data using aggregation queries
      // This is more efficient than fetching all records
      const { data: miaziaData, error: miaziaError } = await supabase
        .from('pharmaceutical_products')
        .select('miazia_price')
        .not('miazia_price', 'is', null);

      if (miaziaError) throw miaziaError;

      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('pharmaceutical_products')
        .select('facility')
        .not('facility', 'is', null);

      if (facilitiesError) throw facilitiesError;

      const { data: regionsData, error: regionsError } = await supabase
        .from('pharmaceutical_products')
        .select('region')
        .not('region', 'is', null);

      if (regionsError) throw regionsError;

      if (miaziaData && facilitiesData && regionsData) {
        const totalValue = miaziaData.reduce((sum, item) => sum + (item.miazia_price || 0), 0);
        const uniqueFacilities = new Set(facilitiesData.map(item => item.facility)).size;
        const uniqueRegions = new Set(regionsData.map(item => item.region).filter(Boolean)).size;

        console.log('Complete dataset metrics:', {
          totalProducts: count || 0,
          totalValue,
          uniqueFacilities,
          uniqueRegions
        });

        setAllProductsMetrics({
          totalProducts: count || 0,
          totalValue,
          uniqueFacilities,
          uniqueRegions
        });
      }

      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('pharmaceutical_products')
        .select('*');

      // Apply filters
      if (filters?.facility) {
        query = query.ilike('facility', `%${filters.facility}%`);
      }
      
      if (filters?.region) {
        query = query.eq('region', filters.region);
      }
      
      if (filters?.zone) {
        query = query.eq('zone', filters.zone);
      }
      
      if (filters?.woreda) {
        query = query.eq('woreda', filters.woreda);
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

      // Apply pagination if enabled
      if (pagination?.enablePagination) {
        const page = pagination.page || 1;
        const pageSize = pagination.pageSize || 50;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        query = query.range(from, to);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch pharmaceutical products: ${error.message}`);
      }

      setProducts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pharmaceutical products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination?.page, pagination?.pageSize]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    products,
    totalCount,
    allProductsMetrics,
    isLoading,
    error,
    refetch: fetchProducts
  };
};
