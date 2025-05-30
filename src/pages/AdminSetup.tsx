
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Database, CheckCircle, XCircle, AlertTriangle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSetup = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasNationalUsers, setHasNationalUsers] = useState<boolean | null>(null);
  const [fullName, setFullName] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    auth: 'checking' | 'pass' | 'fail';
    database: 'checking' | 'pass' | 'fail';
    profile: 'checking' | 'pass' | 'fail';
  }>({
    auth: 'checking',
    database: 'checking',
    profile: 'checking'
  });

  useEffect(() => {
    checkSystemStatus();
  }, [user, profile]);

  const checkSystemStatus = async () => {
    // Check authentication
    setSystemStatus(prev => ({ ...prev, auth: user ? 'pass' : 'fail' }));

    // Check database connection
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      setSystemStatus(prev => ({ ...prev, database: error ? 'fail' : 'pass' }));
    } catch {
      setSystemStatus(prev => ({ ...prev, database: 'fail' }));
    }

    // Check profile
    setSystemStatus(prev => ({ ...prev, profile: profile ? 'pass' : 'fail' }));

    // Check if national users exist
    if (user) {
      try {
        const { data, error } = await supabase.rpc('has_national_users');
        if (!error) {
          setHasNationalUsers(data);
        }
      } catch (error) {
        console.error('Error checking national users:', error);
      }
    }
  };

  const createFirstAdmin = async () => {
    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "No authenticated user found",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: user.id,
        _email: user.email,
        _full_name: fullName || user.email
      });

      if (error) {
        throw error;
      }

      // Refresh profile to get updated role
      await refreshProfile();
      setSetupComplete(true);
      
      toast({
        title: "Success!",
        description: "You are now the first system administrator",
      });

      // Recheck system status
      setTimeout(checkSystemStatus, 1000);
    } catch (error: any) {
      console.error('Error creating first admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'checking' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'checking':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: 'checking' | 'pass' | 'fail') => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'fail':
        return <Badge variant="destructive">Failed</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to access the admin setup page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth">
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-yellow-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Admin Setup</h1>
          </div>
          <p className="text-xl text-gray-600">
            Initialize your pharmaceutical analytics system
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus.auth)}
                  <span className="ml-2 font-medium">Authentication</span>
                </div>
                {getStatusBadge(systemStatus.auth)}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus.database)}
                  <span className="ml-2 font-medium">Database</span>
                </div>
                {getStatusBadge(systemStatus.database)}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus.profile)}
                  <span className="ml-2 font-medium">User Profile</span>
                </div>
                {getStatusBadge(systemStatus.profile)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Current Role</Label>
                <Badge variant={profile?.role === 'national' ? 'default' : 'secondary'} className="ml-2">
                  {profile?.role || 'No Role'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                <p className="text-lg">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                <Badge variant={profile?.is_active ? 'default' : 'destructive'} className="ml-2">
                  {profile?.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Setup */}
        {profile?.role !== 'national' && hasNationalUsers === false && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                Become First Administrator
              </CardTitle>
              <CardDescription>
                No system administrators exist yet. You can become the first admin to manage the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={createFirstAdmin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating Admin..." : "Become System Administrator"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {(setupComplete || profile?.role === 'national') && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Setup Complete!</strong> You are now a system administrator with full access to all features.
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Already Exists */}
        {hasNationalUsers === true && profile?.role !== 'national' && (
          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              System administrators already exist. Contact an existing administrator to upgrade your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button variant="outline">
              Return to Home
            </Button>
          </Link>
          {profile?.role === 'national' && (
            <Link to="/dashboard">
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
