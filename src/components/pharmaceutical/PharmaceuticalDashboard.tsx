
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Package, Building, MapPin, DollarSign, TrendingUp, AlertTriangle, Pill, ShoppingCart, RefreshCw } from 'lucide-react';
import { usePharmaceuticalProducts } from '@/hooks/usePharmaceuticalProducts';
import { Button } from '@/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const PharmaceuticalDashboard = () => {
  // Use optimized hook with smaller page size for dashboard
  const { products, allProductsMetrics, isLoading, error, refetch } = usePharmaceuticalProducts({}, { 
    page: 1, 
    pageSize: 25, // Smaller sample for dashboard performance
    enablePagination: true 
  });

  const dashboardMetrics = useMemo(() => {
    if (!products.length) return null;

    console.log('Processing dashboard metrics for', products.length, 'products');

    // Work with available sample data for charts
    const sampleProducts = products;

    // Basic metrics from sampled data
    const uniqueZones = [...new Set(sampleProducts.map(p => p.zone))].filter(Boolean).length;
    const totalQuantity = sampleProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const avgMiaziaPrice = sampleProducts.reduce((sum, p) => sum + (p.miazia_price || 0), 0) / sampleProducts.filter(p => p.miazia_price).length || 0;
    const avgRegularPrice = sampleProducts.reduce((sum, p) => sum + (p.price || 0), 0) / sampleProducts.filter(p => p.price).length || 0;
    const totalRegularValue = sampleProducts.reduce((sum, p) => sum + (p.price || 0), 0);

    // Category breakdown from sampled data
    const categoryBreakdown = sampleProducts.reduce((acc, product) => {
      const category = product.product_category || 'Uncategorized';
      if (!acc[category]) acc[category] = { count: 0, value: 0 };
      acc[category].count++;
      acc[category].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Source breakdown from sampled data
    const sourceBreakdown = sampleProducts.reduce((acc, product) => {
      const source = product.procurement_source || 'Unknown';
      if (!acc[source]) acc[source] = { count: 0, value: 0 };
      acc[source].count++;
      acc[source].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Regional breakdown from sampled data
    const regionalBreakdown = sampleProducts.reduce((acc, product) => {
      const region = product.region || 'Unknown';
      if (!acc[region]) acc[region] = { count: 0, value: 0, facilities: new Set() };
      acc[region].count++;
      acc[region].value += product.miazia_price || 0;
      acc[region].facilities.add(product.facility);
      return acc;
    }, {} as Record<string, { count: number; value: number; facilities: Set<string> }>);

    // Top facilities by product count from sampled data
    const facilityBreakdown = sampleProducts.reduce((acc, product) => {
      if (!acc[product.facility]) acc[product.facility] = { count: 0, value: 0 };
      acc[product.facility].count++;
      acc[product.facility].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Price distribution analysis from sampled data
    const priceRanges = {
      'Under 100': sampleProducts.filter(p => (p.miazia_price || 0) < 100).length,
      '100-500': sampleProducts.filter(p => (p.miazia_price || 0) >= 100 && (p.miazia_price || 0) < 500).length,
      '500-1000': sampleProducts.filter(p => (p.miazia_price || 0) >= 500 && (p.miazia_price || 0) < 1000).length,
      '1000+': sampleProducts.filter(p => (p.miazia_price || 0) >= 1000).length,
    };

    return {
      uniqueZones,
      totalQuantity,
      avgMiaziaPrice,
      avgRegularPrice,
      totalRegularValue,
      categoryBreakdown,
      sourceBreakdown,
      regionalBreakdown,
      facilityBreakdown,
      priceRanges,
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
          <p className="text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Processing large dataset, please wait...</p>
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
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
            <p className="text-gray-500">Unable to load pharmaceutical data at this time.</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const categoryChartData = dashboardMetrics ? Object.entries(dashboardMetrics.categoryBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value
  })) : [];

  const sourceChartData = dashboardMetrics ? Object.entries(dashboardMetrics.sourceBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value
  })) : [];

  const regionalChartData = dashboardMetrics ? Object.entries(dashboardMetrics.regionalBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
    facilities: data.facilities.size
  })) : [];

  const topFacilitiesData = dashboardMetrics ? Object.entries(dashboardMetrics.facilityBreakdown)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 10)
    .map(([name, data]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      count: data.count,
      value: data.value
    })) : [];

  const priceRangeData = dashboardMetrics ? Object.entries(dashboardMetrics.priceRanges).map(([range, count]) => ({
    range,
    count
  })) : [];

  return (
    <div className="space-y-6">
      {/* Data Sample Notice */}
      {dashboardMetrics && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>Dashboard Sample:</strong> Showing analysis based on {dashboardMetrics.sampleSize} products. 
              Total dataset metrics shown below when available.
            </p>
          </div>
        </div>
      )}

      {/* Key Performance Indicators - Using Complete Dataset Metrics */}
      {allProductsMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-blue-900">{allProductsMetrics.totalProducts.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Complete dataset</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Miazia Value</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(allProductsMetrics.totalValue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Complete dataset</p>
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
                  <p className="text-xs text-gray-500 mt-1">Complete dataset</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Regions Covered</p>
                  <p className="text-3xl font-bold text-orange-900">{allProductsMetrics.uniqueRegions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Complete dataset</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secondary Metrics - Using Sampled Data */}
      {dashboardMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sample Quantity</p>
                    <p className="text-2xl font-bold text-teal-900">{dashboardMetrics.totalQuantity.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">From {dashboardMetrics.sampleSize} products</p>
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
                    <p className="text-xs text-gray-500 mt-1">Sample average</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Zones in Sample</p>
                    <p className="text-2xl font-bold text-rose-900">{dashboardMetrics.uniqueZones}</p>
                    <p className="text-xs text-gray-500 mt-1">Unique zones</p>
                  </div>
                  <MapPin className="h-8 w-8 text-rose-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sample Regular Value</p>
                    <p className="text-2xl font-bold text-amber-900">{formatCurrency(dashboardMetrics.totalRegularValue)}</p>
                    <p className="text-xs text-gray-500 mt-1">Regular pricing</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution of pharmaceutical products across categories (sample data)</CardDescription>
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
                    <Tooltip formatter={(value) => [value, 'Products']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Procurement Sources Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Procurement Sources</CardTitle>
                <CardDescription>Products by procurement source (sample data)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
          </div>

          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Products and facilities across different regions (sample data)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionalChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Products" />
                  <Bar yAxisId="right" dataKey="facilities" fill="#10b981" name="Facilities" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Facilities and Price Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Facilities by Product Count</CardTitle>
                <CardDescription>Facilities with the most pharmaceutical products (sample data)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topFacilitiesData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [value, 'Products']} />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Price Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Price Range Distribution</CardTitle>
                <CardDescription>Distribution of products by Miazia price ranges (sample data)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={priceRangeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Products']} />
                    <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#fbbf24" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default PharmaceuticalDashboard;
