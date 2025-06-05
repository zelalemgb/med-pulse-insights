
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Building2, 
  FileBarChart,
  Target,
  Globe,
  Package2
} from 'lucide-react';

const RegionalWorkflowDashboard = () => {
  // Mock data for regional level
  const totalZones = 8;
  const zonesWithIssues = 3;
  const avgRegionalAvailability = 85;
  const budgetUtilization = 78;

  return (
    <div className="space-y-6">
      {/* Regional Overview Header */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Oromia Region - Supply Chain Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalZones}</div>
              <div className="text-sm opacity-90">Zones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgRegionalAvailability}%</div>
              <div className="text-sm opacity-90">Regional Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">ETB 45M</div>
              <div className="text-sm opacity-90">Quarterly Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{budgetUtilization}%</div>
              <div className="text-sm opacity-90">Budget Utilization</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Issues */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Zones Requiring Strategic Intervention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-red-800">Critical Zones</span>
                <Badge variant="destructive">{zonesWithIssues}</Badge>
              </div>
              <p className="text-sm text-red-600 mb-3">Zones with widespread shortages</p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Emergency Response
              </Button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-amber-800">Budget Variance</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">22%</Badge>
              </div>
              <p className="text-sm text-amber-600 mb-3">Budget reallocation needed</p>
              <Button size="sm" variant="outline" className="w-full border-amber-300">
                Review Budget
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-800">Performance Gap</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">2</Badge>
              </div>
              <p className="text-sm text-blue-600 mb-3">Zones below targets</p>
              <Button size="sm" variant="outline" className="w-full border-blue-300">
                Support Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Zone Performance</h3>
            <p className="text-sm text-gray-600 mb-4">Monitor all zones in region</p>
            <Button size="sm" className="w-full">View Dashboard</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Package2 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Supply Planning</h3>
            <p className="text-sm text-gray-600 mb-4">Regional distribution strategy</p>
            <Button size="sm" variant="outline" className="w-full">Plan Distribution</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Regional Forecast</h3>
            <p className="text-sm text-gray-600 mb-4">Aggregate demand planning</p>
            <Button size="sm" variant="outline" className="w-full">Generate Forecast</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileBarChart className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">Regional Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Comprehensive analytics</p>
            <Button size="sm" variant="outline" className="w-full">View Reports</Button>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Regional Performance Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medicine Availability Target (90%)</span>
                <span className="font-semibold">{avgRegionalAvailability}%</span>
              </div>
              <Progress value={avgRegionalAvailability} className="h-3" />
              <p className="text-xs text-gray-600">5% below target - strategic intervention needed</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Utilization Target (85%)</span>
                <span className="font-semibold">{budgetUtilization}%</span>
              </div>
              <Progress value={budgetUtilization} className="h-3" />
              <p className="text-xs text-gray-600">Efficient utilization - within acceptable range</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Zone Compliance (100%)</span>
                <span className="font-semibold">{Math.round(((totalZones - zonesWithIssues)/totalZones)*100)}%</span>
              </div>
              <Progress value={((totalZones - zonesWithIssues)/totalZones)*100} className="h-3" />
              <p className="text-xs text-gray-600">3 zones need immediate support</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Priority Zone Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">West Arsi Zone</p>
                  <p className="text-xs text-gray-600">Critical shortages in 5 facilities</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Intervene</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                <MapPin className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">East Shewa Zone</p>
                  <p className="text-xs text-gray-600">Budget overspend by 15%</p>
                </div>
                <Button size="sm" variant="outline" className="border-amber-300">Review</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Arsi Zone</p>
                  <p className="text-xs text-gray-600">Performance declining trend</p>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300">Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionalWorkflowDashboard;
