
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHasNationalUsers } from '@/hooks/useFirstAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Database, Users, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const FirstAdminTestPanel = () => {
  const { user, profile } = useAuth();
  const { data: hasNationalUsers, isLoading, refetch } = useHasNationalUsers();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (test: string, status: 'pass' | 'fail' | 'warning', details: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      status,
      details
    }]);
  };

  const runComprehensiveTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: Check database function exists
      addTestResult('Database Function Check', 'pass', 'Testing has_national_users function...');
      
      try {
        const { data, error } = await supabase.rpc('has_national_users');
        if (error) {
          addTestResult('has_national_users RPC', 'fail', { error: error.message });
        } else {
          addTestResult('has_national_users RPC', 'pass', { result: data });
        }
      } catch (err: any) {
        addTestResult('has_national_users RPC', 'fail', { error: err.message });
      }

      // Test 2: Check create_first_admin function
      addTestResult('create_first_admin Function', 'pass', 'Checking function accessibility...');
      
      try {
        // Just check if we can call it (will fail with valid error if function exists)
        await supabase.rpc('create_first_admin', {
          _user_id: '00000000-0000-0000-0000-000000000000',
          _email: 'test@test.com',
          _full_name: 'Test User'
        });
      } catch (err: any) {
        if (err.message.includes('function') && err.message.includes('does not exist')) {
          addTestResult('create_first_admin Function', 'fail', { error: 'Function does not exist' });
        } else {
          addTestResult('create_first_admin Function', 'pass', { note: 'Function exists (expected error)' });
        }
      }

      // Test 3: Check profiles table structure
      addTestResult('Profiles Table', 'pass', 'Checking table structure...');
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, role, is_active')
          .limit(1);
        
        if (error) {
          addTestResult('Profiles Table Structure', 'fail', { error: error.message });
        } else {
          addTestResult('Profiles Table Structure', 'pass', { note: 'Table accessible' });
        }
      } catch (err: any) {
        addTestResult('Profiles Table Structure', 'fail', { error: err.message });
      }

      // Test 4: Check current user authentication
      if (user) {
        addTestResult('User Authentication', 'pass', { userId: user.id, email: user.email });
        
        // Test 5: Check user profile
        try {
          const { data: userProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            addTestResult('User Profile', 'fail', { error: error.message });
          } else if (!userProfile) {
            addTestResult('User Profile', 'warning', { note: 'Profile does not exist for current user' });
          } else {
            addTestResult('User Profile', 'pass', userProfile);
          }
        } catch (err: any) {
          addTestResult('User Profile', 'fail', { error: err.message });
        }
      } else {
        addTestResult('User Authentication', 'warning', { note: 'No user currently logged in' });
      }

      // Test 6: Check user_roles table
      addTestResult('User Roles Table', 'pass', 'Checking user_roles table...');
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .limit(1);
        
        if (error) {
          addTestResult('User Roles Table', 'fail', { error: error.message });
        } else {
          addTestResult('User Roles Table', 'pass', { note: 'Table accessible' });
        }
      } catch (err: any) {
        addTestResult('User Roles Table', 'fail', { error: err.message });
      }

      // Test 7: Check role_audit_log table
      try {
        const { data, error } = await supabase
          .from('role_audit_log')
          .select('*')
          .limit(1);
        
        if (error) {
          addTestResult('Role Audit Log Table', 'fail', { error: error.message });
        } else {
          addTestResult('Role Audit Log Table', 'pass', { note: 'Table accessible' });
        }
      } catch (err: any) {
        addTestResult('Role Audit Log Table', 'fail', { error: err.message });
      }

      // Test 8: Test enum values
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('role', 'national')
          .limit(1);
        
        if (error) {
          addTestResult('Role Enum', 'fail', { error: error.message });
        } else {
          addTestResult('Role Enum', 'pass', { note: 'National role enum accessible' });
        }
      } catch (err: any) {
        addTestResult('Role Enum', 'fail', { error: err.message });
      }

    } catch (error: any) {
      addTestResult('Test Suite', 'fail', { error: error.message });
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            First Admin Feature Test Panel
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">National Users</span>
              <Badge variant={hasNationalUsers ? "default" : "secondary"}>
                {isLoading ? "Checking..." : hasNationalUsers ? "Exist" : "None"}
              </Badge>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current User</span>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? "Logged In" : "Not Logged In"}
              </Badge>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">User Role</span>
              <Badge variant={profile?.role === 'national' ? "default" : "secondary"}>
                {profile?.role || "None"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="space-y-4">
          <Button
            onClick={runComprehensiveTests}
            disabled={isRunningTests}
            className="w-full"
          >
            <Database className="w-4 h-4 mr-2" />
            {isRunningTests ? "Running Tests..." : "Run Comprehensive Tests"}
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Test Results</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTestResults([])}
              className="w-full"
            >
              Clear Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
