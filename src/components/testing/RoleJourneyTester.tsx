
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useRoleValidation } from '@/hooks/useRoleValidation';
import { UserRole } from '@/types/pharmaceutical';
import { 
  getRoleDisplayName, 
  VALID_PHARMACEUTICAL_ROLES,
  hasHigherOrEqualRole,
  canManageRoles,
  canApproveAssociations,
  getAssignableRoles
} from '@/utils/roleMapping';
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TestTube,
  Settings,
  Building,
  BarChart3,
  Eye,
  Users,
  FileText
} from 'lucide-react';

interface RoleJourneyTest {
  role: UserRole;
  expectedAccess: {
    dashboard: boolean;
    analytics: boolean;
    facilityManagement: boolean;
    userManagement: boolean;
    roleManagement: boolean;
    reports: boolean;
    systemSettings: boolean;
  };
  expectedPermissions: string[];
  expectedActions: string[];
}

const roleJourneyTests: RoleJourneyTest[] = [
  {
    role: 'viewer',
    expectedAccess: {
      dashboard: true,
      analytics: false,
      facilityManagement: false,
      userManagement: false,
      roleManagement: false,
      reports: true,
      systemSettings: false
    },
    expectedPermissions: ['viewProducts', 'viewReports'],
    expectedActions: ['View basic dashboard', 'Access limited reports']
  },
  {
    role: 'facility_officer',
    expectedAccess: {
      dashboard: true,
      analytics: false,
      facilityManagement: false,
      userManagement: false,
      roleManagement: false,
      reports: true,
      systemSettings: false
    },
    expectedPermissions: ['createProducts', 'editProducts', 'importData', 'exportData'],
    expectedActions: ['Manage products', 'Import/export data', 'Generate reports']
  },
  {
    role: 'facility_manager',
    expectedAccess: {
      dashboard: true,
      analytics: true,
      facilityManagement: true,
      userManagement: false,
      roleManagement: false,
      reports: true,
      systemSettings: false
    },
    expectedPermissions: ['createProducts', 'editProducts', 'deleteProducts', 'approveAssociations'],
    expectedActions: ['Manage facility', 'Approve user associations', 'Access analytics']
  },
  {
    role: 'data_analyst',
    expectedAccess: {
      dashboard: true,
      analytics: true,
      facilityManagement: false,
      userManagement: false,
      roleManagement: false,
      reports: true,
      systemSettings: false
    },
    expectedPermissions: ['dataAnalysis', 'viewAnalytics', 'advancedReports'],
    expectedActions: ['Advanced analytics', 'Data analysis', 'Generate complex reports']
  },
  {
    role: 'zonal',
    expectedAccess: {
      dashboard: true,
      analytics: true,
      facilityManagement: true,
      userManagement: true,
      roleManagement: true,
      reports: true,
      systemSettings: false
    },
    expectedPermissions: ['manageUsers', 'manageFacilities', 'manageRoles'],
    expectedActions: ['Manage zones', 'Approve associations', 'Assign roles']
  },
  {
    role: 'regional',
    expectedAccess: {
      dashboard: true,
      analytics: true,
      facilityManagement: true,
      userManagement: true,
      roleManagement: true,
      reports: true,
      systemSettings: true
    },
    expectedPermissions: ['manageSystem', 'manageUsers', 'manageFacilities'],
    expectedActions: ['Regional oversight', 'System configuration', 'Full role management']
  },
  {
    role: 'national',
    expectedAccess: {
      dashboard: true,
      analytics: true,
      facilityManagement: true,
      userManagement: true,
      roleManagement: true,
      reports: true,
      systemSettings: true
    },
    expectedPermissions: ['manageSystem', 'manageUsers', 'manageFacilities'],
    expectedActions: ['National oversight', 'Full system access', 'All permissions']
  }
];

