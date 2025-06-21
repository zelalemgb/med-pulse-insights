
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
      console.log('Fetching optimized dataset metrics...');
      
      // Use simpler, faster queries with timeouts
      const metricsPromises = await Promise.allSettled([
        // Get count with timeout and limit
        supabase
          .from('pharmaceutical_products')
          .select('id', { count: 'estimated', head: true })
          .limit(1),
        
        // Get unique regions efficiently
        supabase
          .from('pharmaceutical_products')
          .select('region')
          .not('region', 'is', null)
          .limit(1000),
        
        // Get unique facilities efficiently  
        supabase
          .from('pharmaceutical_products')
          .select('facility')
          .not('facility', 'is', null)
          .limit(1000),
        
        // Get total value with sampling for large datasets
        supabase
          .from('pharmaceutical_products')
          .select('miazia_price')
          .not('miazia_price', 'is', null)
          .limit(10000) // Sample first 10k records for performance
      ]);

      // Process results safely
      const [countResult, regionsResult, facilitiesResult, valueResult] = metricsPromises;
      
      let totalProducts = 0;
      let uniqueRegions = 0;
      let uniqueFacilities = 0;
      let totalValue = 0;

      if (countResult.status === 'fulfilled' && !countResult.value.error) {
        totalProducts = countResult.value.count || 0;
      }

      if (regionsResult.status === 'fulfilled' && !regionsResult.value.error && regionsResult.value.data) {
        uniqueRegions = new Set(regionsResult.value.data.map(item => item.region).filter(Boolean)).size;
      }

      if (facilitiesResult.status === 'fulfilled' && !facilitiesResult.value.error && facilitiesResult.value.data) {
        uniqueFacilities = new Set(facilitiesResult.value.data.map(item => item.facility).filter(Boolean)).size;
      }

      if (valueResult.status === 'fulfilled' && !valueResult.value.error && valueResult.value.data) {
        const sampleValue = valueResult.value.data.reduce((sum, item) => sum + (item.miazia_price || 0), 0);
        // Estimate total value based on sample
        const sampleSize = valueResult.value.data.length;
        if (sampleSize > 0 && totalProducts > 0) {
          totalValue = (sampleValue / sampleSize) * totalProducts;
        }
      }

      console.log('Optimized dataset metrics:', {
        totalProducts,
        totalValue,
        uniqueFacilities,
        uniqueRegions
      });

      setAllProductsMetrics({
        totalProducts,
        totalValue,
        uniqueFacilities,
        uniqueRegions
      });

      setTotalCount(totalProducts);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      // Provide fallback metrics
      setAllProductsMetrics({
        totalProducts: 0,
        totalValue: 0,
        uniqueFacilities: 0,
        uniqueRegions: 0
      });
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
    // Debounce metrics fetching to prevent overwhelming the database
    const timeoutId = setTimeout(() => {
      fetchMetrics();
    }, 2000);

    return () => clearTimeout(timeoutId);
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
