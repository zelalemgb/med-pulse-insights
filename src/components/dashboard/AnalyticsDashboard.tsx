
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MultiLevelAggregation from '@/components/analytics/MultiLevelAggregation';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import { BarChart3, Brain, Database, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // System performance metrics
  const systemMetrics = {
    dataProcessingRate: '2.4M records/min',
    predictionLatency: '120ms',
    cacheEfficiency: '94%',
    modelAccuracy: '87%',
    systemUptime: '99.9%',
    activeModels: 5
  };

  const handleSystemOptimization = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Advanced Analytics System
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                System Online
              </Badge>
              <Button onClick={handleSystemOptimization} disabled={isProcessing} size="sm">
                {isProcessing ? <Zap className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                {isProcessing ? 'Optimizing...' : 'Optimize'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemMetrics.dataProcessingRate}</div>
              <div className="text-xs text-muted-foreground">Processing Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.predictionLatency}</div>
              <div className="text-xs text-muted-foreground">Prediction Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemMetrics.cacheEfficiency}</div>
              <div className="text-xs text-muted-foreground">Cache Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemMetrics.modelAccuracy}</div>
              <div className="text-xs text-muted-foreground">Model Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{systemMetrics.systemUptime}</div>
              <div className="text-xs text-muted-foreground">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{systemMetrics.activeModels}</div>
              <div className="text-xs text-muted-foreground">Active Models</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="aggregation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="aggregation" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Multi-Level Aggregation
          </TabsTrigger>
          <TabsTrigger value="ml-analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Advanced ML Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aggregation">
          <MultiLevelAggregation />
        </TabsContent>

        <TabsContent value="ml-analytics">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            System Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Cache optimization increased performance by 15%</span>
              <Badge variant="secondary" className="ml-auto">Info</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">ML model accuracy improved to 87% after latest training</span>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">Success</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm">Consider scaling data processing for peak hours</span>
              <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-800">Recommendation</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
