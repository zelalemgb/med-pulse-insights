
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Target,
  Users,
  Activity
} from 'lucide-react';

const NationalWorkflowDashboard = () => {
  // Mock data for national level
  const totalRegions = 11;
  const regionsAtRisk = 2;
  const nationalAvailability = 87;
  const annualBudget = 2.5; // in billions

  return (
    <div className="space-y-6">
      {/* National Overview Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Ethiopia National Pharmaceutical Supply Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalRegions}</div>
              <div className="text-sm opacity-90">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nationalAvailability}%</div>
              <div className="text-sm opacity-90">National Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">ETB {annualBudget}B</div>
              <div className="text-sm opacity-90">Annual Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">120M</div>
              <div className="text-sm opacity-90">Population Served</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* National Policy Issues */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <AlertTriangle className="h-5 w-5" />
            National Policy & Strategic Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-red-800">Critical Regions</span>
                <Badge variant="destructive">{regionsAtRisk}</Badge>
              </div>
              <p className="text-sm text-red-600 mb-3">Regions requiring emergency intervention</p>
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                National Response
              </Button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-amber-800">Budget Allocation</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">Review</Badge>
              </div>
              <p className="text-sm text-amber-600 mb-3">Regional budget reallocation needed</p>
              <Button size="sm" variant="outline" className="w-full border-amber-300">
                Policy Review
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-800">Health Impact</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Monitor</Badge>
              </div>
              <p className="text-sm text-blue-600 mb-3">Service delivery impact analysis</p>
              <Button size="sm" variant="outline" className="w-full border-blue-300">
                Health Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* National Strategic Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">National Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">Comprehensive health insights</p>
            <Button size="sm" className="w-full">View Analytics</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Budget Management</h3>
            <p className="text-sm text-gray-600 mb-4">National budget monitoring</p>
            <Button size="sm" variant="outline" className="w-full">Budget Dashboard</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">National Forecast</h3>
            <p className="text-sm text-gray-600 mb-4">Strategic demand planning</p>
            <Button size="sm" variant="outline" className="w-full">Strategic Planning</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">Health Impact</h3>
            <p className="text-sm text-gray-600 mb-4">Service delivery insights</p>
            <Button size="sm" variant="outline" className="w-full">Health Metrics</Button>
          </CardContent>
        </Card>
      </div>

      {/* National Performance & Health Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              National Health System Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Essential Medicine Availability (95% target)</span>
                <span className="font-semibold">{nationalAvailability}%</span>
              </div>
              <Progress value={nationalAvailability} className="h-3" />
              <p className="text-xs text-gray-600">8% below WHO target - strategic intervention required</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Universal Health Coverage</span>
                <span className="font-semibold">78%</span>
              </div>
              <Progress value={78} className="h-3" />
              <p className="text-xs text-gray-600">Progress toward UHC goals</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Execution Efficiency</span>
                <span className="font-semibold">82%</span>
              </div>
              <Progress value={82} className="h-3" />
              <p className="text-xs text-gray-600">Good execution rate - room for improvement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Priority Regional Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Somali Region</p>
                  <p className="text-xs text-gray-600">Critical medicine shortages affecting maternal health</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Emergency</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                <DollarSign className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Tigray Region</p>
                  <p className="text-xs text-gray-600">Budget reallocation needed for reconstruction</p>
                </div>
                <Button size="sm" variant="outline" className="border-amber-300">Policy</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <Activity className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">SNNP Region</p>
                  <p className="text-xs text-gray-600">Improving trend - continue monitoring</p>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300">Monitor</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NationalWorkflowDashboard;
