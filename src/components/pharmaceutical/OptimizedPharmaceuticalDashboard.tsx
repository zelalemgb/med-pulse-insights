
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Building, MapPin, DollarSign, TrendingUp, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePharmaceuticalMetrics } from '@/hooks/usePharmaceuticalMetrics';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const OptimizedPharmaceuticalDashboard = () => {
  const { 
    metrics, 
    categoryBreakdown, 
    sourceBreakdown, 
    isLoading, 
    error, 
    refreshMetrics 
  } = usePharmaceuticalMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading optimized dashboard...</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Powered by server-side aggregation
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Dashboard Loading Error</h3>
            <p className="text-gray-600 mb-4">{error?.message || 'Failed to load dashboard data'}</p>
            <Button onClick={() => refreshMetrics()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500">No pharmaceutical data found.</p>
            <Button onClick={() => refreshMetrics()} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const categoryChartData = categoryBreakdown.map(item => ({
    name: item.category.length > 15 ? item.category.substring(0, 15) + '...' : item.category,
    count: Number(item.product_count),
    value: Number(item.total_value),
    avgPrice: Number(item.avg_price)
  }));

  const sourceChartData = sourceBreakdown.map(item => ({
    name: item.source.length > 12 ? item.source.substring(0, 12) + '...' : item.source,
    count: Number(item.product_count),
    value: Number(item.total_value),
    avgPrice: Number(item.avg_price)
  }));

  return (
    <div className="space-y-6">
      {/* Performance Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-800">
            <strong>Optimized Dashboard:</strong> Real-time metrics from server-side aggregation. 
            Data refreshed at: {new Date(metrics.last_updated).toLocaleString()}
          </p>
          <Button 
            onClick={refreshMetrics} 
            size="sm" 
            variant="outline" 
            className="ml-auto"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-blue-900">{metrics.total_products.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Complete inventory</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(metrics.total_value)}</p>
                <p className="text-xs text-gray-500 mt-1">Miazia pricing</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Facilities</p>
                <p className="text-3xl font-bold text-purple-900">{metrics.unique_facilities.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Active facilities</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-3xl font-bold text-orange-900">{metrics.unique_regions}</p>
                <p className="text-xs text-gray-500 mt-1">Regions covered</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Miazia Price</p>
                <p className="text-2xl font-bold text-indigo-900">{formatCurrency(metrics.avg_miazia_price)}</p>
                <p className="text-xs text-gray-500 mt-1">Current pricing</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zones</p>
                <p className="text-2xl font-bold text-teal-900">{metrics.unique_zones}</p>
                <p className="text-xs text-gray-500 mt-1">Unique zones</p>
              </div>
              <MapPin className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-rose-900">{metrics.unique_categories}</p>
                <p className="text-xs text-gray-500 mt-1">Product types</p>
              </div>
              <Package className="h-8 w-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Chart */}
        {categoryChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by category (server-computed)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Products']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Sources Chart */}
        {sourceChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Procurement Sources</CardTitle>
              <CardDescription>Distribution by source (server-computed)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Products']} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Info */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization</CardTitle>
          <CardDescription>Industry-standard optimizations implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Server-Side Aggregation</h4>
              <p className="text-sm text-blue-700">Database computes metrics</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Smart Caching</h4>
              <p className="text-sm text-green-700">5-minute cache strategy</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Optimized Queries</h4>
              <p className="text-sm text-purple-700">Indexed & materialized views</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedPharmaceuticalDashboard;
