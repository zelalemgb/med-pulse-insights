
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Plus, DollarSign, Info } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import { useProducts } from '@/hooks/useProducts';

const ProductsDataTable = () => {
  const { canAccess } = usePermissions();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: products, isLoading, error, refetch } = useProducts();

  // Fetch products on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const getVenBadgeColor = (classification: string) => {
    switch (classification) {
      case 'V': return 'bg-green-100 text-green-800 border-green-200';
      case 'E': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'N': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVenDescription = (classification: string) => {
    switch (classification) {
      case 'V': return 'Vital - Life-saving medicines';
      case 'E': return 'Essential - Important for healthcare';
      case 'N': return 'Non-essential - Used for minor conditions';
      default: return 'Unknown classification';
    }
  };

  const handleProductCreated = (newProduct: any) => {
    console.log('New product created:', newProduct);
    // Refresh the products list
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500">Error loading products: {error}</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Catalog ({products.length} products)
            </CardTitle>
            <CardDescription>
              Manage pharmaceutical products, pricing, and inventory
            </CardDescription>
          </div>
          {canAccess.createProducts && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product: any) => (
            <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{product.product_name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {product.product_code}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    className={`${getVenBadgeColor(product.ven_classification)} border`}
                    title={getVenDescription(product.ven_classification)}
                  >
                    {product.ven_classification}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Unit:</span>
                  <span className="font-medium">{product.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Package Size:</span>
                  <span className="font-medium">{product.package_size ?? 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Unit Price:</span>
                  <span className="font-medium flex items-center">
                    <DollarSign className="h-3 w-3" />
                    {Number(product.unit_price).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Frequency:</span>
                  <span className="font-medium">{product.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Created:</span>
                  <span className="font-medium">{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Source: <span className="font-medium text-gray-700">
                      {product.procurement_source}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first pharmaceutical product</p>
            {canAccess.createProducts && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CreateProductDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleProductCreated}
      />
    </Card>
  );
};

export default ProductsDataTable;
