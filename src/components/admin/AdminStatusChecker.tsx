
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const AdminStatusChecker = () => {
  const { user, loading: authLoading } = useAuth();
  const [adminUsers, setAdminUsers] = useState<UserWithRole[]>([]);
  const [hasNationalUsers, setHasNationalUsers] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Checking admin status...');
      
      // Check if national users exist using the database function
      const { data: nationalCheck, error: nationalError } = await supabase.rpc('has_national_users');
      
      if (nationalError) {
        console.error('Error checking national users:', nationalError);
        setError(`Error checking national users: ${nationalError.message}`);
        return;
      }
      
      console.log('📊 National users exist:', nationalCheck);
      setHasNationalUsers(nationalCheck);
      
      // Get all admin users (national, regional, zonal)
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, is_active, created_at')
        .in('role', ['national', 'regional', 'zonal'])
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (usersError) {
        console.error('Error fetching admin users:', usersError);
        setError(`Error fetching admin users: ${usersError.message}`);
        return;
      }
      
      console.log('👥 Admin users found:', users?.length || 0);
      setAdminUsers(users || []);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createFirstAdmin = async () => {
    if (!user) {
      toast.error('You must be logged in to create first admin');
      setError('You must be logged in to create first admin');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Creating first admin for user:', user.id);
      
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: user.id,
        _email: user.email || '',
        _full_name: user.user_metadata?.full_name || 'Admin User'
      });
      
      if (error) {
        console.error('Error creating first admin:', error);
        toast.error(`Error creating first admin: ${error.message}`);
        setError(`Error creating first admin: ${error.message}`);
        return;
      }
      
      console.log('✅ First admin created successfully');
      toast.success('First admin created successfully! You are now a National Administrator.');
      
      // Refresh the status after creating admin
      await checkAdminStatus();
      
    } catch (err) {
      console.error('Unexpected error creating admin:', err);
      const errorMessage = 'An unexpected error occurred while creating admin';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Only check admin status when auth is ready and user state is stable
  useEffect(() => {
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-orange-100 text-orange-800';
      case 'zonal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // More explicit logic for showing the create button
  const showCreateButton = hasNationalUsers === false && user !== null && !authLoading;

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Admin Status Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading authentication...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Admin Status Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button onClick={checkAdminStatus} disabled={loading}>
              {loading ? 'Checking...' : 'Refresh Status'}
            </Button>
            
            {showCreateButton && (
              <Button 
                onClick={createFirstAdmin} 
                disabled={loading} 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 border-green-200"
              >
                {loading ? 'Creating...' : 'Create First Admin'}
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center">
              {hasNationalUsers === true ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : hasNationalUsers === false ? (
                <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
              ) : (
                <div className="h-4 w-4 mr-2 animate-pulse bg-gray-300 rounded-full" />
              )}
              <span className="font-medium">
                National Users Exist: {' '}
                {hasNationalUsers === null ? (
                  <span className="text-gray-500">Checking...</span>
                ) : hasNationalUsers ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-orange-600">No - You can create the first admin!</span>
                )}
              </span>
            </div>

            {user && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>Current User:</strong> {user.email}
                <br />
                <strong>User ID:</strong> <code className="text-xs">{user.id}</code>
              </div>
            )}

            {!user && (
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                <strong>Not logged in:</strong> Please sign in to create the first admin.
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Current Admin Users ({adminUsers.length})
              </h4>
              
              {adminUsers.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-2">No admin users found</p>
                  {showCreateButton && (
                    <p className="text-green-600 text-sm font-medium">
                      👆 Click "Create First Admin" above to get started!
                    </p>
                  )}
                  {!user && (
                    <p className="text-orange-600 text-sm font-medium">
                      Please sign in first to create the first admin.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {adminUsers.map((adminUser) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{adminUser.full_name || 'Unnamed User'}</div>
                        <div className="text-sm text-gray-600">{adminUser.email}</div>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(adminUser.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getRoleBadgeColor(adminUser.role)}>
                        {adminUser.role.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
