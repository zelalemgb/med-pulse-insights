
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TestTube, 
  User, 
  Shield,
  LogIn,
  UserPlus
} from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export const AuthTester = () => {
  const { user, profile, signIn, signUp, signOut } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@test.com',
    password: 'TestPassword123!',
    fullName: 'Test Super Admin'
  });

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const checkDatabaseState = async () => {
    try {
      // Check if any national users exist
      const { data, error } = await supabase.rpc('has_national_users');
      
      if (error) {
        addTestResult({
          test: 'Database Connection',
          status: 'fail',
          message: 'Failed to connect to database',
          details: error
        });
        return false;
      }

      addTestResult({
        test: 'Database Connection',
        status: 'pass',
        message: 'Successfully connected to database'
      });

      addTestResult({
        test: 'National Users Check',
        status: data ? 'warning' : 'pass',
        message: data ? 'National users already exist' : 'No national users exist - ready for first admin'
      });

      return true;
    } catch (error) {
      addTestResult({
        test: 'Database State Check',
        status: 'fail',
        message: 'Error checking database state',
        details: error
      });
      return false;
    }
  };

  const testSignUp = async () => {
    try {
      const { error } = await signUp(
        testCredentials.email,
        testCredentials.password,
        testCredentials.fullName
      );

      if (error) {
        if (error.message.includes('already registered')) {
          addTestResult({
            test: 'Sign Up',
            status: 'warning',
            message: 'User already exists - this is expected if testing multiple times',
            details: error.message
          });
          return true; // This is actually OK for testing
        } else {
          addTestResult({
            test: 'Sign Up',
            status: 'fail',
            message: 'Sign up failed',
            details: error.message
          });
          return false;
        }
      }

      addTestResult({
        test: 'Sign Up',
        status: 'pass',
        message: 'Sign up successful'
      });
      return true;
    } catch (error) {
      addTestResult({
        test: 'Sign Up',
        status: 'fail',
        message: 'Sign up error',
        details: error
      });
      return false;
    }
  };

  const testSignIn = async () => {
    try {
      const { error } = await signIn(testCredentials.email, testCredentials.password);

      if (error) {
        addTestResult({
          test: 'Sign In',
          status: 'fail',
          message: 'Sign in failed',
          details: error.message
        });
        return false;
      }

      addTestResult({
        test: 'Sign In',
        status: 'pass',
        message: 'Sign in successful'
      });

      // Wait a moment for the profile to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      addTestResult({
        test: 'Sign In',
        status: 'fail',
        message: 'Sign in error',
        details: error
      });
      return false;
    }
  };

  const testProfileCreation = async () => {
    try {
      if (!user) {
        addTestResult({
          test: 'Profile Creation',
          status: 'fail',
          message: 'No user found after authentication'
        });
        return false;
      }

      // Check if profile was created automatically
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        addTestResult({
          test: 'Profile Creation',
          status: 'fail',
          message: 'Profile not found in database',
          details: error
        });
        return false;
      }

      addTestResult({
        test: 'Profile Creation',
        status: 'pass',
        message: `Profile created with role: ${profileData.role}`,
        details: profileData
      });

      return true;
    } catch (error) {
      addTestResult({
        test: 'Profile Creation',
        status: 'fail',
        message: 'Error checking profile',
        details: error
      });
      return false;
    }
  };

  const testFirstAdminUpgrade = async () => {
    try {
      if (!user) {
        addTestResult({
          test: 'First Admin Upgrade',
          status: 'fail',
          message: 'No user to upgrade'
        });
        return false;
      }

      // Try to upgrade to first admin
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: user.id,
        _email: user.email,
        _full_name: testCredentials.fullName
      });

      if (error) {
        if (error.message.includes('already exist')) {
          addTestResult({
            test: 'First Admin Upgrade',
            status: 'warning',
            message: 'National users already exist - cannot create first admin',
            details: error.message
          });
          return true; // This is expected if testing multiple times
        } else {
          addTestResult({
            test: 'First Admin Upgrade',
            status: 'fail',
            message: 'Failed to upgrade to first admin',
            details: error.message
          });
          return false;
        }
      }

      addTestResult({
        test: 'First Admin Upgrade',
        status: 'pass',
        message: 'Successfully upgraded to first admin (national role)'
      });

      return true;
    } catch (error) {
      addTestResult({
        test: 'First Admin Upgrade',
        status: 'fail',
        message: 'Error during first admin upgrade',
        details: error
      });
      return false;
    }
  };

  const testPermissions = async () => {
    try {
      if (!profile) {
        addTestResult({
          test: 'Permission Check',
          status: 'fail',
          message: 'No profile loaded to check permissions'
        });
        return false;
      }

      const isNational = profile.role === 'national';
      const canManage = ['national', 'regional', 'zonal'].includes(profile.role);

      addTestResult({
        test: 'Permission Check',
        status: isNational ? 'pass' : 'warning',
        message: `User role: ${profile.role}, Can manage: ${canManage}`,
        details: { role: profile.role, canManage }
      });

      return true;
    } catch (error) {
      addTestResult({
        test: 'Permission Check',
        status: 'fail',
        message: 'Error checking permissions',
        details: error
      });
      return false;
    }
  };

  const runFullAuthTest = async () => {
    setIsRunning(true);
    clearResults();

    console.log('🧪 Starting comprehensive authentication test...');

    // Test 1: Check database state
    const dbOk = await checkDatabaseState();
    if (!dbOk) {
      setIsRunning(false);
      return;
    }

    // Test 2: Sign out if already logged in
    if (user) {
      await signOut();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Test sign up
    const signUpOk = await testSignUp();
    if (!signUpOk) {
      setIsRunning(false);
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 4: Test sign in
    const signInOk = await testSignIn();
    if (!signInOk) {
      setIsRunning(false);
      return;
    }

    // Test 5: Check profile creation
    await testProfileCreation();

    // Test 6: Test first admin upgrade
    await testFirstAdminUpgrade();

    // Test 7: Check permissions
    await testPermissions();

    setIsRunning(false);
    console.log('🧪 Authentication test completed');
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Authentication System Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Auth Status */}
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    User Role
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
                    <LogIn className="h-4 w-4 mr-2" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{user?.email || 'Not logged in'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Test Credentials */}
            <div className="space-y-3">
              <h4 className="font-semibold">Test Credentials:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={testCredentials.fullName}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Test Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={runFullAuthTest} 
                disabled={isRunning}
                className="flex items-center"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run Full Auth Test'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearResults}
                disabled={isRunning}
              >
                Clear Results
              </Button>

              {user && (
                <Button 
                  variant="destructive" 
                  onClick={signOut}
                  disabled={isRunning}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
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
                  <Badge variant={getStatusColor(result.status) as any}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
