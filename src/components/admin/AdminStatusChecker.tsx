
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const AdminStatusChecker = () => {
  const { user } = useAuth();
  const [adminUsers, setAdminUsers] = useState<UserWithRole[]>([]);
  const [hasNationalUsers, setHasNationalUsers] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if national users exist using the database function
      const { data: nationalCheck, error: nationalError } = await supabase.rpc('has_national_users');
      
      if (nationalError) {
        console.error('Error checking national users:', nationalError);
        setError(`Error checking national users: ${nationalError.message}`);
        return;
      }
      
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
      setError('You must be logged in to create first admin');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('create_first_admin', {
        _user_id: user.id,
        _email: user.email || '',
        _full_name: user.user_metadata?.full_name || 'Admin User'
      });
      
      if (error) {
        console.error('Error creating first admin:', error);
        setError(`Error creating first admin: ${error.message}`);
        return;
      }
      
      // Refresh the status after creating admin
      await checkAdminStatus();
      
    } catch (err) {
      console.error('Unexpected error creating admin:', err);
      setError('An unexpected error occurred while creating admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-orange-100 text-orange-800';
      case 'zonal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="flex items-center justify-between">
            <Button onClick={checkAdminStatus} disabled={loading}>
              {loading ? 'Checking...' : 'Refresh Status'}
            </Button>
            
            {hasNationalUsers === false && user && (
              <Button onClick={createFirstAdmin} disabled={loading} variant="outline">
                {loading ? 'Creating...' : 'Create First Admin'}
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center">
              {hasNationalUsers === true ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : hasNationalUsers === false ? (
                <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
              ) : (
                <div className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">
                National Users Exist: {' '}
                {hasNationalUsers === null ? 'Checking...' : hasNationalUsers ? 'Yes' : 'No'}
              </span>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Current Admin Users ({adminUsers.length})
              </h4>
              
              {adminUsers.length === 0 ? (
                <p className="text-gray-600 text-sm">No admin users found</p>
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
