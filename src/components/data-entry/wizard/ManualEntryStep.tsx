
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Calculator, Upload } from 'lucide-react';

interface ManualEntryStepProps {
  selectedProducts: string[];
  inputMethod: 'manual' | 'upload';
  entryData: Record<string, any>;
  onUpdateData: (data: Record<string, any>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ManualEntryStep = ({ 
  selectedProducts, 
  inputMethod, 
  entryData, 
  onUpdateData, 
  onNext, 
  onPrev 
}: ManualEntryStepProps) => {
  const [activeProduct, setActiveProduct] = useState(selectedProducts[0] || '');

  const updateProductData = (productId: string, field: string, value: any) => {
    const updatedData = {
      ...entryData,
      [productId]: {
        ...entryData[productId],
        [field]: value
      }
    };
    onUpdateData(updatedData);
  };

  const calculateEndingBalance = (productId: string) => {
    const product = entryData[productId] || {};
    const beginning = Number(product.beginningBalance) || 0;
    const received = Number(product.received) || 0;
    const issued = Number(product.issued) || 0;
    const expired = Number(product.expired) || 0;
    
    return Math.max(0, beginning + received - issued - expired);
  };

  const isDataComplete = () => {
    return selectedProducts.every(productId => {
      const product = entryData[productId];
      return product && 
        product.beginningBalance !== undefined && 
        product.received !== undefined && 
        product.issued !== undefined;
    });
  };

  if (inputMethod === 'upload') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Data File
            </CardTitle>
            <CardDescription>
              Upload your Excel or CSV file with pharmaceutical data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
              <p className="text-gray-500 mb-4">Supports Excel (.xlsx) and CSV (.csv) files up to 5MB</p>
              <Button variant="outline">
                Choose File
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <Button variant="link" size="sm">
                Download Template File
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button onClick={onNext} disabled={!isDataComplete()}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Enter Consumption & Stock Data
          </CardTitle>
          <CardDescription>
            Enter data for each selected product. Use tabs to switch between products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeProduct} onValueChange={setActiveProduct}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-6">
              {selectedProducts.slice(0, 6).map((productId) => (
                <TabsTrigger 
                  key={productId} 
                  value={productId}
                  className="text-xs truncate"
                >
                  {productId.length > 12 ? `${productId.substring(0, 12)}...` : productId}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedProducts.map((productId) => (
              <TabsContent key={productId} value={productId} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{productId}</h3>
                  <p className="text-sm text-gray-600">Enter quarterly data for this product</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`${productId}-beginning`}>Beginning Balance</Label>
                    <Input
                      id={`${productId}-beginning`}
                      type="number"
                      placeholder="0"
                      value={entryData[productId]?.beginningBalance || ''}
                      onChange={(e) => updateProductData(productId, 'beginningBalance', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${productId}-received`}>Quantity Received</Label>
                    <Input
                      id={`${productId}-received`}
                      type="number"
                      placeholder="0"
                      value={entryData[productId]?.received || ''}
                      onChange={(e) => updateProductData(productId, 'received', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${productId}-issued`}>Quantity Issued/Consumed</Label>
                    <Input
                      id={`${productId}-issued`}
                      type="number"
                      placeholder="0"
                      value={entryData[productId]?.issued || ''}
                      onChange={(e) => updateProductData(productId, 'issued', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${productId}-expired`}>Expired/Damaged</Label>
                    <Input
                      id={`${productId}-expired`}
                      type="number"
                      placeholder="0"
                      value={entryData[productId]?.expired || ''}
                      onChange={(e) => updateProductData(productId, 'expired', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${productId}-stockout`}>Stock-out Days</Label>
                    <Input
                      id={`${productId}-stockout`}
                      type="number"
                      placeholder="0"
                      max="90"
                      value={entryData[productId]?.stockOutDays || ''}
                      onChange={(e) => updateProductData(productId, 'stockOutDays', e.target.value)}
                    />
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <Label>Calculated Ending Balance</Label>
                    <div className="text-lg font-semibold text-blue-600">
                      {calculateEndingBalance(productId)}
                    </div>
                  </div>
                </div>

                {/* Helper information */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Data Entry Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Beginning Balance: Stock at start of period</li>
                    <li>• Received: New stock received during period</li>
                    <li>• Issued: Amount given to patients/consumed</li>
                    <li>• Stock-out Days: Days when product was unavailable (max 90)</li>
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onNext} disabled={!isDataComplete()}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
