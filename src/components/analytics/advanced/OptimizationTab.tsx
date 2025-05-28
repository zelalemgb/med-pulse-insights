
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';

const OptimizationTab: React.FC = () => {
  const costData = [
    { name: 'Current', cost: 100000, optimized: 85000 },
    { name: 'Forecasting', cost: 92000, optimized: 78000 },
    { name: 'Inventory', cost: 88000, optimized: 75000 },
    { name: 'Supply Chain', cost: 85000, optimized: 70000 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Demand Forecasting</h4>
                <p className="text-sm text-blue-700">Implement seasonal adjustments to reduce 23% of stock-outs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Inventory Optimization</h4>
                <p className="text-sm text-green-700">Adjust safety stock levels to reduce wastage by 15%</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Supply Chain</h4>
                <p className="text-sm text-amber-700">Optimize delivery schedules to improve efficiency by 18%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#ff7300" name="Current Cost" />
              <Bar dataKey="optimized" fill="#00C49F" name="Optimized Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationTab;
