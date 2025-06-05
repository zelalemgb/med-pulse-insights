
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface ValidationStepProps {
  entryData: Record<string, any>;
  onValidationComplete: (results: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ValidationResult {
  productId: string;
  status: 'valid' | 'warning' | 'error';
  issues: string[];
  calculations: {
    endingBalance: number;
    consumptionRate: number;
    wastageRate: number;
  };
}

export const ValidationStep = ({ 
  entryData, 
  onValidationComplete, 
  onNext, 
  onPrev 
}: ValidationStepProps) => {
  const [validating, setValidating] = useState(true);
  const [results, setResults] = useState<ValidationResult[]>([]);

  useEffect(() => {
    validateData();
  }, [entryData]);

  const validateData = async () => {
    setValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const validationResults: ValidationResult[] = Object.keys(entryData).map(productId => {
      const product = entryData[productId];
      const issues: string[] = [];
      let status: 'valid' | 'warning' | 'error' = 'valid';

      // Calculate metrics
      const beginning = Number(product.beginningBalance) || 0;
      const received = Number(product.received) || 0;
      const issued = Number(product.issued) || 0;
      const expired = Number(product.expired) || 0;
      const stockOutDays = Number(product.stockOutDays) || 0;

      const endingBalance = Math.max(0, beginning + received - issued - expired);
      const totalAvailable = beginning + received;
      const wastageRate = totalAvailable > 0 ? (expired / totalAvailable) * 100 : 0;
      const consumptionRate = totalAvailable > 0 ? (issued / totalAvailable) * 100 : 0;

      // Validation rules
      if (beginning < 0 || received < 0 || issued < 0 || expired < 0) {
        issues.push('Negative values are not allowed');
        status = 'error';
      }

      if (stockOutDays > 90) {
        issues.push('Stock-out days cannot exceed 90 (quarterly period)');
        status = 'error';
      }

      if (issued > totalAvailable) {
        issues.push('Issued quantity exceeds available stock');
        status = 'error';
      }

      if (wastageRate > 10) {
        issues.push(`High wastage rate (${wastageRate.toFixed(1)}%)`);
        status = status === 'error' ? 'error' : 'warning';
      }

      if (stockOutDays > 0 && endingBalance > 0) {
        issues.push('Stock-out days reported but ending balance is positive');
        status = status === 'error' ? 'error' : 'warning';
      }

      if (consumptionRate < 20) {
        issues.push('Very low consumption rate - please verify');
        status = status === 'error' ? 'error' : 'warning';
      }

      return {
        productId,
        status,
        issues,
        calculations: {
          endingBalance,
          consumptionRate,
          wastageRate
        }
      };
    });

    setResults(validationResults);
    onValidationComplete(validationResults);
    setValidating(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  const hasErrors = results.some(r => r.status === 'error');
  const hasWarnings = results.some(r => r.status === 'warning');
  const validCount = results.filter(r => r.status === 'valid').length;

  if (validating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Validating Data...
            </CardTitle>
            <CardDescription>
              Checking your data for errors and calculating metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Progress value={66} className="w-full mb-4" />
              <p className="text-gray-600">Running validation checks...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Validation Results
          </CardTitle>
          <CardDescription>
            Review data validation results and fix any errors before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{validCount}</div>
              <div className="text-sm text-green-700">Valid</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {results.filter(r => r.status === 'warning').length}
              </div>
              <div className="text-sm text-amber-700">Warnings</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-red-700">Errors</div>
            </div>
          </div>

          {/* Detailed results */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div key={result.productId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <h4 className="font-medium">{result.productId}</h4>
                  </div>
                  {getStatusBadge(result.status)}
                </div>

                {result.issues.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Issues:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ending Balance:</span>
                    <div className="font-medium">{result.calculations.endingBalance}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Consumption Rate:</span>
                    <div className="font-medium">{result.calculations.consumptionRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Wastage Rate:</span>
                    <div className="font-medium">{result.calculations.wastageRate.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasErrors && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                Please fix all errors before proceeding to the next step.
              </p>
            </div>
          )}

          {hasWarnings && !hasErrors && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium">
                Warnings detected. You can proceed, but please review the flagged items.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onNext} disabled={hasErrors}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
