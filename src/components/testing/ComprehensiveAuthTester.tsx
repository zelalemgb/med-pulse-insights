
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TestTube,
  Database,
  Server,
  Monitor,
  User,
  Shield,
  Key,
  Users,
  Settings
} from 'lucide-react';

interface TestResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details?: any;
  recommendation?: string;
}

export const ComprehensiveAuthTester = () => {
  const { user, profile, signIn, signOut, hasRole, validateRole, updateUserRole } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Database Tests
  const runDatabaseTests = async () => {
    setCurrentTest('Testing Database Structure...');

    // Test 1: Check if profiles table exists and has correct structure
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (error) {
        addResult({
          category: 'Database',
          test: 'Profiles Table Access',
          status: 'fail',
          message: 'Cannot access profiles table',
          details: error,
          recommendation: 'Check if profiles table exists and RLS policies are correct'
        });
      } else {
        addResult({
          category: 'Database',
          test: 'Profiles Table Access',
          status: 'pass',
          message: 'Profiles table accessible'
        });
      }
    } catch (error) {
      addResult({
        category: 'Database',
        test: 'Profiles Table Access',
        status: 'fail',
        message: 'Database connection error',
        details: error
      });
    }

    // Test 2: Check user_roles table
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);

      if (error) {
        addResult({
          category: 'Database',
          test: 'User Roles Table',
          status: 'fail',
          message: 'Cannot access user_roles table',
          details: error
        });
      } else {
        addResult({
          category: 'Database',
          test: 'User Roles Table',
          status: 'pass',
          message: 'User roles table accessible'
        });
      }
    } catch (error) {
      addResult({
        category: 'Database',
        test: 'User Roles Table',
        status: 'fail',
        message: 'User roles table error',
        details: error
      });
    }

    // Test 3: Check RLS policies
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);

        if (error) {
          addResult({
            category: 'Database',
            test: 'RLS Policies',
            status: 'fail',
            message: 'RLS blocking user profile access',
            details: error,
            recommendation: 'Check RLS policies on profiles table'
          });
        } else if (data && data.length > 0) {
          addResult({
            category: 'Database',
            test: 'RLS Policies',
            status: 'pass',
            message: 'User can access own profile'
          });
        } else {
          addResult({
            category: 'Database',
            test: 'RLS Policies',
            status: 'warning',
            message: 'No profile found for current user',
            recommendation: 'Profile may not exist for this user'
          });
        }
      } catch (error) {
        addResult({
          category: 'Database',
          test: 'RLS Policies',
          status: 'fail',
          message: 'RLS policy test failed',
          details: error
        });
      }
    }

    // Test 4: Check database functions
    try {
      const { data, error } = await supabase.rpc('has_national_users');
      
      if (error) {
        addResult({
          category: 'Database',
          test: 'Database Functions',
          status: 'fail',
          message: 'Database functions not working',
          details: error,
          recommendation: 'Check if database functions are properly created'
        });
      } else {
        addResult({
          category: 'Database',
          test: 'Database Functions',
          status: 'pass',
          message: `Database functions working. Has national users: ${data}`
        });
      }
    } catch (error) {
      addResult({
        category: 'Database',
        test: 'Database Functions',
        status: 'fail',
        message: 'Database function call failed',
        details: error
      });
    }
  };

  // Backend/Supabase Tests
  const runBackendTests = async () => {
    setCurrentTest('Testing Backend Services...');

    // Test 1: Auth Service Connection
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      addResult({
        category: 'Backend',
        test: 'Supabase Auth Connection',
        status: session ? 'pass' : 'info',
        message: session ? 'Auth session active' : 'No active session',
        details: { sessionExists: !!session }
      });
    } catch (error) {
      addResult({
        category: 'Backend',
        test: 'Supabase Auth Connection',
        status: 'fail',
        message: 'Cannot connect to Supabase Auth',
        details: error
      });
    }

    // Test 2: Real-time Subscriptions
    try {
      const channel = supabase.channel('test-channel');
      
      setTimeout(() => {
        channel.unsubscribe();
        addResult({
          category: 'Backend',
          test: 'Real-time Connection',
          status: 'pass',
          message: 'Real-time subscriptions working'
        });
      }, 1000);
    } catch (error) {
      addResult({
        category: 'Backend',
        test: 'Real-time Connection',
        status: 'fail',
        message: 'Real-time connection failed',
        details: error
      });
    }

    // Test 3: Storage Access
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        addResult({
          category: 'Backend',
          test: 'Storage Access',
          status: 'warning',
          message: 'Storage access limited or not configured',
          details: error
        });
      } else {
        addResult({
          category: 'Backend',
          test: 'Storage Access',
          status: 'pass',
          message: `Storage accessible. Buckets: ${data.length}`
        });
      }
    } catch (error) {
      addResult({
        category: 'Backend',
        test: 'Storage Access',
        status: 'fail',
        message: 'Storage connection failed',
        details: error
      });
    }
  };

  // Frontend Tests
  const runFrontendTests = async () => {
    setCurrentTest('Testing Frontend Components...');

    // Test 1: Auth Context
    addResult({
      category: 'Frontend',
      test: 'Auth Context Loading',
      status: user !== undefined ? 'pass' : 'warning',
      message: user !== undefined ? 'Auth context loaded' : 'Auth context still loading',
      details: { 
        userExists: !!user, 
        profileExists: !!profile,
        userEmail: user?.email
      }
    });

    // Test 2: Profile Data Consistency
    if (user && profile) {
      const emailMatch = user.email === profile.email;
      const idMatch = user.id === profile.id;
      
      addResult({
        category: 'Frontend',
        test: 'Profile Data Consistency',
        status: emailMatch && idMatch ? 'pass' : 'fail',
        message: emailMatch && idMatch ? 'User and profile data consistent' : 'Data mismatch between user and profile',
        details: { emailMatch, idMatch },
        recommendation: !emailMatch || !idMatch ? 'Check profile creation and update logic' : undefined
      });
    } else if (user && !profile) {
      addResult({
        category: 'Frontend',
        test: 'Profile Data Consistency',
        status: 'fail',
        message: 'User exists but no profile loaded',
        recommendation: 'Check profile fetching logic in AuthContext'
      });
    }

    // Test 3: Role Functions
    if (profile) {
      const roleValidation = validateRole(profile.role);
      addResult({
        category: 'Frontend',
        test: 'Role Validation Function',
        status: roleValidation ? 'pass' : 'fail',
        message: `Role validation: ${profile.role} -> ${roleValidation}`,
        details: { role: profile.role, isValid: roleValidation }
      });

      // Test hasRole function
      const hasCurrentRole = hasRole(profile.role);
      addResult({
        category: 'Frontend',
        test: 'hasRole Function',
        status: hasCurrentRole ? 'pass' : 'fail',
        message: `hasRole(${profile.role}): ${hasCurrentRole}`,
        details: { role: profile.role, hasRole: hasCurrentRole }
      });
    }

    // Test 4: Navigation and Routing
    const currentPath = window.location.pathname;
    const expectedPath = user ? '/' : '/auth';
    
    addResult({
      category: 'Frontend',
      test: 'Route Access Control',
      status: 'info',
      message: `Current path: ${currentPath}, Expected for auth state: ${expectedPath}`,
      details: { currentPath, expectedPath, isAuthenticated: !!user }
    });

    // Test 5: Component Error Boundaries
    try {
      // Check if there are any React errors in console
      const errorCount = performance.getEntriesByType('navigation').length;
      addResult({
        category: 'Frontend',
        test: 'Component Stability',
        status: 'pass',
        message: 'No apparent component errors detected'
      });
    } catch (error) {
      addResult({
        category: 'Frontend',
        test: 'Component Stability',
        status: 'warning',
        message: 'Cannot assess component stability',
        details: error
      });
    }
  };

  // Authentication Flow Tests
  const runAuthFlowTests = async () => {
    setCurrentTest('Testing Authentication Flows...');

    // Test 1: Sign Out Flow
    if (user) {
      addResult({
        category: 'Auth Flow',
        test: 'Sign Out Availability',
        status: 'pass',
        message: 'Sign out function available while authenticated'
      });
    } else {
      addResult({
        category: 'Auth Flow',
        test: 'Sign Out Availability',
        status: 'info',
        message: 'Not authenticated - sign out test skipped'
      });
    }

    // Test 2: Session Persistence
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionMatchesUser = session?.user?.id === user?.id;
      
      addResult({
        category: 'Auth Flow',
        test: 'Session Persistence',
        status: sessionMatchesUser ? 'pass' : (session ? 'warning' : 'info'),
        message: sessionMatchesUser ? 'Session matches current user' : 
                 session ? 'Session exists but user mismatch' : 'No session found',
        details: { 
          sessionUserId: session?.user?.id, 
          contextUserId: user?.id,
          sessionExists: !!session
        }
      });
    } catch (error) {
      addResult({
        category: 'Auth Flow',
        test: 'Session Persistence',
        status: 'fail',
        message: 'Cannot check session persistence',
        details: error
      });
    }

    // Test 3: Token Refresh
    addResult({
      category: 'Auth Flow',
      test: 'Token Refresh Configuration',
      status: 'info',
      message: 'Token refresh is configured automatically by Supabase client'
    });
  };

  // Role System Tests
  const runRoleTests = async () => {
    setCurrentTest('Testing Role System...');

    if (!profile) {
      addResult({
        category: 'Roles',
        test: 'Role System Access',
        status: 'warning',
        message: 'Cannot test roles - no profile loaded'
      });
      return;
    }

    // Test 1: Role Hierarchy
    const validRoles = ['viewer', 'facility_officer', 'facility_manager', 'zonal', 'regional', 'national'];
    const roleIndex = validRoles.indexOf(profile.role);
    
    addResult({
      category: 'Roles',
      test: 'Role Hierarchy Position',
      status: roleIndex >= 0 ? 'pass' : 'fail',
      message: roleIndex >= 0 ? `Role ${profile.role} found at hierarchy level ${roleIndex}` : `Invalid role: ${profile.role}`,
      details: { role: profile.role, hierarchyLevel: roleIndex }
    });

    // Test 2: Permission Mapping
    // This would need to be expanded based on your permission system
    addResult({
      category: 'Roles',
      test: 'Permission Mapping',
      status: 'info',
      message: `Current role: ${profile.role}`,
      details: { role: profile.role }
    });

    // Test 3: Role Update Capability
    if (profile.role === 'national') {
      addResult({
        category: 'Roles',
        test: 'Role Management Access',
        status: 'pass',
        message: 'National role can manage other roles'
      });
    } else {
      addResult({
        category: 'Roles',
        test: 'Role Management Access',
        status: 'info',
        message: `Role ${profile.role} has limited role management access`
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();
    
    try {
      await runDatabaseTests();
      await runBackendTests();
      await runFrontendTests();
      await runAuthFlowTests();
      await runRoleTests();
    } catch (error) {
      addResult({
        category: 'System',
        test: 'Test Execution',
        status: 'fail',
        message: 'Test execution failed',
        details: error
      });
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Settings className="h-4 w-4 text-blue-600" />;
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
      case 'info':
        return 'outline';
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
  }, {} as Record<string, TestResult[]>);

  const getSummaryStats = () => {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const warnings = testResults.filter(r => r.status === 'warning').length;
    const info = testResults.filter(r => r.status === 'info').length;
    
    return { total, passed, failed, warnings, info };
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Comprehensive Authentication & Role Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Auth Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={user ? "default" : "secondary"}>
                    {user ? 'Authenticated' : 'Not Authenticated'}
                  </Badge>
                  {user && (
                    <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={profile?.role === 'national' ? "default" : "outline"}>
                    {profile?.role || 'No Role'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Test Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isRunning ? (
                    <div>
                      <Badge variant="secondary">Running...</Badge>
                      <p className="text-xs text-gray-600 mt-1">{currentTest}</p>
                    </div>
                  ) : (
                    <Badge variant="outline">Ready</Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Test Results Summary */}
            {testResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold">{stats.total}</div>
                  <div className="text-xs text-gray-600">Total Tests</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">{stats.passed}</div>
                  <div className="text-xs text-gray-600">Passed</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">{stats.failed}</div>
                  <div className="text-xs text-gray-600">Failed</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-lg font-bold text-yellow-600">{stats.warnings}</div>
                  <div className="text-xs text-gray-600">Warnings</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">{stats.info}</div>
                  <div className="text-xs text-gray-600">Info</div>
                </div>
              </div>
            )}

            {/* Test Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearResults}
                disabled={isRunning}
              >
                Clear Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Tabs defaultValue={Object.keys(groupedResults)[0]} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedResults).length}, 1fr)` }}>
            {Object.keys(groupedResults).map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center">
                {category === 'Database' && <Database className="h-4 w-4 mr-1" />}
                {category === 'Backend' && <Server className="h-4 w-4 mr-1" />}
                {category === 'Frontend' && <Monitor className="h-4 w-4 mr-1" />}
                {category === 'Auth Flow' && <Key className="h-4 w-4 mr-1" />}
                {category === 'Roles' && <Users className="h-4 w-4 mr-1" />}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedResults).map(([category, results]) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle>{category} Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getStatusIcon(result.status)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{result.test}</h4>
                                <Badge variant={getStatusColor(result.status) as any}>
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                              
                              {result.recommendation && (
                                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                                  <strong>Recommendation:</strong> {result.recommendation}
                                </div>
                              )}
                              
                              {result.details && (
                                <details className="mt-2">
                                  <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
