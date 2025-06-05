
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Package, ArrowRight, Plus } from 'lucide-react';

interface ProductSelectionStepProps {
  selectedProducts: string[];
  onUpdateProducts: (products: string[]) => void;
  onNext: () => void;
}

const commonMedicines = [
  { id: 'paracetamol-500mg', name: 'Paracetamol 500mg', category: 'Analgesic', unit: 'Tablets' },
  { id: 'amoxicillin-250mg', name: 'Amoxicillin 250mg', category: 'Antibiotic', unit: 'Capsules' },
  { id: 'ors-sachets', name: 'ORS Sachets', category: 'Rehydration', unit: 'Sachets' },
  { id: 'malaria-rdt', name: 'Malaria RDT', category: 'Diagnostic', unit: 'Tests' },
  { id: 'iron-folate', name: 'Iron + Folate', category: 'Supplement', unit: 'Tablets' },
  { id: 'cotrimoxazole', name: 'Cotrimoxazole', category: 'Antibiotic', unit: 'Tablets' },
  { id: 'artesunate', name: 'Artesunate', category: 'Antimalarial', unit: 'Vials' },
  { id: 'vitamin-a', name: 'Vitamin A Capsules', category: 'Supplement', unit: 'Capsules' },
];

export const ProductSelectionStep = ({ 
  selectedProducts, 
  onUpdateProducts, 
  onNext 
}: ProductSelectionStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customProduct, setCustomProduct] = useState('');

  const filteredMedicines = commonMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onUpdateProducts(selectedProducts.filter(id => id !== productId));
    } else {
      onUpdateProducts([...selectedProducts, productId]);
    }
  };

  const addCustomProduct = () => {
    if (customProduct.trim() && !selectedProducts.includes(customProduct)) {
      onUpdateProducts([...selectedProducts, customProduct.trim()]);
      setCustomProduct('');
    }
  };

  const handleNext = () => {
    if (selectedProducts.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Select Products to Track
          </CardTitle>
          <CardDescription>
            Choose the medicines and health products you want to enter consumption and stock data for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected products summary */}
          {selectedProducts.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Products ({selectedProducts.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.slice(0, 5).map((productId) => {
                  const product = commonMedicines.find(m => m.id === productId);
                  return (
                    <Badge key={productId} variant="secondary">
                      {product?.name || productId}
                    </Badge>
                  );
                })}
                {selectedProducts.length > 5 && (
                  <Badge variant="outline">+{selectedProducts.length - 5} more</Badge>
                )}
              </div>
            </div>
          )}

          {/* Product list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProducts.includes(medicine.id)
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleProduct(medicine.id)}
              >
                <Checkbox
                  checked={selectedProducts.includes(medicine.id)}
                  onChange={() => toggleProduct(medicine.id)}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{medicine.name}</p>
                  <p className="text-xs text-gray-600">{medicine.category} • {medicine.unit}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom product */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Add Custom Product</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter product name..."
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomProduct()}
              />
              <Button onClick={addCustomProduct} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={selectedProducts.length === 0}
          className="min-w-[120px]"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
