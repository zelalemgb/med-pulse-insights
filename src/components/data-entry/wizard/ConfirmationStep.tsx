
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowLeft, Send, Calendar, Package } from 'lucide-react';

interface ConfirmationStepProps {
  wizardData: any;
  onSubmit: () => void;
  onPrev: () => void;
}

export const ConfirmationStep = ({ 
  wizardData, 
  onSubmit, 
  onPrev 
}: ConfirmationStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate submission
    onSubmit();
  };

  const getTotalProducts = () => wizardData.selectedProducts.length;
  const getValidProducts = () => {
    return wizardData.validationResults?.filter((r: any) => r.status === 'valid').length || 0;
  };
  const getWarningProducts = () => {
    return wizardData.validationResults?.filter((r: any) => r.status === 'warning').length || 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Review & Submit Data
          </CardTitle>
          <CardDescription>
            Please review all information before submitting your pharmaceutical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Submission Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getTotalProducts()}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getValidProducts()}</div>
                <div className="text-sm text-gray-600">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{getWarningProducts()}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">Q1 2024</div>
                <div className="text-sm text-gray-600">Period</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Selected Products */}
          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Selected Products ({getTotalProducts()})
            </h4>
            <div className="flex flex-wrap gap-2">
              {wizardData.selectedProducts.map((productId: string) => (
                <Badge key={productId} variant="secondary" className="py-1">
                  {productId}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Data Entry Method */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Input Method</h4>
            <div className="flex items-center gap-2">
              <Badge variant={wizardData.inputMethod === 'manual' ? 'default' : 'secondary'}>
                {wizardData.inputMethod === 'manual' ? 'Manual Entry' : 'File Upload'}
              </Badge>
              <span className="text-gray-600">
                {wizardData.inputMethod === 'manual' 
                  ? 'Data entered using guided forms'
                  : 'Data uploaded from Excel/CSV file'
                }
              </span>
            </div>
          </div>

          <Separator />

          {/* Sample Data Preview */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Data Preview</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {wizardData.selectedProducts.slice(0, 3).map((productId: string) => {
                const productData = wizardData.entryData[productId] || {};
                return (
                  <div key={productId} className="mb-3 last:mb-0">
                    <div className="font-medium mb-1">{productId}</div>
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>Begin: {productData.beginningBalance || 0}</div>
                      <div>Received: {productData.received || 0}</div>
                      <div>Issued: {productData.issued || 0}</div>
                      <div>Stock-out: {productData.stockOutDays || 0} days</div>
                    </div>
                  </div>
                );
              })}
              {wizardData.selectedProducts.length > 3 && (
                <div className="text-sm text-gray-500 mt-2">
                  ... and {wizardData.selectedProducts.length - 3} more products
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Important Notes */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Data will be saved to your facility's pharmaceutical records</li>
              <li>• This submission covers the quarterly reporting period</li>
              <li>• You can edit this data later if needed</li>
              <li>• Metrics will be automatically calculated after submission</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Calendar className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
