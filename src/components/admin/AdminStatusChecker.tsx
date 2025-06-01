
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AdminActionButtons } from './AdminActionButtons';
import { AdminStatusDisplay } from './AdminStatusDisplay';
import { AdminUsersList } from './AdminUsersList';
import { AdminErrorDisplay } from './AdminErrorDisplay';
import {
  useAdminStatus,
  useAdminUsers,
  useCreateFirstAdmin,
} from '@/hooks/useAdmin';



export const AdminStatusChecker = () => {
  const { user, loading: authLoading } = useAuth();

  const {
    data: hasNationalUsers,
    refetch: refetchStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useAdminStatus();
  const {
    data: adminUsers,
    refetch: refetchUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers();
  const createFirstAdmin = useCreateFirstAdmin();

  const loading =
    statusLoading ||
    usersLoading ||
    createFirstAdmin.isPending;
  const error =
    statusError?.message ||
    usersError?.message ||
    (createFirstAdmin.error as Error | undefined)?.message ||
    null;

  const handleCreateFirstAdmin = async () => {
    if (!user) {
      toast.error('You must be logged in to create first admin');
      return;
    }
    await createFirstAdmin.mutateAsync({
      userId: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || 'Admin User',
    });
  };

  // Refresh data when auth is ready
  useEffect(() => {
    if (!authLoading) {
      refetchStatus();
      refetchUsers();
    }
  }, [authLoading, refetchStatus, refetchUsers]);

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
            onRefresh={() => {
              refetchStatus();
              refetchUsers();
            }}
            onCreateFirstAdmin={handleCreateFirstAdmin}
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
