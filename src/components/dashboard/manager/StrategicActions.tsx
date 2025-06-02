
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface StrategicActionsProps {
  criticalStockOuts: number;
}

const StrategicActions = ({ criticalStockOuts }: StrategicActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Strategic Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-red-800">Immediate Priority</h4>
            <Badge variant="destructive">High</Badge>
          </div>
          <p className="text-sm text-red-600 mb-2">
            {criticalStockOuts > 0 ? 
              `Address ${criticalStockOuts} critical stock-outs` :
              'Monitor vulnerable supply chains'}
          </p>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Take Action
          </Button>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Resource Optimization</h4>
            <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
          </div>
          <p className="text-sm text-blue-600 mb-2">
            Review budget allocation and redistribute resources for better coverage
          </p>
          <Button size="sm" variant="outline">
            View Analysis
          </Button>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Performance Review</h4>
            <Badge className="bg-green-100 text-green-800">Monthly</Badge>
          </div>
          <p className="text-sm text-green-600 mb-2">
            Generate comprehensive performance report for stakeholders
          </p>
          <Button size="sm" variant="outline">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicActions;
