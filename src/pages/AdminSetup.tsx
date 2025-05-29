
import React, { useState, useCallback, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useHasNationalUsers, useCreateFirstAdmin } from '@/hooks/useFirstAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Crown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminSetup = () => {
  const { user, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { data: hasNationalUsers, isLoading: checkingNationalUsers, error: nationalUsersError } = useHasNationalUsers();
  const createFirstAdmin = useCreateFirstAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  
  // Use useRef to prevent function recreation on every render
  const debugInfoRef = useRef<any[]>([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Memoize addDebugInfo to prevent recreation on every render
  const addDebugInfo = useCallback((info: any) => {
    console.log('🐛 Debug:', info);
    const newInfo = { timestamp: new Date().toISOString(), ...info };
    debugInfoRef.current = [...debugInfoRef.current, newInfo];
    setDebugInfo(prev => [...prev, newInfo]);
  }, []);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show error if can't check national users
  if (nationalUsersError) {
    console.error('Error checking national users:', nationalUsersError);
  }

  // If national users already exist, redirect to normal auth
  if (!checkingNationalUsers && hasNationalUsers) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      addDebugInfo({ type: 'validation_error', error: 'passwords_mismatch' });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      addDebugInfo({ type: 'validation_error', error: 'password_too_short' });
      return;
    }

    setIsLoading(true);

    try {
      addDebugInfo({ type: 'step', step: 'starting_signup' });
      
      // Create the user account first
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );
      
      if (signUpError) {
        addDebugInfo({ type: 'error', step: 'signup', error: signUpError.message });
        toast.error(signUpError.message || 'Failed to create account');
        return;
      }

      addDebugInfo({ type: 'success', step: 'signup_completed' });

      // Wait for triggers to complete
      addDebugInfo({ type: 'step', step: 'waiting_for_triggers' });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get the current user after signup
      const { data: { user: newUser }, error: getUserError } = await supabase.auth.getUser();
      
      if (getUserError) {
        addDebugInfo({ type: 'error', step: 'get_user', error: getUserError.message });
        toast.error('Failed to get user information after signup');
        return;
      }

      if (!newUser) {
        addDebugInfo({ type: 'error', step: 'get_user', error: 'no_user_returned' });
        toast.error('Failed to get user information after signup');
        return;
      }

      addDebugInfo({ type: 'success', step: 'user_retrieved', userId: newUser.id });

      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', newUser.id)
        .maybeSingle();

      addDebugInfo({ 
        type: 'profile_check', 
        exists: !!existingProfile, 
        profile: existingProfile,
        error: profileCheckError?.message 
      });

      // Create the first admin
      addDebugInfo({ type: 'step', step: 'calling_create_first_admin' });
      await createFirstAdmin.mutateAsync({
        userId: newUser.id,
        email: formData.email,
        fullName: formData.fullName
      });

      addDebugInfo({ type: 'success', step: 'first_admin_created' });
      
      // Sign out the user so they need to sign in again with their new role
      await supabase.auth.signOut();
      
      toast.success('First admin account created successfully! Please sign in to continue.');
      navigate('/auth');
    } catch (error: any) {
      addDebugInfo({ type: 'error', step: 'overall', error: error.message });
      console.error('Admin setup error:', error);
      toast.error('An unexpected error occurred during admin setup');
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugLog = useCallback(() => {
    debugInfoRef.current = [];
    setDebugInfo([]);
  }, []);

  if (loading || checkingNationalUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Setup First Admin</CardTitle>
            <CardDescription>
              Create the first national administrator account for your pharmaceutical analytics system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input
                  id="admin-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-confirm">Confirm Password</Label>
                <Input
                  id="admin-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">First Admin Account</p>
                    <p>This will create your account and immediately grant you national administrator privileges.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || createFirstAdmin.isPending}
              >
                {isLoading || createFirstAdmin.isPending ? 'Creating Admin Account...' : 'Create First Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Debug Information
            </CardTitle>
            <CardDescription>
              Real-time testing information for troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <p className="text-gray-500 text-sm">No debug information yet...</p>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${
                        info.type === 'error' ? 'text-red-600' : 
                        info.type === 'success' ? 'text-green-600' : 
                        'text-blue-600'
                      }`}>
                        {info.type?.toUpperCase()}
                      </span>
                      <span className="text-gray-400">
                        {new Date(info.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(info, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
            
            {debugInfo.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={clearDebugLog}
              >
                Clear Debug Log
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
