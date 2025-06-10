
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/hooks/useUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { Bug, Database, Users, Shield, RefreshCw } from 'lucide-react';

export const UserManagementDebug = () => {
  const { profile, user } = useAuth();
  const { allUsers, pendingUsers, isLoading, refetchUsers } = useUserManagement();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runDatabaseTest = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Check current user profile
      console.log('🔍 Testing current user profile...');
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      results.currentProfile = {
        success: !profileError,
        data: currentProfile,
        error: profileError?.message
      };

      // Test 2: Test profiles query without filters
      console.log('🔍 Testing raw profiles query...');
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, approval_status, is_active')
        .order('created_at', { ascending: false });

      results.allProfiles = {
        success: !allProfilesError,
        count: allProfiles?.length || 0,
        data: allProfiles?.slice(0, 5), // First 5 for debug
        error: allProfilesError?.message
      };

      // Test 3: Test pending users query
      console.log('🔍 Testing pending users query...');
      const { data: pendingProfiles, error: pendingError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, approval_status')
        .eq('approval_status', 'pending');

      results.pendingProfiles = {
        success: !pendingError,
        count: pendingProfiles?.length || 0,
        data: pendingProfiles,
        error: pendingError?.message
      };

      // Test 4: Test RPC functions
      console.log('🔍 Testing RPC functions...');
      const { data: hasNational, error: rpcError } = await supabase.rpc('has_national_users');

      results.rpcFunctions = {
        hasNational: {
          success: !rpcError,
          data: hasNational,
          error: rpcError?.message
        }
      };

      // Test 5: Check user management log
      console.log('🔍 Testing user management log...');
      const { data: managementLog, error: logError } = await supabase
        .from('user_management_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      results.managementLog = {
        success: !logError,
        count: managementLog?.length || 0,
        data: managementLog,
        error: logError?.message
      };

      setDebugInfo(results);
      console.log('🔍 Debug results:', results);

    } catch (error) {
      console.error('💥 Debug test failed:', error);
      results.error = error.message;
      setDebugInfo(results);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Bug className="h-5 w-5" />
          User Management Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">Current User</span>
            </div>
            <div className="text-xs space-y-1">
              <div>ID: {user?.id?.slice(0, 8)}...</div>
              <div>Email: {user?.email}</div>
              <div>Role: <Badge variant="outline">{profile?.role}</Badge></div>
            </div>
          </div>

          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="font-medium text-sm">Loaded Users</span>
            </div>
            <div className="text-xs space-y-1">
              <div>All Users: {allUsers.length}</div>
              <div>Pending: {pendingUsers.length}</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">Database Test</span>
            </div>
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={runDatabaseTest}
                disabled={testing}
                className="w-full text-xs"
              >
                {testing ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Database className="h-3 w-3 mr-1" />
                )}
                {testing ? 'Testing...' : 'Run Test'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={refetchUsers}
                className="w-full text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Results */}
        {debugInfo && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Test Results
            </h4>
            <div className="space-y-3 text-xs">
              {Object.entries(debugInfo).map(([key, value]: [string, any]) => (
                <div key={key} className="border-l-2 border-gray-300 pl-3">
                  <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  {value?.success !== undefined && (
                    <Badge variant={value.success ? 'default' : 'destructive'} className="text-xs mb-1">
                      {value.success ? 'Success' : 'Failed'}
                    </Badge>
                  )}
                  {value?.count !== undefined && (
                    <div>Count: {value.count}</div>
                  )}
                  {value?.error && (
                    <div className="text-red-600 mt-1">Error: {value.error}</div>
                  )}
                  {value?.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-blue-600">View Data</summary>
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                        {JSON.stringify(value.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
