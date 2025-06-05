
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Edit3, FileSpreadsheet, ArrowLeft, ArrowRight } from 'lucide-react';

interface DataInputMethodStepProps {
  inputMethod: 'manual' | 'upload';
  onSelectMethod: (method: 'manual' | 'upload') => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DataInputMethodStep = ({ 
  inputMethod, 
  onSelectMethod, 
  onNext, 
  onPrev 
}: DataInputMethodStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Choose Data Input Method
          </CardTitle>
          <CardDescription>
            Select how you want to enter your pharmaceutical data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Entry Option */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                inputMethod === 'manual' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onSelectMethod('manual')}
            >
              <CardContent className="p-6 text-center">
                <Edit3 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">Manual Entry</h3>
                <p className="text-gray-600 mb-4">
                  Enter data using guided forms for each product
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Built-in validation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Perfect for small datasets</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Option */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                inputMethod === 'upload' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onSelectMethod('upload')}
            >
              <CardContent className="p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold text-lg mb-2">File Upload</h3>
                <p className="text-gray-600 mb-4">
                  Upload Excel/CSV files with your data
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Bulk data import</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Excel/CSV support</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    ✓ <span>Great for large datasets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Method-specific information */}
          {inputMethod && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {inputMethod === 'manual' ? (
                <div>
                  <h4 className="font-medium mb-2">Manual Entry Process:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Fill in consumption data for each selected product</li>
                    <li>• Enter stock levels (beginning balance, received, issued)</li>
                    <li>• Record stock-out days and expired quantities</li>
                    <li>• System will calculate metrics automatically</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium mb-2">File Upload Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Supported formats: Excel (.xlsx), CSV (.csv)</li>
                    <li>• Include columns: Product Name, Beginning Balance, Received, Issued, Stock-out Days</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Template will be provided in the next step</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onNext} disabled={!inputMethod}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
