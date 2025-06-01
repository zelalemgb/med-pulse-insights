import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { usePermissions } from '@/hooks/usePermissions';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';

// Mock data for now - this would come from Supabase later
const initialMockProducts = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    code: 'AMX-500',
    category: 'Antibiotic',
    unit: 'Capsules',
    unitPrice: 0.25,
    venClassification: 'E' as const,
    status: 'active' as const,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Paracetamol 500mg',
    code: 'PCM-500',
    category: 'Analgesic',
    unit: 'Tablets',
    unitPrice: 0.15,
    venClassification: 'V' as const,
    status: 'active' as const,
    createdAt: '2024-01-10',
  },
];

const Products = () => {
  const { canAccess } = usePermissions();
  const [products, setProducts] = useState(initialMockProducts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Products' }
  ];

  const handleProductCreated = (newProduct: any) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const getVenBadgeColor = (classification: string) => {
    switch (classification) {
      case 'V': return 'bg-green-100 text-green-800';
      case 'E': return 'bg-yellow-100 text-yellow-800';
      case 'N': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (!canAccess.createProducts && !canAccess.viewProducts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                You don't have permission to access the products module.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Pharmaceutical Products"
          description="Manage pharmaceutical products, their classifications, and inventory details"
          breadcrumbItems={breadcrumbItems}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900">Product Catalog</h2>
              <Badge variant="secondary">{products.length} products</Badge>
            </div>
            
            {canAccess.createProducts && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Code: {product.code}
                      </CardDescription>
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
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Unit:</span>
                      <span className="font-medium">{product.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Unit Price:</span>
                      <span className="font-medium">${product.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {(canAccess.editProducts || canAccess.deleteProducts) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {canAccess.editProducts && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {canAccess.deleteProducts && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-center mb-6">
                  Get started by creating your first pharmaceutical product.
                </p>
                {canAccess.createProducts && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <CreateProductDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleProductCreated}
        />
      </div>
    </div>
  );
};

export default Products;
