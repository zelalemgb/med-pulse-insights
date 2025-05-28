
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductData {
  productName: string;
  unit: string;
  unitPrice: number;
  venClassification: 'V' | 'E' | 'N';
  facilitySpecific: boolean;
  procurementSource: string;
  quarters: QuarterData[];
}

interface QuarterData {
  quarter: number;
  beginningBalance: number;
  received: number;
  positiveAdj: number;
  negativeAdj: number;
  endingBalance: number;
  stockOutDays: number;
  expiredDamaged: number;
  consumptionIssue: number;
}

const DataEntry = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductData>({
    productName: '',
    unit: '',
    unitPrice: 0,
    venClassification: 'V',
    facilitySpecific: false,
    procurementSource: '',
    quarters: [
      { quarter: 1, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
      { quarter: 2, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
      { quarter: 3, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
      { quarter: 4, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 }
    ]
  });

  const updateProductInfo = (field: string, value: any) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateQuarterData = (quarterIndex: number, field: string, value: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      quarters: prev.quarters.map((quarter, index) => 
        index === quarterIndex 
          ? { ...quarter, [field]: value }
          : quarter
      )
    }));
  };

  const calculateEndingBalance = (quarterIndex: number) => {
    const quarter = currentProduct.quarters[quarterIndex];
    const endingBalance = quarter.beginningBalance + quarter.received + quarter.positiveAdj - quarter.negativeAdj - quarter.consumptionIssue - quarter.expiredDamaged;
    updateQuarterData(quarterIndex, 'endingBalance', Math.max(0, endingBalance));
  };

  const addProduct = () => {
    if (!currentProduct.productName) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive"
      });
      return;
    }

    setProducts(prev => [...prev, { ...currentProduct }]);
    setCurrentProduct({
      productName: '',
      unit: '',
      unitPrice: 0,
      venClassification: 'V',
      facilitySpecific: false,
      procurementSource: '',
      quarters: [
        { quarter: 1, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
        { quarter: 2, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
        { quarter: 3, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
        { quarter: 4, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 }
      ]
    });

    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const removeProduct = (index: number) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Product Removed",
      description: "Product has been removed from the list",
    });
  };

  const saveAllData = () => {
    console.log('Saving data:', products);
    toast({
      title: "Data Saved",
      description: `${products.length} products saved successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pharmaceutical Data Entry</h1>
          <p className="text-gray-600 mt-2">Enter quarterly pharmaceutical usage data for your facility</p>
        </div>

        {/* Product List Summary */}
        {products.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Added Products ({products.length})
                <Button onClick={saveAllData} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{product.productName}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Unit: {product.unit}</p>
                      <p>Price: ${product.unitPrice}</p>
                      <Badge variant={product.venClassification === 'V' ? 'default' : product.venClassification === 'E' ? 'secondary' : 'outline'}>
                        {product.venClassification}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={currentProduct.productName}
                      onChange={(e) => updateProductInfo('productName', e.target.value)}
                      placeholder="e.g., Amoxicillin 500mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={currentProduct.unit}
                      onChange={(e) => updateProductInfo('unit', e.target.value)}
                      placeholder="e.g., 10x10, 125ml"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Unit Price ($)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      value={currentProduct.unitPrice}
                      onChange={(e) => updateProductInfo('unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venClassification">VEN Classification</Label>
                    <Select value={currentProduct.venClassification} onValueChange={(value) => updateProductInfo('venClassification', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V">V - Vital</SelectItem>
                        <SelectItem value="E">E - Essential</SelectItem>
                        <SelectItem value="N">N - Non-essential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="procurementSource">Procurement Source</Label>
                    <Input
                      id="procurementSource"
                      value={currentProduct.procurementSource}
                      onChange={(e) => updateProductInfo('procurementSource', e.target.value)}
                      placeholder="e.g., EPSS, Local Supplier"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="facilitySpecific"
                      checked={currentProduct.facilitySpecific}
                      onChange={(e) => updateProductInfo('facilitySpecific', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="facilitySpecific">Facility Specific</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quarterly Data */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quarterly Data</h3>
                <Tabs defaultValue="quarter1" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="quarter1">Quarter 1</TabsTrigger>
                    <TabsTrigger value="quarter2">Quarter 2</TabsTrigger>
                    <TabsTrigger value="quarter3">Quarter 3</TabsTrigger>
                    <TabsTrigger value="quarter4">Quarter 4</TabsTrigger>
                  </TabsList>

                  {[0, 1, 2, 3].map((quarterIndex) => (
                    <TabsContent key={quarterIndex} value={`quarter${quarterIndex + 1}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label>Beginning Balance</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].beginningBalance}
                            onChange={(e) => updateQuarterData(quarterIndex, 'beginningBalance', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Received</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].received}
                            onChange={(e) => {
                              updateQuarterData(quarterIndex, 'received', parseInt(e.target.value) || 0);
                              setTimeout(() => calculateEndingBalance(quarterIndex), 100);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Positive Adjustment</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].positiveAdj}
                            onChange={(e) => {
                              updateQuarterData(quarterIndex, 'positiveAdj', parseInt(e.target.value) || 0);
                              setTimeout(() => calculateEndingBalance(quarterIndex), 100);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Negative Adjustment</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].negativeAdj}
                            onChange={(e) => {
                              updateQuarterData(quarterIndex, 'negativeAdj', parseInt(e.target.value) || 0);
                              setTimeout(() => calculateEndingBalance(quarterIndex), 100);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Consumption/Issue</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].consumptionIssue}
                            onChange={(e) => {
                              updateQuarterData(quarterIndex, 'consumptionIssue', parseInt(e.target.value) || 0);
                              setTimeout(() => calculateEndingBalance(quarterIndex), 100);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Expired/Damaged</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].expiredDamaged}
                            onChange={(e) => {
                              updateQuarterData(quarterIndex, 'expiredDamaged', parseInt(e.target.value) || 0);
                              setTimeout(() => calculateEndingBalance(quarterIndex), 100);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Stock Out Days</Label>
                          <Input
                            type="number"
                            max="90"
                            value={currentProduct.quarters[quarterIndex].stockOutDays}
                            onChange={(e) => updateQuarterData(quarterIndex, 'stockOutDays', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Ending Balance (Calculated)</Label>
                          <Input
                            type="number"
                            value={currentProduct.quarters[quarterIndex].endingBalance}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setCurrentProduct({
                  productName: '',
                  unit: '',
                  unitPrice: 0,
                  venClassification: 'V',
                  facilitySpecific: false,
                  procurementSource: '',
                  quarters: [
                    { quarter: 1, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
                    { quarter: 2, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
                    { quarter: 3, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 },
                    { quarter: 4, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0 }
                  ]
                })}>
                  Clear Form
                </Button>
                <Button onClick={addProduct} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataEntry;
