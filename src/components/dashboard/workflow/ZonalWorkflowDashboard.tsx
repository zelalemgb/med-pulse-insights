
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Building, 
  TrendingDown, 
  Users, 
  FileText,
  MapPin,
  Target,
  Truck
} from 'lucide-react';

const ZonalWorkflowDashboard = () => {
  // Mock data for zonal level
  const facilitiesWithStockOuts = 5;
  const totalFacilities = 25;
  const avgAvailability = 82;
  const facilitiesReporting = 23;

  return (
    <div className="space-y-6">
      {/* Zone Overview Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            West Arsi Zone - Supply Chain Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalFacilities}</div>
              <div className="text-sm opacity-90">Total Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgAvailability}%</div>
              <div className="text-sm opacity-90">Avg Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{facilitiesReporting}</div>
              <div className="text-sm opacity-90">Reporting Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">ETB 2.3M</div>
              <div className="text-sm opacity-90">Monthly Budget</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Facilities Requiring Immediate Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-red-800">Critical Stock Outs</span>
                <Badge variant="destructive">{facilitiesWithStockOuts}</Badge>
              </div>
              <p className="text-sm text-red-600 mb-3">Facilities with zero stock of essentials</p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Emergency Support
              </Button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-amber-800">Non-Reporting</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {totalFacilities - facilitiesReporting}
                </Badge>
              </div>
              <p className="text-sm text-amber-600 mb-3">Facilities missing monthly reports</p>
              <Button size="sm" variant="outline" className="w-full border-amber-300">
                Follow Up
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-800">Poor Performance</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">3</Badge>
              </div>
              <p className="text-sm text-blue-600 mb-3">Consistently low availability</p>
              <Button size="sm" variant="outline" className="w-full border-blue-300">
                Support Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Building className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Facility Status</h3>
            <p className="text-sm text-gray-600 mb-4">Monitor all facilities in real-time</p>
            <Button size="sm" className="w-full">View Map</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 mx-auto mb-3 text-red-600" />
            <h3 className="font-semibold mb-2">Stock Alerts</h3>
            <p className="text-sm text-gray-600 mb-4">Track critical shortages</p>
            <Button size="sm" variant="outline" className="w-full">Alert Dashboard</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Coordinate supply deliveries</p>
            <Button size="sm" variant="outline" className="w-full">Plan Routes</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Zone Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Generate aggregate reports</p>
            <Button size="sm" variant="outline" className="w-full">Create Report</Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Zone Performance Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medicine Availability Target (85%)</span>
                <span className="font-semibold">{avgAvailability}%</span>
              </div>
              <Progress value={avgAvailability} className="h-3" />
              <p className="text-xs text-gray-600">3% below target - intervention needed</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reporting Compliance (100%)</span>
                <span className="font-semibold">{Math.round((facilitiesReporting/totalFacilities)*100)}%</span>
              </div>
              <Progress value={(facilitiesReporting/totalFacilities)*100} className="h-3" />
              <p className="text-xs text-gray-600">2 facilities need follow-up</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock Out Prevention (0 facilities)</span>
                <span className="font-semibold">{facilitiesWithStockOuts} facilities</span>
              </div>
              <Progress value={Math.max(0, 100 - (facilitiesWithStockOuts/totalFacilities)*100)} className="h-3" />
              <p className="text-xs text-gray-600">Emergency distribution required</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Facility Support Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Asela Health Center</p>
                  <p className="text-xs text-gray-600">Critical shortage: Amoxicillin, ORS</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Support</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                <Building className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Bekoji Hospital</p>
                  <p className="text-xs text-gray-600">Late reporting - 5 days overdue</p>
                </div>
                <Button size="sm" variant="outline" className="border-amber-300">Contact</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <TrendingDown className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Dodola Health Post</p>
                  <p className="text-xs text-gray-600">Declining availability trend</p>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300">Analyze</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZonalWorkflowDashboard;
