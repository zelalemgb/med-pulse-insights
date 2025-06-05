
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserCheck, Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export const TestRegistrationButton = () => {
  const { user, profile } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const runRegistrationTest = async () => {
    setTesting(true);
    setTestResults(null);
    
    const testEmail = `test-user-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testFullName = 'Test User Registration';
    
    console.log('🧪 Starting registration test with:', testEmail);
    
    try {
      // Step 1: Test signup
      console.log('📝 Step 1: Testing signup...');
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: testFullName
          }
        }
      });

      if (signupError) {
        throw new Error(`Signup failed: ${signupError.message}`);
      }

      const userId = signupData?.user?.id;
      if (!userId) {
        throw new Error('No user ID returned from signup');
      }

      console.log('✅ Step 1 passed: User created with ID:', userId);

      // Step 2: Check if user exists in auth.users
      console.log('🔍 Step 2: Checking auth.users table...');
      const { data: authUser, error: authError } = await supabase.auth.getUser(signupData.session?.access_token);
      
      if (authError && !authUser) {
        console.warn('⚠️ Could not verify auth user directly, but signup succeeded');
      }

      // Step 3: Wait for trigger to create profile
      console.log('⏳ Step 3: Waiting for profile creation trigger...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Check if profile was created
      console.log('🔍 Step 4: Checking profiles table...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let profileExists = false;
      if (profileError) {
        console.error('❌ Error checking profile:', profileError);
      } else if (profileData) {
        profileExists = true;
        console.log('✅ Step 4 passed: Profile found:', profileData);
      } else {
        console.log('⚠️ Step 4: No profile found, trigger may not have fired');
      }

      // Step 5: Check user_roles table
      console.log('🔍 Step 5: Checking user_roles table...');
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      let roleExists = false;
      if (roleError) {
        console.error('❌ Error checking roles:', roleError);
      } else if (roleData && roleData.length > 0) {
        roleExists = true;
        console.log('✅ Step 5 passed: Role found:', roleData);
      } else {
        console.log('⚠️ Step 5: No role found');
      }

      // Step 6: Test signin
      console.log('🔐 Step 6: Testing signin...');
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      let signinWorks = false;
      if (signinError) {
        console.error('❌ Signin failed:', signinError);
      } else if (signinData?.user) {
        signinWorks = true;
        console.log('✅ Step 6 passed: Signin successful');
        
        // Sign out the test user
        await supabase.auth.signOut();
      }

      // Compile results
      const results = {
        testEmail,
        userId,
        steps: {
          signup: { success: true, data: signupData },
          authUser: { success: !authError, data: authUser },
          profile: { success: profileExists, data: profileData },
          roles: { success: roleExists, data: roleData },
          signin: { success: signinWorks, data: signinData }
        },
        overall: profileExists && signinWorks
      };

      setTestResults(results);
      
      if (results.overall) {
        toast.success('✅ Registration test passed! All systems working correctly.');
      } else {
        toast.error('❌ Registration test found issues. Check the results below.');
      }

    } catch (error) {
      console.error('💥 Registration test failed:', error);
      setTestResults({
        error: error.message,
        overall: false
      });
      toast.error(`Registration test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Registration Flow Test
        </CardTitle>
        <CardDescription>
          Test the complete user registration flow including database integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Current User Status</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user ? 'default' : 'secondary'}>
                {user ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
              {profile && (
                <Badge variant="outline">
                  Role: {profile.role}
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            onClick={runRegistrationTest}
            disabled={testing}
            className="flex items-center gap-2"
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {testing ? 'Testing...' : 'Run Test'}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-3 mt-6 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              {testResults.overall ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <h4 className="font-medium">
                Test Results: {testResults.overall ? 'PASSED' : 'FAILED'}
              </h4>
            </div>

            {testResults.error ? (
              <div className="text-red-600 text-sm">
                Error: {testResults.error}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">
                  Test Email: {testResults.testEmail}
                </div>
                <div className="text-gray-600">
                  User ID: {testResults.userId}
                </div>
                
                <div className="space-y-1">
                  {Object.entries(testResults.steps).map(([step, result]: [string, any]) => (
                    <div key={step} className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{step}</span>
                      <Badge variant={result.success ? 'default' : 'destructive'} className="text-xs">
                        {result.success ? 'Pass' : 'Fail'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
