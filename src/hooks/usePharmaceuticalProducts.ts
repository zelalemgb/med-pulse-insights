
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PharmaceuticalProduct, PharmaceuticalProductFilters } from '@/types/pharmaceuticalProducts';
import { useToast } from '@/hooks/use-toast';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  enablePagination?: boolean;
}

interface PharmaceuticalMetrics {
  total_value: number;
  unique_facilities: number;
  unique_regions: number;
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
  const [filterValues, setFilterValues] = useState<{
    facilities: string[];
    regions: string[];
    zones: string[];
    woredas: string[];
  }>({ facilities: [], regions: [], zones: [], woredas: [] });
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      console.log('Fetching minimal metrics for performance...');

      // Ultra-lightweight count query with timeout
      const countPromise = supabase
        .from('pharmaceutical_products')
        .select('*', { count: 'exact', head: true });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Count query timeout')), 10000)
      );

      const { count, error: countError } = await Promise.race([
        countPromise,
        timeoutPromise
      ]) as any;

      if (countError) {
        console.log('Count query failed, using fallback');
        setAllProductsMetrics({
          totalProducts: 0,
          totalValue: 0,
          uniqueFacilities: 0,
          uniqueRegions: 0
        });
        return;
      }

      // Very small sample for metrics estimation - just 100 records
      const { data: sampleData, error: sampleError } = await supabase
        .from('pharmaceutical_products')
        .select('miazia_price, facility, region')
        .limit(100);

      if (sampleError || !sampleData) {
        console.log('Sample query failed, using count only');
        setAllProductsMetrics({
          totalProducts: count || 0,
          totalValue: 0,
          uniqueFacilities: 0,
          uniqueRegions: 0
        });
        setTotalCount(count || 0);
        return;
      }

      // Calculate estimates from tiny sample
      const avgValue = sampleData.reduce((sum, item) => sum + (item.miazia_price || 0), 0) / sampleData.length;
      const estimatedTotalValue = avgValue * (count || 0);
      const uniqueFacilities = new Set(sampleData.map(item => item.facility)).size;
      const uniqueRegions = new Set(sampleData.map(item => item.region).filter(Boolean)).size;

      setAllProductsMetrics({
        totalProducts: count || 0,
        totalValue: estimatedTotalValue,
        uniqueFacilities: Math.ceil(uniqueFacilities * (count || 0) / sampleData.length),
        uniqueRegions: Math.ceil(uniqueRegions * (count || 0) / sampleData.length)
      });

      setTotalCount(count || 0);
    } catch (err) {
      console.error('Metrics fetch failed completely:', err);
      setAllProductsMetrics({
        totalProducts: 0,
        totalValue: 0,
        uniqueFacilities: 0,
        uniqueRegions: 0
      });
    }
  };

  const fetchFilterValues = async () => {
    try {
      // Very limited filter value fetching
      const [facilitiesResult] = await Promise.all([
        supabase.from('pharmaceutical_products').select('facility').limit(50)
      ]);

      const facilities = Array.from(new Set(
        (facilitiesResult.data || []).map(d => d.facility).filter(Boolean)
      )).slice(0, 20); // Limit to 20 facilities

      setFilterValues({ 
        facilities, 
        regions: [], // Skip regions for performance
        zones: [], // Skip zones for performance
        woredas: [] // Skip woredas for performance
      });
    } catch (err) {
      console.error('Filter values fetch failed:', err);
      setFilterValues({ facilities: [], regions: [], zones: [], woredas: [] });
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('pharmaceutical_products')
        .select(`
          *,
          regions!region_id(id, name, code),
          zones!zone_id(id, name, code),
          woredas!woreda_id(id, name, code)
        `);

      // Apply filters
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

      // Very small page sizes for performance
      const page = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 25, 50); // Max 50 records
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);
      query = query.order('created_at', { ascending: false });

      // Short timeout for product queries
      const queryPromise = query;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 15000)
      );

      const { data, error, count } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Product query error:', error);
        if (error.code === '57014' || error.message.includes('timeout')) {
          setError('The query is taking too long. Please use filters to narrow your search or try again later.');
        } else if (error.code === '42501' || error.message.includes('policy')) {
          setError('Access denied. Please check your permissions.');
        } else {
          setError(`Unable to load data: ${error.message}`);
        }
        setProducts([]);
        return;
      }

      setProducts(data || []);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (err) {
      let errorMessage = 'Unable to load pharmaceutical data';
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'The request timed out. Please try using filters to reduce the data load or refresh the page.';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('Products fetch error:', errorMessage);
      setError(errorMessage);
      setProducts([]);
      toast({
        title: "Loading Error",
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
    // Load metrics and filters separately with delay
    const timeoutId = setTimeout(() => {
      Promise.all([
        fetchMetrics(),
        fetchFilterValues()
      ]).catch(console.error);
    }, 500); // Small delay to prioritize product loading

    return () => clearTimeout(timeoutId);
  }, []); // Only run once

  return {
    products,
    totalCount,
    allProductsMetrics,
    filterValues,
    isLoading,
    error,
    refetch: fetchProducts
  };
};
