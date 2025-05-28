
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

const ScalabilityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Scalability & Performance Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-3">Data Processing</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Batch Processing</span>
                <Badge variant="secondary">Optimized</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Real-time Analytics</span>
                <Badge variant="secondary">2.3s avg</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Memory Usage</span>
                <Badge variant="secondary">68% efficient</Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Caching Strategy</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Redis Cache</span>
                <Badge variant="secondary">94% hit rate</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Query Optimization</span>
                <Badge variant="secondary">85% faster</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Index Coverage</span>
                <Badge variant="secondary">98% covered</Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">ML Model Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Training Time</span>
                <Badge variant="secondary">45min</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Inference Speed</span>
                <Badge variant="secondary">120ms</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Model Size</span>
                <Badge variant="secondary">156MB</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScalabilityTab;
