
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Plus, DollarSign } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';

const ProductsDataTable = () => {
  const { canAccess } = usePermissions();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock products data
  const products = [
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      code: 'AMX-500',
      category: 'Antibiotic',
      unit: 'Capsules',
      unitPrice: 0.25,
      venClassification: 'E',
      status: 'Active',
      stock: 1250,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Paracetamol 500mg',
      code: 'PCM-500', 
      category: 'Analgesic',
      unit: 'Tablets',
      unitPrice: 0.15,
      venClassification: 'V',
      status: 'Active',
      stock: 2800,
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Insulin Glargine',
      code: 'INS-GLA',
      category: 'Antidiabetic',
      unit: 'Vials',
      unitPrice: 45.00,
      venClassification: 'V',
      status: 'Low Stock',
      stock: 12,
      lastUpdated: '2024-01-13'
    }
  ];

  const getVenBadgeColor = (classification: string) => {
    switch (classification) {
      case 'V': return 'bg-green-100 text-green-800';
      case 'E': return 'bg-yellow-100 text-yellow-800';
      case 'N': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProductCreated = (newProduct: any) => {
    console.log('New product created:', newProduct);
    // In real app, this would update the products list
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Catalog
            </CardTitle>
            <CardDescription>
              Manage pharmaceutical products and inventory
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
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">Code: {product.code} • {product.category}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getVenBadgeColor(product.venClassification)}>
                    {product.venClassification}
                  </Badge>
                  <Badge className={getStatusBadgeColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Unit:</span>
                  <span className="font-medium ml-2">{product.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium ml-2 flex items-center">
                    <DollarSign className="h-3 w-3" />
                    {product.unitPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className={`font-medium ml-2 ${product.stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Updated:</span>
                  <span className="font-medium ml-2">{new Date(product.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first product</p>
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
