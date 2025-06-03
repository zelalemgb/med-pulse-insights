import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Package, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Target,
  MapPin,
  Filter,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OSMMap from '@/components/map/OSMMap';

interface SupplyMetric {
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
}

interface FacilityData {
  id: string;
  name: string;
  region: string;
  zone: string;
  product: string;
  stockLevel: number;
  hasStockout: boolean;
  consumption: number;
  daysLeft: number;
  lastUpdated: string;
  reportingRate: number;
}

interface ProductConsumption {
  product: string;
  consumption: number;
  stockouts: number;
}

interface TimeSeriesData {
  month: string;
  availability: number;
  forecastAccuracy: number;
  reportingRate: number;
}

const SupplyChainDashboard = () => {
  const { profile } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30days');
  const [selectedView, setSelectedView] = useState<string>('overview');

  // Mock data - in real implementation, this would come from your API
  const mockMetrics: Record<string, SupplyMetric> = {
    stockAvailability: { value: 78, trend: 'down', trendValue: 3 },
    stockoutRate: { value: 22, trend: 'up', trendValue: 5 },
    avgDaysStock: { value: 17, trend: 'stable' },
    facilitiesReporting: { value: 82, trend: 'up', trendValue: 4 },
    forecastAccuracy: { value: 85, trend: 'stable' },
    dataCompleteness: { value: 91, trend: 'up', trendValue: 2 }
  };

  const mockFacilityData: FacilityData[] = [
    {
      id: '1',
      name: 'Central Health Center',
      region: 'Addis Ababa',
      zone: 'Addis Ketema',
      product: 'Paracetamol',
      stockLevel: 25,
      hasStockout: false,
      consumption: 180,
      daysLeft: 5,
      lastUpdated: '2 days ago',
      reportingRate: 95
    },
    {
      id: '2',
      name: 'Regional Hospital',
      region: 'Oromia',
      zone: 'West Shewa',
      product: 'Amoxicillin',
      stockLevel: 0,
      hasStockout: true,
      consumption: 220,
      daysLeft: 0,
      lastUpdated: '1 day ago',
      reportingRate: 88
    },
    {
      id: '3',
      name: 'District Clinic',
      region: 'Amhara',
      zone: 'North Gondar',
      product: 'ORS',
      stockLevel: 75,
      hasStockout: false,
      consumption: 95,
      daysLeft: 23,
      lastUpdated: '3 hours ago',
      reportingRate: 92
    }
  ];

  const mockProductData: ProductConsumption[] = [
    { product: 'Paracetamol', consumption: 2400, stockouts: 8 },
    { product: 'Amoxicillin', consumption: 1800, stockouts: 12 },
    { product: 'ORS', consumption: 1500, stockouts: 5 },
    { product: 'Iron Tablets', consumption: 1200, stockouts: 15 },
    { product: 'Vitamin A', consumption: 980, stockouts: 7 }
  ];

  const mockTimeSeriesData: TimeSeriesData[] = [
    { month: 'Jan', availability: 82, forecastAccuracy: 78, reportingRate: 75 },
    { month: 'Feb', availability: 79, forecastAccuracy: 81, reportingRate: 78 },
    { month: 'Mar', availability: 85, forecastAccuracy: 83, reportingRate: 82 },
    { month: 'Apr', availability: 81, forecastAccuracy: 86, reportingRate: 85 },
    { month: 'May', availability: 78, forecastAccuracy: 85, reportingRate: 82 },
    { month: 'Jun', availability: 80, forecastAccuracy: 87, reportingRate: 84 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStockLevelColor = (level: number) => {
    if (level === 0) return 'text-red-600 bg-red-50';
    if (level < 30) return 'text-orange-600 bg-orange-50';
    if (level < 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const filteredFacilityData = useMemo(() => {
    return mockFacilityData.filter(facility => 
      selectedRegion === 'all' || facility.region === selectedRegion
    );
  }, [selectedRegion]);

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Supply Chain Dashboard</h2>
          <p className="text-gray-600 mt-1">What is available, what is missing, where, and why</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
              <SelectItem value="Oromia">Oromia</SelectItem>
              <SelectItem value="Amhara">Amhara</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Snapshot Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Stock Availability
              <InfoTooltip content="Percentage of tracer items available out of total expected across all facilities" />
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.stockAvailability.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.stockAvailability.trend)}
              <span className="ml-1">{mockMetrics.stockAvailability.trendValue}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Stockout Rate
              <InfoTooltip content="Percentage of facilities experiencing at least one product stockout" />
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.stockoutRate.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.stockoutRate.trend)}
              <span className="ml-1">{mockMetrics.stockoutRate.trendValue}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Avg Days Stock
              <InfoTooltip content="Average number of days remaining before stockout based on current consumption" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.avgDaysStock.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.avgDaysStock.trend)}
              <span className="ml-1">Days remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Facilities Reporting
              <InfoTooltip content="Percentage of facilities that submitted their reports on time this period" />
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.facilitiesReporting.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.facilitiesReporting.trend)}
              <span className="ml-1">{mockMetrics.facilitiesReporting.trendValue}% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Forecast Accuracy
              <InfoTooltip content="How accurately consumption was predicted vs actual usage" />
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.forecastAccuracy.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.forecastAccuracy.trend)}
              <span className="ml-1">Prediction accuracy</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              Data Completeness
              <InfoTooltip content="Percentage of required data fields that are filled in facility reports" />
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.dataCompleteness.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(mockMetrics.dataCompleteness.trend)}
              <span className="ml-1">{mockMetrics.dataCompleteness.trendValue}% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Summary Section */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Geographic View</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Availability Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Stock Availability Trend
                  <InfoTooltip content="Tracks stock availability and reporting rates over time to identify patterns" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  availability: { label: "Availability %" },
                  reportingRate: { label: "Reporting Rate %" }
                }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTimeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="availability" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Stock Availability"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reportingRate" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Reporting Rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Products by Consumption */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Top Products by Consumption
                  <InfoTooltip content="Products with highest monthly consumption across all facilities" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  consumption: { label: "Monthly Consumption" }
                }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProductData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="consumption" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Geographic Distribution
                <InfoTooltip content="Interactive map showing facility locations and their current stock status" />
              </CardTitle>
              <p className="text-sm text-gray-600">Interactive map showing facility locations and stock status</p>
            </CardHeader>
            <CardContent>
              <OSMMap height="400px" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Forecast Accuracy Over Time
                <InfoTooltip content="Shows how prediction accuracy changes over time, helping improve forecasting models" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                forecastAccuracy: { label: "Forecast Accuracy %" }
              }} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="forecastAccuracy" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Product Analysis
                <InfoTooltip content="Analysis of individual product performance including consumption and stockout frequency" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProductData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.product}</h4>
                      <p className="text-sm text-gray-600">Monthly consumption: {product.consumption.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={product.stockouts > 10 ? "destructive" : product.stockouts > 5 ? "default" : "secondary"}>
                        {product.stockouts} stockouts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Drilldown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Facility Details
            <InfoTooltip content="Detailed facility-level view of stock levels, consumption, and reporting status" />
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed view of facility stock levels and reporting status</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility</TableHead>
                <TableHead>Region/Zone</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Consumption</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilityData.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{facility.region}</div>
                      <div className="text-gray-500">{facility.zone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{facility.product}</TableCell>
                  <TableCell>
                    <Badge className={getStockLevelColor(facility.stockLevel)}>
                      {facility.stockLevel}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {facility.hasStockout ? (
                      <Badge variant="destructive">Stockout</Badge>
                    ) : (
                      <Badge variant="secondary">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>{facility.consumption}/month</TableCell>
                  <TableCell>
                    <span className={facility.daysLeft < 7 ? 'text-red-600 font-medium' : ''}>
                      {facility.daysLeft} days
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{facility.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainDashboard;
