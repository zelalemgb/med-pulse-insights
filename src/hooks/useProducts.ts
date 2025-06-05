
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  name: string;
  code?: string;
  category: string;
  unit: string;
  packageSize: number;
  unitPrice: number;
  venClassification: 'V' | 'E' | 'N';
  description?: string;
}

export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mutateAsync = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating product with data:', data);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert into the products table
        const { data: product, error } = await supabase
          .from('products')
          .insert({
            product_name: data.name,
            product_code: data.code || `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            unit: data.unit,
            package_size: data.packageSize,
            unit_price: data.unitPrice,
            ven_classification: data.venClassification,
          frequency: 'monthly', // Default frequency
          procurement_source: 'local', // Default procurement source
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to create product: ${error.message}`);
      }

      console.log('Product created successfully in database:', product);
      
      toast({
        title: "Product Created",
        description: `${data.name} has been created successfully.`,
      });

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: products,
    isLoading,
    error,
    refetch: fetchProducts
  };
};
