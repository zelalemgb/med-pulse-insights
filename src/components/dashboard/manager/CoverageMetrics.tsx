
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface CoverageMetricsProps {
  keyMetrics: Record<string, number | string>;
}

const CoverageMetrics = ({ keyMetrics }: CoverageMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Coverage & Impact Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(keyMetrics).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toLocaleString() : value}</div>
              <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverageMetrics;
