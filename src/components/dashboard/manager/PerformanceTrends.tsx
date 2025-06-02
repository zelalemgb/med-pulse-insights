
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface PerformanceTrendsProps {
  avgAvailabilityRate: number;
}

const PerformanceTrends = ({ avgAvailabilityRate }: PerformanceTrendsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Supply Chain Performance Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Product Availability</span>
              <span className="text-sm text-green-600">↗ +2.3%</span>
            </div>
            <Progress value={avgAvailabilityRate} className="h-2" />
            <p className="text-xs text-gray-600">Improved from last quarter</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Stock-out Frequency</span>
              <span className="text-sm text-green-600">↘ -18%</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-gray-600">Significant reduction achieved</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Lead Time Efficiency</span>
              <span className="text-sm text-blue-600">↗ +12%</span>
            </div>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-gray-600">Faster procurement cycles</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrends;
