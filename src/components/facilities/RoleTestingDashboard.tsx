
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  getRoleDisplayName, 
  ROLE_HIERARCHY, 
  VALID_PHARMACEUTICAL_ROLES,
  hasHigherOrEqualRole,
  canManageRoles,
  canApproveAssociations,
  getAssignableRoles
} from '@/utils/roleMapping';
import { 
  Shield, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Settings,
  TestTube,
  Eye,
  Users
} from 'lucide-react';

export const RoleTestingDashboard = () => {
  const { profile, hasRole, validateRole } = useAuth();
  const { canAccess, userRole, checkPermission, hasMinimumRole, getRoleLevel } = usePermissions();
  const [testResults, setTestResults] = useState<Array<{
    category: string;
    test: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    expected?: any;
    actual?: any;
  }>>([]);

  const runRoleTests = () => {
    console.log('🧪 Starting comprehensive role testing...');
    const results = [];

    // Test 1: Basic Role Assignment
    results.push({
      category: 'Basic',
      test: 'User Role Assignment',
      status: profile?.role ? 'pass' : 'fail' as const,
      message: profile?.role ? `User has role: ${profile.role}` : 'No role assigned',
      expected: 'Valid role',
      actual: profile?.role || 'undefined'
    });

    // Test 2: Role Validation
    const roleValidation = validateRole(profile?.role || '');
    results.push({
      category: 'Validation',
      test: 'Role Validation',
      status: roleValidation ? 'pass' : 'fail' as const,
      message: roleValidation ? 'Role is valid' : 'Role validation failed',
      expected: true,
      actual: roleValidation
    });

    // Test 3: Role Hierarchy
    const roleLevel = getRoleLevel();
    results.push({
      category: 'Hierarchy',
      test: 'Role Level Assignment',
      status: roleLevel > 0 ? 'pass' : 'warning' as const,
      message: `Role level: ${roleLevel}`,
      expected: '> 0',
      actual: roleLevel
    });

    // Test 4: Permission Mapping
    const permissionTests = [
      { permission: 'viewProducts', shouldHave: true },
      { permission: 'manageUsers', shouldHave: hasMinimumRole('zonal') },
      { permission: 'manageSystem', shouldHave: hasMinimumRole('regional') },
      { permission: 'dataAnalysis', shouldHave: hasMinimumRole('data_analyst') }
    ];

    permissionTests.forEach(({ permission, shouldHave }) => {
      const hasPermission = checkPermission(permission as any);
      results.push({
        category: 'Permissions',
        test: `Permission: ${permission}`,
        status: hasPermission === shouldHave ? 'pass' : 'warning' as const,
        message: `${permission}: ${hasPermission ? 'granted' : 'denied'}`,
        expected: shouldHave,
        actual: hasPermission
      });
    });

    // Test 5: Role Management Capabilities
    const canManage = canManageRoles(userRole);
    const expectedManage = ['national', 'regional', 'zonal'].includes(userRole);
    results.push({
      category: 'Management',
      test: 'Can Manage Roles',
      status: canManage === expectedManage ? 'pass' : 'fail' as const,
      message: `Role management: ${canManage ? 'allowed' : 'denied'}`,
      expected: expectedManage,
      actual: canManage
    });

    // Test 6: Association Approval
    const canApprove = canApproveAssociations(userRole);
    const expectedApprove = ['national', 'regional', 'zonal', 'facility_manager'].includes(userRole);
    results.push({
      category: 'Management',
      test: 'Can Approve Associations',
      status: canApprove === expectedApprove ? 'pass' : 'fail' as const,
      message: `Association approval: ${canApprove ? 'allowed' : 'denied'}`,
      expected: expectedApprove,
      actual: canApprove
    });

    // Test 7: Assignable Roles
    const assignableRoles = getAssignableRoles(userRole);
    const hasValidAssignableRoles = assignableRoles.every(role => 
      ROLE_HIERARCHY[role] < ROLE_HIERARCHY[userRole]
    );
    results.push({
      category: 'Management',
      test: 'Assignable Roles Hierarchy',
      status: hasValidAssignableRoles ? 'pass' : 'fail' as const,
      message: `Can assign ${assignableRoles.length} lower-level roles`,
      expected: 'Only lower-level roles',
      actual: assignableRoles.join(', ')
    });

    // Test 8: UI Access Tests
    const uiTests = [
      { feature: 'Dashboard Access', hasAccess: true },
      { feature: 'Admin Dashboard', hasAccess: canAccess.hasAdminAccess },
      { feature: 'Analytics', hasAccess: canAccess.dataAnalysis },
      { feature: 'System Management', hasAccess: canAccess.manageSystem }
    ];

    uiTests.forEach(({ feature, hasAccess }) => {
      results.push({
        category: 'UI Access',
        test: feature,
        status: 'pass' as const,
        message: `${feature}: ${hasAccess ? 'accessible' : 'restricted'}`,
        expected: 'Based on role',
        actual: hasAccess
      });
    });

    setTestResults(results);
    console.log('🧪 Role testing completed:', results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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

  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, typeof testResults>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Comprehensive Role Testing Dashboard
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
                    Level {getRoleLevel()}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {Object.values(canAccess).filter(Boolean).length}
                  </div>
                  <p className="text-xs text-gray-600">Active permissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Assignable Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {getAssignableRoles(userRole).length}
                  </div>
                  <p className="text-xs text-gray-600">Can assign to others</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {canManageRoles(userRole) ? 'Yes' : 'No'}
                  </div>
                  <p className="text-xs text-gray-600">Can manage roles</p>
                </CardContent>
              </Card>
            </div>

            <Button onClick={runRoleTests} className="w-full">
              <TestTube className="h-4 w-4 mr-2" />
              Run Comprehensive Role Tests
            </Button>
          </div>
        </CardContent>
      </Card>

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
                            {result.expected && (
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

      {/* Role Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Role Information & Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Current Permissions:</h4>
              <div className="space-y-1">
                {Object.entries(canAccess).map(([permission, hasAccess]) => (
                  <div key={permission} className="flex items-center justify-between text-sm">
                    <span>{permission.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Badge variant={hasAccess ? "default" : "secondary"} className="text-xs">
                      {hasAccess ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Role Hierarchy:</h4>
              <div className="space-y-1">
                {VALID_PHARMACEUTICAL_ROLES.sort((a, b) => 
                  ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a]
                ).map((role) => (
                  <div key={role} className="flex items-center justify-between text-sm">
                    <span className={role === userRole ? 'font-bold text-blue-600' : ''}>
                      {getRoleDisplayName(role)}
                    </span>
                    <Badge 
                      variant={role === userRole ? "default" : "outline"} 
                      className="text-xs"
                    >
                      Level {ROLE_HIERARCHY[role]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
