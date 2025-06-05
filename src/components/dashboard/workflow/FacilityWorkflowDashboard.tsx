
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Upload, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

const FacilityWorkflowDashboard = () => {
  // Mock data - would come from API
  const criticalStockOuts = 3;
  const lowStock = 8;
  const forecastDue = 2;
  const reportingRate = 92;

  return (
    <div className="space-y-6">
      {/* Critical Actions - Top Priority */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Urgent Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-800">Stock Outs</span>
                <Badge variant="destructive">{criticalStockOuts}</Badge>
              </div>
              <p className="text-xs text-red-600 mb-3">Essential medicines unavailable</p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Review & Order Now
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800">Low Stock</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">{lowStock}</Badge>
              </div>
              <p className="text-xs text-amber-600 mb-3">Items need replenishment</p>
              <Button size="sm" variant="outline" className="w-full border-amber-300">
                Plan Orders
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Overdue Reports</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">{forecastDue}</Badge>
              </div>
              <p className="text-xs text-blue-600 mb-3">Monthly reports pending</p>
              <Button size="sm" variant="outline" className="w-full border-blue-300">
                Submit Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 mb-4">Upload consumption, stock, or forecast data</p>
            <Button size="sm" className="w-full">Start Import</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Manage Inventory</h3>
            <p className="text-sm text-gray-600 mb-4">Update stock levels and track movement</p>
            <Button size="sm" variant="outline" className="w-full">Manage Stock</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Create Forecast</h3>
            <p className="text-sm text-gray-600 mb-4">Generate demand predictions</p>
            <Button size="sm" variant="outline" className="w-full">New Forecast</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Monitor performance metrics</p>
            <Button size="sm" variant="outline" className="w-full">View Reports</Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Service Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Essential Medicines Available</span>
                <span className="font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reporting Completeness</span>
                <span className="font-semibold">{reportingRate}%</span>
              </div>
              <Progress value={reportingRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Forecast Accuracy</span>
                <span className="font-semibold">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-amber-50 rounded">
                <Calendar className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly Report Due</p>
                  <p className="text-xs text-gray-600">Due in 3 days</p>
                </div>
                <Button size="sm" variant="outline">Start</Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Quarterly Forecast</p>
                  <p className="text-xs text-gray-600">Due in 1 week</p>
                </div>
                <Button size="sm" variant="outline">Plan</Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <Package className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Stock Count</p>
                  <p className="text-xs text-gray-600">Scheduled for next week</p>
                </div>
                <Button size="sm" variant="outline">Prepare</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilityWorkflowDashboard;
