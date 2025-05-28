
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Building2, MapPin, Globe, TrendingUp, AlertTriangle } from 'lucide-react';

interface AggregationData {
  id: string;
  name: string;
  level: 'facility' | 'zonal' | 'regional' | 'national';
  totalConsumption: number;
  totalProducts: number;
  stockOutRate: number;
  wastageRate: number;
  children?: AggregationData[];
}

const MultiLevelAggregation = () => {
  const [selectedLevel, setSelectedLevel] = useState<'zonal' | 'regional' | 'national'>('zonal');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Mock hierarchical data with caching simulation
  const aggregationData: AggregationData[] = useMemo(() => [
    {
      id: 'national',
      name: 'National Level',
      level: 'national',
      totalConsumption: 125000,
      totalProducts: 2450,
      stockOutRate: 12.5,
      wastageRate: 8.2,
      children: [
        {
          id: 'region-1',
          name: 'Northern Region',
          level: 'regional',
          totalConsumption: 45000,
          totalProducts: 890,
          stockOutRate: 10.2,
          wastageRate: 7.5,
          children: [
            {
              id: 'zone-1',
              name: 'North Zone A',
              level: 'zonal',
              totalConsumption: 22500,
              totalProducts: 445,
              stockOutRate: 9.8,
              wastageRate: 6.9
            },
            {
              id: 'zone-2',
              name: 'North Zone B',
              level: 'zonal',
              totalConsumption: 22500,
              totalProducts: 445,
              stockOutRate: 10.6,
              wastageRate: 8.1
            }
          ]
        },
        {
          id: 'region-2',
          name: 'Southern Region',
          level: 'regional',
          totalConsumption: 40000,
          totalProducts: 780,
          stockOutRate: 14.1,
          wastageRate: 8.8,
          children: [
            {
              id: 'zone-3',
              name: 'South Zone A',
              level: 'zonal',
              totalConsumption: 20000,
              totalProducts: 390,
              stockOutRate: 13.5,
              wastageRate: 8.2
            },
            {
              id: 'zone-4',
              name: 'South Zone B',
              level: 'zonal',
              totalConsumption: 20000,
              totalProducts: 390,
              stockOutRate: 14.7,
              wastageRate: 9.4
            }
          ]
        },
        {
          id: 'region-3',
          name: 'Eastern Region',
          level: 'regional',
          totalConsumption: 40000,
          totalProducts: 780,
          stockOutRate: 13.2,
          wastageRate: 8.5
        }
      ]
    }
  ], []);

  const getDataForLevel = () => {
    const national = aggregationData[0];
    switch (selectedLevel) {
      case 'national':
        return [national];
      case 'regional':
        return national.children || [];
      case 'zonal':
        return national.children?.flatMap(region => region.children || []) || [];
      default:
        return [];
    }
  };

  const chartData = getDataForLevel().map(item => ({
    name: item.name,
    consumption: item.totalConsumption,
    products: item.totalProducts,
    stockOutRate: item.stockOutRate,
    wastageRate: item.wastageRate
  }));

  const performanceMetrics = useMemo(() => {
    const data = getDataForLevel();
    const totalConsumption = data.reduce((sum, item) => sum + item.totalConsumption, 0);
    const avgStockOutRate = data.reduce((sum, item) => sum + item.stockOutRate, 0) / data.length;
    const avgWastageRate = data.reduce((sum, item) => sum + item.wastageRate, 0) / data.length;
    
    return {
      totalConsumption,
      avgStockOutRate,
      avgWastageRate,
      totalRegions: data.length
    };
  }, [selectedLevel]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'zonal': return <MapPin className="h-4 w-4" />;
      case 'regional': return <Building2 className="h-4 w-4" />;
      case 'national': return <Globe className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getPerformanceBadge = (rate: number, type: 'stockOut' | 'wastage') => {
    const threshold = type === 'stockOut' ? 15 : 10;
    const variant = rate > threshold ? 'destructive' : rate > threshold * 0.7 ? 'default' : 'secondary';
    return <Badge variant={variant}>{rate.toFixed(1)}%</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Level Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getLevelIcon(selectedLevel)}
              Multi-Level Aggregation
            </CardTitle>
            <Select value={selectedLevel} onValueChange={(value: any) => setSelectedLevel(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zonal">Zonal View</SelectItem>
                <SelectItem value="regional">Regional View</SelectItem>
                <SelectItem value="national">National View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.totalConsumption.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Units across {selectedLevel} level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Stock Out Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {performanceMetrics.avgStockOutRate.toFixed(1)}%
              {performanceMetrics.avgStockOutRate > 15 && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
            <p className="text-xs text-muted-foreground">Across all {selectedLevel}s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Wastage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {performanceMetrics.avgWastageRate.toFixed(1)}%
              {performanceMetrics.avgWastageRate > 10 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
            <p className="text-xs text-muted-foreground">Optimization opportunity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.totalRegions}</div>
            <p className="text-xs text-muted-foreground">{selectedLevel}s monitored</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">Consumption Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Regional Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Consumption by {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consumption" fill="#8884d8" name="Total Consumption" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stockOutRate" stroke="#ff7300" name="Stock Out Rate %" />
                  <Line type="monotone" dataKey="wastageRate" stroke="#00C49F" name="Wastage Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDataForLevel().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.totalConsumption.toLocaleString()} units • {item.totalProducts} products
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Stock Outs</p>
                        {getPerformanceBadge(item.stockOutRate, 'stockOut')}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Wastage</p>
                        {getPerformanceBadge(item.wastageRate, 'wastage')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiLevelAggregation;
