
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AdminActionButtons } from './AdminActionButtons';
import { AdminStatusDisplay } from './AdminStatusDisplay';
import { AdminUsersList } from './AdminUsersList';
import { AdminErrorDisplay } from './AdminErrorDisplay';

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
          <AdminActionButtons
            loading={loading}
            showCreateButton={showCreateButton}
            onRefresh={checkAdminStatus}
            onCreateFirstAdmin={createFirstAdmin}
          />

          {error && <AdminErrorDisplay error={error} />}

          <AdminStatusDisplay 
            hasNationalUsers={hasNationalUsers}
            user={user}
          />

          <AdminUsersList
            adminUsers={adminUsers}
            user={user}
            showCreateButton={showCreateButton}
          />
        </CardContent>
      </Card>
    </div>
  );
};
