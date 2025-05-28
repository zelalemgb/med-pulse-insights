
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';

const FacilityManagerDashboard = () => {
  // Mock data - would come from API in real implementation
  const managerData = {
    totalStaff: 8,
    monthlyBudget: 75000,
    budgetUsed: 52000,
    criticalAlerts: 5,
    pendingReports: 3,
    efficiency: 87,
    costSavings: 12500
  };

  const budgetUtilization = ((managerData.budgetUsed / managerData.monthlyBudget) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Management Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerData.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUtilization}%</div>
            <p className="text-xs text-muted-foreground">${managerData.budgetUsed.toLocaleString()} of ${managerData.monthlyBudget.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{managerData.efficiency}%</div>
            <p className="text-xs text-muted-foreground">Target: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${managerData.costSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">Budget Threshold</h4>
                  <p className="text-sm text-red-600">Monthly budget 70% utilized</p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-amber-800">Staff Performance</h4>
                  <p className="text-sm text-amber-600">2 staff members need training</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">Supply Chain</h4>
                  <p className="text-sm text-red-600">Delayed shipment affecting 3 products</p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Monthly Consumption Report</h4>
                  <p className="text-sm text-gray-600">Due: End of month</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Staff Performance Review</h4>
                  <p className="text-sm text-gray-600">Due: Next week</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Budget Variance Analysis</h4>
                  <p className="text-sm text-gray-600">Due: Tomorrow</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>Schedule Team Meeting</span>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Entry Accuracy</span>
              <span className="text-sm text-green-600">94%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Report Timeliness</span>
              <span className="text-sm text-blue-600">89%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Completion</span>
              <span className="text-sm text-purple-600">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityManagerDashboard;
