
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Building,
  Package,
  BarChart3,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

const FacilityManagerDashboard = () => {
  const { userRole } = usePermissions();
  
  // Mock data based on user level
  const getDashboardData = () => {
    switch (userRole) {
      case 'national':
        return {
          totalFacilities: 1250,
          activeFacilities: 1180,
          avgAvailabilityRate: 89.5,
          criticalStockOuts: 45,
          totalBudget: 12500000,
          budgetUtilized: 8750000,
          performanceScore: 87,
          levelName: 'National Level',
          coverageArea: 'All Regions',
          keyMetrics: {
            regions: 11,
            zones: 68,
            facilities: 1250,
            population: 115000000
          }
        };
      case 'regional':
        return {
          totalFacilities: 180,
          activeFacilities: 172,
          avgAvailabilityRate: 91.2,
          criticalStockOuts: 8,
          totalBudget: 1800000,
          budgetUtilized: 1260000,
          performanceScore: 91,
          levelName: 'Regional Level',
          coverageArea: 'Oromia Region',
          keyMetrics: {
            zones: 12,
            facilities: 180,
            population: 12500000,
            districts: 45
          }
        };
      case 'zonal':
        return {
          totalFacilities: 35,
          activeFacilities: 34,
          avgAvailabilityRate: 92.8,
          criticalStockOuts: 2,
          totalBudget: 350000,
          budgetUtilized: 245000,
          performanceScore: 93,
          levelName: 'Zonal Level',
          coverageArea: 'West Arsi Zone',
          keyMetrics: {
            facilities: 35,
            population: 2100000,
            districts: 8,
            healthPosts: 120
          }
        };
      default:
        return {
          totalFacilities: 1,
          activeFacilities: 1,
          avgAvailabilityRate: 94.5,
          criticalStockOuts: 0,
          totalBudget: 75000,
          budgetUtilized: 52000,
          performanceScore: 95,
          levelName: 'Facility Level',
          coverageArea: 'Central Medical Store',
          keyMetrics: {
            staff: 25,
            products: 450,
            population: 85000,
            departments: 8
          }
        };
    }
  };

  const data = getDashboardData();
  const budgetUtilization = ((data.budgetUtilized / data.totalBudget) * 100).toFixed(1);
  const facilityPerformance = ((data.activeFacilities / data.totalFacilities) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Level Overview Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-blue-900">{data.levelName} Supply Chain Overview</CardTitle>
              <p className="text-blue-700 mt-1">{data.coverageArea}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Performance: {data.performanceScore}/100</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility Performance</CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{facilityPerformance}%</div>
            <p className="text-xs text-muted-foreground">{data.activeFacilities} of {data.totalFacilities} active</p>
            <Progress value={parseFloat(facilityPerformance)} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability Rate</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.avgAvailabilityRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all facilities</p>
            <Progress value={data.avgAvailabilityRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock Outs</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.criticalStockOuts}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            {data.criticalStockOuts > 0 && (
              <Badge variant="destructive" className="mt-2">Action Required</Badge>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{budgetUtilization}%</div>
            <p className="text-xs text-muted-foreground">${data.budgetUtilized.toLocaleString()} used</p>
            <Progress value={parseFloat(budgetUtilization)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Coverage Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Coverage & Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.keyMetrics).map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Supply Chain Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Top Performing Areas</h4>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-700">
                {userRole === 'national' ? 'Tigray and SNNP regions' : 
                 userRole === 'regional' ? 'East Shewa and Arsi zones' :
                 userRole === 'zonal' ? 'Asela and Bekoji districts' : 
                 'Pediatric and Emergency departments'} showing excellent availability rates
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-amber-800">Areas Needing Support</h4>
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-sm text-amber-700">
                {userRole === 'national' ? 'Afar and Gambela regions' :
                 userRole === 'regional' ? 'West Hararghe zone' :
                 userRole === 'zonal' ? 'Dodola district' :
                 'Surgical department'} require additional resource allocation
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800">Efficiency Opportunity</h4>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700">
                Implementing demand forecasting could reduce waste by 15% and improve availability
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Strategic Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-800">Immediate Priority</h4>
                <Badge variant="destructive">High</Badge>
              </div>
              <p className="text-sm text-red-600 mb-2">
                {data.criticalStockOuts > 0 ? 
                  `Address ${data.criticalStockOuts} critical stock-outs` :
                  'Monitor vulnerable supply chains'}
              </p>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Take Action
              </Button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800">Resource Optimization</h4>
                <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
              </div>
              <p className="text-sm text-blue-600 mb-2">
                Review budget allocation and redistribute resources for better coverage
              </p>
              <Button size="sm" variant="outline">
                View Analysis
              </Button>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Performance Review</h4>
                <Badge className="bg-green-100 text-green-800">Monthly</Badge>
              </div>
              <p className="text-sm text-green-600 mb-2">
                Generate comprehensive performance report for stakeholders
              </p>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Trends */}
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
              <Progress value={data.avgAvailabilityRate} className="h-2" />
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
    </div>
  );
};

export default FacilityManagerDashboard;