export const RoleJourneyTester = () => {
  const { profile, hasRole, validateRole } = useAuth();
  const { canAccess, userRole, checkPermission } = usePermissions();
  const roleValidation = useRoleValidation();
  const [testResults, setTestResults] = useState<Array<{
    role: UserRole;
    category: string;
    test: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    expected?: any;
    actual?: any;
  }>>([]);

  const runRoleJourneyTests = () => {
    console.log('🧪 Starting role journey tests...');
    const results = [];

    // Test current user's role journey
    const currentRoleTest = roleJourneyTests.find(test => test.role === userRole);
    if (currentRoleTest) {
      // Test access permissions
      Object.entries(currentRoleTest.expectedAccess).forEach(([feature, shouldHaveAccess]) => {
        let hasAccess = false;
        
        switch (feature) {
          case 'dashboard':
            hasAccess = true; // All users should have dashboard access
            break;
          case 'analytics':
            hasAccess = canAccess.dataAnalysis;
            break;
          case 'facilityManagement':
            hasAccess = canAccess.manageFacilities;
            break;
          case 'userManagement':
            hasAccess = canAccess.manageUsers;
            break;
          case 'roleManagement':
            hasAccess = canAccess.manageRoles;
            break;
          case 'reports':
            hasAccess = canAccess.viewReports;
            break;
          case 'systemSettings':
            hasAccess = canAccess.manageSystem;
            break;
        }

        results.push({
          role: userRole,
          category: 'Access',
          test: `${feature} Access`,
          status: hasAccess === shouldHaveAccess ? 'pass' : 'fail' as const,
          message: `${feature}: ${hasAccess ? 'granted' : 'denied'}`,
          expected: shouldHaveAccess,
          actual: hasAccess
        });
      });

      // Test specific permissions
      currentRoleTest.expectedPermissions.forEach(permission => {
        const hasPermission = checkPermission(permission as any);
        results.push({
          role: userRole,
          category: 'Permissions',
          test: `${permission} Permission`,
          status: hasPermission ? 'pass' : 'warning' as const,
          message: `${permission}: ${hasPermission ? 'granted' : 'denied'}`,
          expected: true,
          actual: hasPermission
        });
      });
    }

    // Test role hierarchy
    VALID_PHARMACEUTICAL_ROLES.forEach(testRole => {
      const canAssign = roleValidation.canAssignRole(testRole);
      const shouldBeAbleToAssign = getAssignableRoles(userRole).includes(testRole);
      
      results.push({
        role: userRole,
        category: 'Hierarchy',
        test: `Can Assign ${testRole}`,
        status: canAssign === shouldBeAbleToAssign ? 'pass' : 'fail' as const,
        message: `Assign ${testRole}: ${canAssign ? 'allowed' : 'denied'}`,
        expected: shouldBeAbleToAssign,
        actual: canAssign
      });
    });

    // Test role validation
    const isValidRole = validateRole(userRole);
    results.push({
      role: userRole,
      category: 'Validation',
      test: 'Role Validation',
      status: isValidRole ? 'pass' : 'fail' as const,
      message: `Role ${userRole} is ${isValidRole ? 'valid' : 'invalid'}`,
      expected: true,
      actual: isValidRole
    });

    // Test management capabilities
    const canManage = canManageRoles(userRole);
    const expectedManage = ['national', 'regional', 'zonal'].includes(userRole);
    results.push({
      role: userRole,
      category: 'Management',
      test: 'Role Management Capability',
      status: canManage === expectedManage ? 'pass' : 'fail' as const,
      message: `Can manage roles: ${canManage}`,
      expected: expectedManage,
      actual: canManage
    });

    const canApprove = canApproveAssociations(userRole);
    const expectedApprove = ['national', 'regional', 'zonal', 'facility_manager'].includes(userRole);
    results.push({
      role: userRole,
      category: 'Management',
      test: 'Association Approval Capability',
      status: canApprove === expectedApprove ? 'pass' : 'fail' as const,
      message: `Can approve associations: ${canApprove}`,
      expected: expectedApprove,
      actual: canApprove
    });

    setTestResults(results);
    console.log('🧪 Role journey tests completed:', results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const currentRoleTest = roleJourneyTests.find(test => test.role === userRole);
  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, typeof testResults>);

  const passCount = testResults.filter(r => r.status === 'pass').length;
  const failCount = testResults.filter(r => r.status === 'fail').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Role Journey Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{getRoleDisplayName(userRole)}</div>
                  <Badge variant="outline" className="mt-1">
                    {userRole}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Passed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-600">{passCount}</div>
                  <p className="text-xs text-gray-600">Tests passed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-red-600">{failCount}</div>
                  <p className="text-xs text-gray-600">Tests failed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-yellow-600">{warningCount}</div>
                  <p className="text-xs text-gray-600">Tests with warnings</p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={runRoleJourneyTests} className="w-full">
              <TestTube className="h-4 w-4 mr-2" />
              Run Role Journey Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentRoleTest && (
        <Card>
          <CardHeader>
            <CardTitle>Expected User Journey for {getRoleDisplayName(userRole)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Expected Access:</h4>
                <div className="space-y-1">
                  {Object.entries(currentRoleTest.expectedAccess).map(([feature, hasAccess]) => (
                    <div key={feature} className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        {feature === 'dashboard' && <BarChart3 className="h-3 w-3 mr-1" />}
                        {feature === 'analytics' && <BarChart3 className="h-3 w-3 mr-1" />}
                        {feature === 'facilityManagement' && <Building className="h-3 w-3 mr-1" />}
                        {feature === 'userManagement' && <Users className="h-3 w-3 mr-1" />}
                        {feature === 'roleManagement' && <Shield className="h-3 w-3 mr-1" />}
                        {feature === 'reports' && <FileText className="h-3 w-3 mr-1" />}
                        {feature === 'systemSettings' && <Settings className="h-3 w-3 mr-1" />}
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant={hasAccess ? "default" : "secondary"} className="text-xs">
                        {hasAccess ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Expected Actions:</h4>
                <div className="space-y-1">
                  {currentRoleTest.expectedActions.map((action, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length > 0 && (
        <Tabs defaultValue={Object.keys(groupedResults)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {Object.keys(groupedResults).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedResults).map(([category, results]) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle>{category} Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="font-medium">{result.test}</p>
                            <p className="text-sm text-gray-600">{result.message}</p>
                            {result.expected !== undefined && (
                              <p className="text-xs text-gray-500">
                                Expected: {String(result.expected)} | Actual: {String(result.actual)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusColor(result.status) as any}>
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Role Comparison Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Role Journey Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Role</th>
                  <th className="text-center p-2">Dashboard</th>
                  <th className="text-center p-2">Analytics</th>
                  <th className="text-center p-2">Facilities</th>
                  <th className="text-center p-2">Users</th>
                  <th className="text-center p-2">Roles</th>
                  <th className="text-center p-2">System</th>
                </tr>
              </thead>
              <tbody>
                {roleJourneyTests.map((test) => (
                  <tr key={test.role} className={`border-b ${test.role === userRole ? 'bg-blue-50' : ''}`}>
                    <td className="p-2">
                      <Badge variant={test.role === userRole ? "default" : "outline"}>
                        {getRoleDisplayName(test.role)}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.dashboard ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.analytics ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.facilityManagement ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.userManagement ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.roleManagement ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                    <td className="text-center p-2">
                      {test.expectedAccess.systemSettings ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <XCircle className="h-4 w-4 text-red-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
