import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Server, 
  Database, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  HardDrive,
  Wifi,
  UserCheck,
  FileText,
  Settings
} from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAuth } from '@/contexts/AuthContext';

const SystemOverview = () => {
  const { settings, isLoading } = useSystemSettings();
  const { profile } = useAuth();

  // Check if user is super admin (national, regional, or zonal)
  const isSuperAdmin = profile?.role === 'national' || 
    profile?.role === 'regional' || 
    profile?.role === 'zonal';

  // Mock data - in real implementation, this would come from your API
  const systemMetrics = {
    users: {
      total: 1247,
      active: 892,
      newThisMonth: 67,
      pendingApprovals: 12
    },
    facilities: {
      total: 324,
      active: 298,
      pendingAssociations: 8,
      reportingRate: 87
    },
    system: {
      uptime: 99.8,
      responseTime: 145,
      errorRate: 0.2,
      storageUsed: 67
    },
    data: {
      completeness: 94,
      accuracy: 91,
      timeliness: 88,
      duplicates: 156
    },
    security: {
      failedLogins: 23,
      suspiciousActivity: 2,
      lastSecurityScan: '2 hours ago',
      vulnerabilities: 0
    }
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600 bg-green-50';
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Access denied for non-super admin users
  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              System Health is only available for Super Admin users
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Your current role: <Badge variant="outline">{profile?.role}</Badge>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Contact your administrator for access
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600 mt-1">Platform health, performance, and management metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Super Admin Access
          </Badge>
          <Badge variant="outline" className="text-sm">
            Last Updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First Card: Facilities Reporting */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facilities Reporting</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.facilities.reportingRate}%</div>
            <p className="text-xs text-muted-foreground">
              Active facilities reporting
            </p>
          </CardContent>
        </Card>

        {/* Second Card: Data Completeness */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Completeness</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.data.completeness}%</div>
            <p className="text-xs text-muted-foreground">
              Data completeness score
            </p>
          </CardContent>
        </Card>

        {/* Third Card: Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.users.active.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{systemMetrics.users.newThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Fourth Card: System Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">
              Uptime: {systemMetrics.system.uptime}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="data">Data Quality</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Users</span>
                  <Badge variant="secondary">{systemMetrics.users.total.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Users (30 days)</span>
                  <Badge className={getStatusColor(systemMetrics.users.active / systemMetrics.users.total * 100, { good: 70, warning: 50 })}>
                    {systemMetrics.users.active.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Approvals</span>
                  <Badge variant={systemMetrics.users.pendingApprovals > 20 ? "destructive" : "outline"}>
                    {systemMetrics.users.pendingApprovals}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Activation Rate</span>
                    <span>{Math.round(systemMetrics.users.active / systemMetrics.users.total * 100)}%</span>
                  </div>
                  <Progress value={systemMetrics.users.active / systemMetrics.users.total * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Facility Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Facilities</span>
                  <Badge variant="secondary">{systemMetrics.facilities.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Facilities</span>
                  <Badge className={getStatusColor(systemMetrics.facilities.active / systemMetrics.facilities.total * 100, { good: 90, warning: 80 })}>
                    {systemMetrics.facilities.active}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Associations</span>
                  <Badge variant={systemMetrics.facilities.pendingAssociations > 10 ? "destructive" : "outline"}>
                    {systemMetrics.facilities.pendingAssociations}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reporting Rate</span>
                    <span>{systemMetrics.facilities.reportingRate}%</span>
                  </div>
                  <Progress value={systemMetrics.facilities.reportingRate} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Uptime</span>
                    <span className="font-medium text-green-600">{systemMetrics.system.uptime}%</span>
                  </div>
                  <Progress value={systemMetrics.system.uptime} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Response Time</span>
                  <Badge className={getStatusColor(300 - systemMetrics.system.responseTime, { good: 200, warning: 100 })}>
                    {systemMetrics.system.responseTime}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error Rate</span>
                  <Badge className={getStatusColor(5 - systemMetrics.system.errorRate, { good: 4, warning: 2 })}>
                    {systemMetrics.system.errorRate}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span>{systemMetrics.system.storageUsed}%</span>
                  </div>
                  <Progress value={systemMetrics.system.storageUsed} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">2.3TB</div>
                    <div className="text-xs text-gray-500">Used</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-400">1.2TB</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span>{systemMetrics.data.completeness}%</span>
                    </div>
                    <Progress value={systemMetrics.data.completeness} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span>{systemMetrics.data.accuracy}%</span>
                    </div>
                    <Progress value={systemMetrics.data.accuracy} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Timeliness</span>
                      <span>{systemMetrics.data.timeliness}%</span>
                    </div>
                    <Progress value={systemMetrics.data.timeliness} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Data Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Duplicate Records</span>
                  <Badge variant={systemMetrics.data.duplicates > 200 ? "destructive" : "secondary"}>
                    {systemMetrics.data.duplicates}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Missing Required Fields</span>
                  <Badge variant="outline">89</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Validation Errors</span>
                  <Badge variant="outline">23</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Outdated Records</span>
                  <Badge variant="outline">145</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Failed Login Attempts (24h)</span>
                  <Badge variant={systemMetrics.security.failedLogins > 50 ? "destructive" : "secondary"}>
                    {systemMetrics.security.failedLogins}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Suspicious Activities</span>
                  <Badge variant={systemMetrics.security.suspiciousActivity > 0 ? "destructive" : "secondary"}>
                    {systemMetrics.security.suspiciousActivity}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Security Vulnerabilities</span>
                  <Badge variant={systemMetrics.security.vulnerabilities > 0 ? "destructive" : "secondary"}>
                    {systemMetrics.security.vulnerabilities}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Security Scan</span>
                  <span className="text-sm text-gray-600">{systemMetrics.security.lastSecurityScan}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Role-based Access Active</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>2FA Enforcement</span>
                  <Badge variant="secondary">72% adoption</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Session Management</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Audit Logging</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Maintenance Mode</span>
                  <Badge variant="secondary">Off</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Backup Status</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Backup</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Scheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Daily Reports</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Sync</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Cleanup Jobs</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+15%</div>
                  <div className="text-sm text-gray-500">User growth (30d)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+8%</div>
                  <div className="text-sm text-gray-500">Data volume (30d)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemOverview;
