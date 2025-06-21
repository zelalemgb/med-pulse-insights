
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Package, Building, MapPin, DollarSign, TrendingUp, AlertTriangle, Pill, ShoppingCart } from 'lucide-react';
import { usePharmaceuticalProducts } from '@/hooks/usePharmaceuticalProducts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const PharmaceuticalDashboard = () => {
  const { products, isLoading, error } = usePharmaceuticalProducts();

  const dashboardMetrics = useMemo(() => {
    if (!products.length) return null;

    // Basic counts
    const totalProducts = products.length;
    const uniqueFacilities = [...new Set(products.map(p => p.facility))].length;
    const uniqueRegions = [...new Set(products.map(p => p.region))].filter(Boolean).length;
    const uniqueZones = [...new Set(products.map(p => p.zone))].filter(Boolean).length;

    // Financial metrics
    const totalMiaziaValue = products.reduce((sum, p) => sum + (p.miazia_price || 0), 0);
    const totalRegularValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

    // Average prices
    const avgMiaziaPrice = totalMiaziaValue / products.filter(p => p.miazia_price).length || 0;
    const avgRegularPrice = totalRegularValue / products.filter(p => p.price).length || 0;

    // Category breakdown
    const categoryBreakdown = products.reduce((acc, product) => {
      const category = product.product_category || 'Uncategorized';
      if (!acc[category]) acc[category] = { count: 0, value: 0 };
      acc[category].count++;
      acc[category].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Source breakdown
    const sourceBreakdown = products.reduce((acc, product) => {
      const source = product.procurement_source || 'Unknown';
      if (!acc[source]) acc[source] = { count: 0, value: 0 };
      acc[source].count++;
      acc[source].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Regional breakdown
    const regionalBreakdown = products.reduce((acc, product) => {
      const region = product.region || 'Unknown';
      if (!acc[region]) acc[region] = { count: 0, value: 0, facilities: new Set() };
      acc[region].count++;
      acc[region].value += product.miazia_price || 0;
      acc[region].facilities.add(product.facility);
      return acc;
    }, {} as Record<string, { count: number; value: number; facilities: Set<string> }>);

    // Top facilities by product count
    const facilityBreakdown = products.reduce((acc, product) => {
      if (!acc[product.facility]) acc[product.facility] = { count: 0, value: 0 };
      acc[product.facility].count++;
      acc[product.facility].value += product.miazia_price || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    // Price distribution analysis
    const priceRanges = {
      'Under 100': products.filter(p => (p.miazia_price || 0) < 100).length,
      '100-500': products.filter(p => (p.miazia_price || 0) >= 100 && (p.miazia_price || 0) < 500).length,
      '500-1000': products.filter(p => (p.miazia_price || 0) >= 500 && (p.miazia_price || 0) < 1000).length,
      '1000+': products.filter(p => (p.miazia_price || 0) >= 1000).length,
    };

    return {
      totalProducts,
      uniqueFacilities,
      uniqueRegions,
      uniqueZones,
      totalMiaziaValue,
      totalRegularValue,
      totalQuantity,
      avgMiaziaPrice,
      avgRegularPrice,
      categoryBreakdown,
      sourceBreakdown,
      regionalBreakdown,
      facilityBreakdown,
      priceRanges
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
        </div>
      </div>
    );
  }

  if (error || !dashboardMetrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {error ? `Error: ${error}` : 'No data available for dashboard'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const categoryChartData = Object.entries(dashboardMetrics.categoryBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value
  }));

  const sourceChartData = Object.entries(dashboardMetrics.sourceBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value
  }));

  const regionalChartData = Object.entries(dashboardMetrics.regionalBreakdown).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
    facilities: data.facilities.size
  }));

  const topFacilitiesData = Object.entries(dashboardMetrics.facilityBreakdown)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 10)
    .map(([name, data]) => ({
      name: name.length > 30 ? name.substring(0, 30) + '...' : name,
      count: data.count,
      value: data.value
    }));

  const priceRangeData = Object.entries(dashboardMetrics.priceRanges).map(([range, count]) => ({
    range,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-blue-900">{dashboardMetrics.totalProducts.toLocaleString()}</p>
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
                <p className="text-3xl font-bold text-green-900">{formatCurrency(dashboardMetrics.totalMiaziaValue)}</p>
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
                <p className="text-3xl font-bold text-purple-900">{dashboardMetrics.uniqueFacilities}</p>
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
                <p className="text-3xl font-bold text-orange-900">{dashboardMetrics.uniqueRegions}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-teal-900">{dashboardMetrics.totalQuantity.toLocaleString()}</p>
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
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zones Covered</p>
                <p className="text-2xl font-bold text-rose-900">{dashboardMetrics.uniqueZones}</p>
              </div>
              <MapPin className="h-8 w-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regular Price Value</p>
                <p className="text-2xl font-bold text-amber-900">{formatCurrency(dashboardMetrics.totalRegularValue)}</p>
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
            <CardDescription>Distribution of pharmaceutical products across categories</CardDescription>
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
            <CardDescription>Products by procurement source</CardDescription>
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
          <CardDescription>Products and facilities across different regions</CardDescription>
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
            <CardDescription>Facilities with the most pharmaceutical products</CardDescription>
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
            <CardDescription>Distribution of products by Miazia price ranges</CardDescription>
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
    </div>
  );
};

export default PharmaceuticalDashboard;
