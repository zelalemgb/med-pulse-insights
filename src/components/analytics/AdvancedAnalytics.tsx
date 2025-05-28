
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, AlertCircle, Target, Zap, Database } from 'lucide-react';

interface MLForecast {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

interface PatternAnalysis {
  pattern: string;
  confidence: number;
  description: string;
  products: string[];
  impact: 'high' | 'medium' | 'low';
}

const AdvancedAnalytics = () => {
  const [selectedModel, setSelectedModel] = useState<'arima' | 'lstm' | 'prophet'>('prophet');
  const [forecastHorizon, setForecastHorizon] = useState<'3' | '6' | '12'>('6');
  const [isProcessing, setIsProcessing] = useState(false);

  // ML-based forecasting data with confidence intervals
  const forecastData: MLForecast[] = useMemo(() => [
    { period: 'Jan 2024', actual: 1200, predicted: 1180, confidence: 85, upperBound: 1250, lowerBound: 1110 },
    { period: 'Feb 2024', actual: 1150, predicted: 1165, confidence: 87, upperBound: 1220, lowerBound: 1110 },
    { period: 'Mar 2024', actual: 1300, predicted: 1285, confidence: 82, upperBound: 1380, lowerBound: 1190 },
    { period: 'Apr 2024', actual: 1100, predicted: 1125, confidence: 89, upperBound: 1200, lowerBound: 1050 },
    { period: 'May 2024', predicted: 1240, confidence: 78, upperBound: 1340, lowerBound: 1140 },
    { period: 'Jun 2024', predicted: 1195, confidence: 76, upperBound: 1300, lowerBound: 1090 },
    { period: 'Jul 2024', predicted: 1320, confidence: 74, upperBound: 1450, lowerBound: 1190 },
    { period: 'Aug 2024', predicted: 1275, confidence: 72, upperBound: 1410, lowerBound: 1140 },
  ], [selectedModel, forecastHorizon]);

  // Pattern recognition results
  const patternAnalysis: PatternAnalysis[] = [
    {
      pattern: 'Seasonal Surge',
      confidence: 92,
      description: 'Q4 consumption increases by 35% for respiratory medications',
      products: ['Amoxicillin', 'Cough Syrup', 'Paracetamol'],
      impact: 'high'
    },
    {
      pattern: 'Supply Chain Disruption',
      confidence: 78,
      description: 'Monthly delivery delays correlate with 15% wastage increase',
      products: ['Insulin', 'Vaccines', 'Antibiotics'],
      impact: 'high'
    },
    {
      pattern: 'Facility Size Correlation',
      confidence: 85,
      description: 'Larger facilities show 12% better efficiency in stock management',
      products: ['All Categories'],
      impact: 'medium'
    },
    {
      pattern: 'Expiry Prediction',
      confidence: 88,
      description: 'Products with <30 days shelf life have 67% higher wastage risk',
      products: ['Short-shelf life medicines'],
      impact: 'high'
    }
  ];

  // Advanced metrics for scalability
  const scalabilityMetrics = {
    dataProcessingTime: '2.3s',
    cacheHitRate: '94%',
    predictionAccuracy: '87%',
    modelTrainingTime: '45min',
    dataPoints: '1.2M',
    featuresProcessed: 156
  };

  const handleRunAnalysis = () => {
    setIsProcessing(true);
    // Simulate ML processing
    setTimeout(() => setIsProcessing(false), 3000);
  };

  const getPatternBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* ML Model Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Advanced Analytics Engine
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedModel} onValueChange={(value: any) => setSelectedModel(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prophet">Prophet</SelectItem>
                  <SelectItem value="arima">ARIMA</SelectItem>
                  <SelectItem value="lstm">LSTM Neural Net</SelectItem>
                </SelectContent>
              </Select>
              <Select value={forecastHorizon} onValueChange={(value: any) => setForecastHorizon(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRunAnalysis} disabled={isProcessing}>
                {isProcessing ? <Zap className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                {isProcessing ? 'Processing...' : 'Run Analysis'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{scalabilityMetrics.predictionAccuracy}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scalabilityMetrics.cacheHitRate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalabilityMetrics.dataProcessingTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalabilityMetrics.dataPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalabilityMetrics.featuresProcessed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalabilityMetrics.modelTrainingTime}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecasting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecasting">ML Forecasting</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>ML-Based Consumption Forecast ({selectedModel.toUpperCase()})</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" strokeWidth={2} />
                    <Line type="monotone" dataKey="predicted" stroke="#ff7300" name="Predicted" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="upperBound" stroke="#ff7300" name="Upper Bound" strokeOpacity={0.3} />
                    <Line type="monotone" dataKey="lowerBound" stroke="#ff7300" name="Lower Bound" strokeOpacity={0.3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData.slice(-4).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.period}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full bg-blue-500 rounded"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Detected Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternAnalysis.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pattern.pattern}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPatternBadgeColor(pattern.impact)}>{pattern.impact}</Badge>
                          <span className={`text-sm font-medium ${getConfidenceColor(pattern.confidence)}`}>
                            {pattern.confidence}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {pattern.products.slice(0, 3).map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {pattern.products.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pattern.products.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={patternAnalysis.map(p => ({ 
                    confidence: p.confidence, 
                    impact: p.impact === 'high' ? 3 : p.impact === 'medium' ? 2 : 1,
                    name: p.pattern
                  }))}>
                    <CartesianGrid />
                    <XAxis dataKey="confidence" name="Confidence" />
                    <YAxis dataKey="impact" name="Impact" />
                    <Tooltip />
                    <Scatter dataKey="impact" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
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
                  <BarChart data={[
                    { name: 'Current', cost: 100000, optimized: 85000 },
                    { name: 'Forecasting', cost: 92000, optimized: 78000 },
                    { name: 'Inventory', cost: 88000, optimized: 75000 },
                    { name: 'Supply Chain', cost: 85000, optimized: 70000 }
                  ]}>
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
        </TabsContent>

        <TabsContent value="scalability">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
