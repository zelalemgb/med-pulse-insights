
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

const FacilityOfficerDashboard = () => {
  // Mock data - would come from API based on facility
  const facilityMetrics = {
    totalProducts: 245,
    availableProducts: 221,
    stockOutProducts: 12,
    lowStockProducts: 24,
    criticalProducts: 8,
    averageStockLevel: 68,
    stockOutRate: 4.9,
    averageLeadTime: 14,
    orderFulfillmentRate: 92,
    wastePercentage: 2.3
  };

  const availabilityRate = ((facilityMetrics.availableProducts / facilityMetrics.totalProducts) * 100).toFixed(1);
  const stockHealthScore = 100 - facilityMetrics.stockOutRate - (facilityMetrics.lowStockProducts / facilityMetrics.totalProducts * 100);

  return (
    <div className="space-y-6">
      {/* Key Supply Chain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Availability</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availabilityRate}%</div>
            <p className="text-xs text-muted-foreground">{facilityMetrics.availableProducts} of {facilityMetrics.totalProducts} products</p>
            <Progress value={parseFloat(availabilityRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Outs</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{facilityMetrics.stockOutProducts}</div>
            <p className="text-xs text-muted-foreground">Critical: {facilityMetrics.criticalProducts} products</p>
            <Badge variant="destructive" className="mt-2">Urgent Action Required</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{facilityMetrics.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Need reordering soon</p>
            <Badge className="bg-amber-100 text-amber-800 mt-2">Monitor Closely</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Health Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stockHealthScore.toFixed(0)}/100</div>
            <p className="text-xs text-muted-foreground">Overall supply performance</p>
            <Progress value={stockHealthScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Supply Chain Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order Fulfillment Rate</span>
              <span className="text-lg font-bold text-green-600">{facilityMetrics.orderFulfillmentRate}%</span>
            </div>
            <Progress value={facilityMetrics.orderFulfillmentRate} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Lead Time</span>
              <span className="text-lg font-bold">{facilityMetrics.averageLeadTime} days</span>
            </div>
            <Progress value={(30 - facilityMetrics.averageLeadTime) / 30 * 100} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Waste Percentage</span>
              <span className="text-lg font-bold text-red-600">{facilityMetrics.wastePercentage}%</span>
            </div>
            <Progress value={facilityMetrics.wastePercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-800">Immediate Stock Outs</h4>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-sm text-red-600">{facilityMetrics.criticalProducts} essential medications out of stock</p>
                <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                  Emergency Order
                </Button>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-amber-800">Reorder Alerts</h4>
                  <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
                </div>
                <p className="text-sm text-amber-600">{facilityMetrics.lowStockProducts} products below reorder point</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Plan Orders
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-800">Monthly Report Due</h4>
                  <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                </div>
                <p className="text-sm text-blue-600">Submit consumption report by month end</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Categories Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-green-700">Essential Medicines</div>
              <div className="text-xs text-green-600 mt-1">98% available</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">67</div>
              <div className="text-sm text-blue-700">Vaccines</div>
              <div className="text-xs text-blue-600 mt-1">94% available</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">22</div>
              <div className="text-sm text-purple-700">Medical Supplies</div>
              <div className="text-xs text-purple-600 mt-1">87% available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Supply Chain Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Supply Chain Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm">Received shipment: 15 products restocked</span>
                <span className="text-xs text-gray-500 block">2 hours ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm">Stock-out alert: Amoxicillin 250mg</span>
                <span className="text-xs text-gray-500 block">4 hours ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm">Low stock warning: Paracetamol 500mg</span>
                <span className="text-xs text-gray-500 block">6 hours ago</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <span className="text-sm">Order submitted: Emergency procurement request</span>
                <span className="text-xs text-gray-500 block">1 day ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityOfficerDashboard;
