
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Package, Building, MapPin, DollarSign, TrendingUp, AlertTriangle, Pill, ShoppingCart, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PharmaceuticalProduct } from '@/types/pharmaceuticalProducts';

interface PharmaceuticalMetricsSummary {
  totalProducts: number;
  totalValue: number;
  uniqueFacilities: number;
  uniqueRegions: number;
}

interface PharmaceuticalDashboardProps {
  products: PharmaceuticalProduct[];
  allProductsMetrics: PharmaceuticalMetricsSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const PharmaceuticalDashboard = ({
  products,
  allProductsMetrics,
  isLoading,
  error,
  refetch
}: PharmaceuticalDashboardProps) => {

  const dashboardMetrics = useMemo(() => {
    if (!products.length) return null;

    console.log('Processing dashboard metrics for', products.length, 'products');

    // Work with the small sample for performance
    const sampleProducts = products.slice(0, 25); // Use only first 25 for calculations

    // Basic metrics from sample
    const uniqueZones = [...new Set(sampleProducts.map(p => p.zone))].filter(Boolean).length;
    const totalQuantity = sampleProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const avgMiaziaPrice = sampleProducts.reduce((sum, p) => sum + (p.miazia_price || 0), 0) / sampleProducts.filter(p => p.miazia_price).length || 0;
    const avgRegularPrice = sampleProducts.reduce((sum, p) => sum + (p.price || 0), 0) / sampleProducts.filter(p => p.price).length || 0;
    const totalRegularValue = sampleProducts.reduce((sum, p) => sum + (p.price || 0), 0);

    // Simple category breakdown
    const categoryBreakdown = sampleProducts.reduce((acc, product) => {
      const category = product.product_category || 'Uncategorized';
      if (!acc[category]) acc[category] = { count: 0, value: 0 };
      acc[category].count++;
      acc[category].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Simple source breakdown
    const sourceBreakdown = sampleProducts.reduce((acc, product) => {
      const source = product.procurement_source || 'Unknown';
      if (!acc[source]) acc[source] = { count: 0, value: 0 };
      acc[source].count++;
      acc[source].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return {
      uniqueZones,
      totalQuantity,
      avgMiaziaPrice,
      avgRegularPrice,
      totalRegularValue,
      categoryBreakdown,
      sourceBreakdown,
      sampleSize: sampleProducts.length
    };
  }, [products]);

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
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            This may take a moment due to large dataset
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
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading
              </Button>
              <p className="text-xs text-gray-500">
                Try using filters to reduce data load if the error persists
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allProductsMetrics && !dashboardMetrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500">No pharmaceutical data found. Please check your connection or try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare simplified chart data
  const categoryChartData = dashboardMetrics ? Object.entries(dashboardMetrics.categoryBreakdown)
    .slice(0, 6) // Limit to 6 categories for performance
    .map(([name, data]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      count: data.count,
      value: data.value
    })) : [];

  const sourceChartData = dashboardMetrics ? Object.entries(dashboardMetrics.sourceBreakdown)
    .slice(0, 5) // Limit to 5 sources
    .map(([name, data]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      count: data.count,
      value: data.value
    })) : [];

  return (
    <div className="space-y-6">
      {/* Performance Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Performance Mode:</strong> Dashboard shows analysis from sample data to ensure fast loading. 
            Complete dataset metrics displayed when available.
          </p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      {allProductsMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-blue-900">{allProductsMetrics.totalProducts.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-gray-600">Est. Total Value</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(allProductsMetrics.totalValue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Estimated value</p>
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
                  <p className="text-3xl font-bold text-purple-900">{allProductsMetrics.uniqueFacilities.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Estimated count</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Regions</p>
                  <p className="text-3xl font-bold text-orange-900">{allProductsMetrics.uniqueRegions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Estimated coverage</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sample-based Metrics */}
      {dashboardMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sample Size</p>
                    <p className="text-2xl font-bold text-teal-900">{dashboardMetrics.sampleSize}</p>
                    <p className="text-xs text-gray-500 mt-1">Products analyzed</p>
                  </div>
                  <Pill className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Miazia Price</p>
                    <p className="text-2xl font-bold text-indigo-900">{formatCurrency(dashboardMetrics.avgMiaziaPrice)}</p>
                    <p className="text-xs text-gray-500 mt-1">From sample</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sample Zones</p>
                    <p className="text-2xl font-bold text-rose-900">{dashboardMetrics.uniqueZones}</p>
                    <p className="text-xs text-gray-500 mt-1">Unique zones</p>
                  </div>
                  <MapPin className="h-8 w-8 text-rose-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simplified Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Chart */}
            {categoryChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories (Sample)</CardTitle>
                  <CardDescription>Distribution from {dashboardMetrics.sampleSize} products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Products']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Sources Chart */}
            {sourceChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Procurement Sources (Sample)</CardTitle>
                  <CardDescription>Sources from {dashboardMetrics.sampleSize} products</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={sourceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Products']} />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Actions</CardTitle>
          <CardDescription>Quick actions to manage dashboard performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              Optimized for Performance
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmaceuticalDashboard;
