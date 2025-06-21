
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
  const [filterValues, setFilterValues] = useState<{
    facilities: string[];
    regions: string[];
    zones: string[];
    woredas: string[];
  }>({ facilities: [], regions: [], zones: [], woredas: [] });
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      console.log('Fetching optimized dataset metrics...');

      // Get total record count only - much faster
      const { count, error: countError } = await supabase
        .from('pharmaceutical_products')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Use aggregate functions instead of fetching all data
      const { data: aggregateData, error: aggregateError } = await supabase
        .rpc('get_pharmaceutical_metrics');

      if (aggregateError) {
        console.log('RPC function not available, using fallback approach');
        
        // Fallback: Get aggregated data with a limit to prevent timeout
        const { data: sampleData, error: sampleError } = await supabase
          .from('pharmaceutical_products')
          .select('miazia_price, facility, region')
          .limit(10000); // Limit to prevent timeout

        if (sampleError) throw sampleError;

        if (sampleData) {
          const totalValue = sampleData.reduce((sum, item) => sum + (item.miazia_price || 0), 0);
          const uniqueFacilities = new Set(sampleData.map(item => item.facility)).size;
          const uniqueRegions = new Set(sampleData.map(item => item.region).filter(Boolean)).size;

          // Estimate total value based on sample
          const estimatedTotalValue = (totalValue * (count || 0)) / sampleData.length;

          setAllProductsMetrics({
            totalProducts: count || 0,
            totalValue: estimatedTotalValue,
            uniqueFacilities,
            uniqueRegions
          });
        }
      } else {
        // Use RPC results if available
        setAllProductsMetrics({
          totalProducts: count || 0,
          totalValue: aggregateData?.total_value || 0,
          uniqueFacilities: aggregateData?.unique_facilities || 0,
          uniqueRegions: aggregateData?.unique_regions || 0
        });
      }

      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching metrics:', err);
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
      // Fetch distinct values with limits to prevent timeout
      const [facilitiesResult, regionsResult, zonesResult, woredasResult] = await Promise.all([
        supabase.from('pharmaceutical_products').select('facility').limit(1000),
        supabase.from('pharmaceutical_products').select('region').limit(1000),
        supabase.from('pharmaceutical_products').select('zone').limit(1000),
        supabase.from('pharmaceutical_products').select('woreda').limit(1000)
      ]);

      const facilities = Array.from(new Set(
        (facilitiesResult.data || []).map(d => d.facility).filter(Boolean)
      ));
      
      const regionNames = Array.from(new Set(
        (regionsResult.data || []).map(d => d.region).filter(Boolean)
      ));
      
      const zoneNames = Array.from(new Set(
        (zonesResult.data || []).map(d => d.zone).filter(Boolean)
      ));
      
      const woredaNames = Array.from(new Set(
        (woredasResult.data || []).map(d => d.woreda).filter(Boolean)
      ));

      setFilterValues({ 
        facilities, 
        regions: regionNames, 
        zones: zoneNames, 
        woredas: woredaNames 
      });
    } catch (err) {
      console.error('Error fetching filter values:', err);
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

      // Apply filters - support both old text fields and new normalized IDs
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

      // Always use pagination for performance
      const page = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 50, 200); // Cap at 200 for performance
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);
      query = query.order('created_at', { ascending: false });

      // Execute query with timeout handling
      const { data, error, count } = await Promise.race([
        query,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 30000) // 30 second timeout
        )
      ]) as any;

      if (error) {
        console.error('Database error:', error);
        if (error.code === '57014' || error.message.includes('timeout')) {
          setError('Query timed out. Please try filtering your results or reducing the page size.');
        } else if (error.code === '42501' || error.message.includes('policy')) {
          setError('Unable to access pharmaceutical data. Please check your permissions or try logging in again.');
        } else {
          setError(`Failed to fetch pharmaceutical products: ${error.message}`);
        }
        setProducts([]);
        return;
      }

      setProducts(data || []);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch pharmaceutical products';
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'The query is taking too long. Please try filtering your results or using a smaller page size.';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('Error fetching products:', errorMessage);
      setError(errorMessage);
      setProducts([]);
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
    // Only fetch metrics and filter values on component mount, not on every filter change
    const timeoutId = setTimeout(() => {
      fetchMetrics();
      fetchFilterValues();
    }, 1000); // Reduced delay

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - only run once

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
