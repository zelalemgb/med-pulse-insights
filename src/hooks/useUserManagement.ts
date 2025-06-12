
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserManagementService } from '@/services/userManagement/userManagementService';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const allUsersQuery = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      console.log('🚀 Starting getAllUsers query...');
      try {
        const users = await UserManagementService.getAllUsers();
        console.log('✅ All users fetched successfully:', users.length, 'users');
        console.log('📋 Users preview:', users.slice(0, 3).map(u => ({ id: u.id.slice(0, 8), email: u.email, role: u.role })));
        return users;
      } catch (error) {
        console.error('❌ Error in getAllUsers query:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to fetch users.';
        if (error instanceof Error) {
          if (error.message.includes('permission') || error.message.includes('policy')) {
            errorMessage = 'Access denied. You may not have permission to view all users.';
          } else if (error.message.includes('Authentication required')) {
            errorMessage = 'Please log in to view users.';
          } else {
            errorMessage = `Failed to fetch users: ${error.message}`;
          }
        }
        
        toast({
          title: 'Error Loading Users',
          description: errorMessage,
          variant: 'destructive',
        });
        
        // Don't throw error to prevent UI crash - return empty array
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error);
      // Only retry on network errors, not permission errors
      if (error instanceof Error && (
        error.message.includes('permission') || 
        error.message.includes('policy') ||
        error.message.includes('Authentication required')
      )) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const pendingUsersQuery = useQuery({
    queryKey: ['users', 'pending'],
    queryFn: async () => {
      console.log('🚀 Starting getPendingUsers query...');
      try {
        const users = await UserManagementService.getPendingUsers();
        console.log('✅ Pending users fetched successfully:', users.length, 'users');
        console.log('📋 Pending users preview:', users.slice(0, 3).map(u => ({ id: u.id.slice(0, 8), email: u.email, role: u.role })));
        return users;
      } catch (error) {
        console.error('❌ Error in getPendingUsers query:', error);
        toast({
          title: 'Error Loading Pending Users',
          description: 'Failed to fetch pending users. Please check your permissions.',
          variant: 'destructive',
        });
        // Don't throw error to prevent UI crash - return empty array
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  const userManagementLogQuery = useQuery({
    queryKey: ['user-management-log'],
    queryFn: async () => {
      console.log('🚀 Starting getUserManagementLog query...');
      try {
        const log = await UserManagementService.getUserManagementLog();
        console.log('✅ User management log fetched successfully:', log.length, 'entries');
        return log;
      } catch (error) {
        console.error('❌ Error in getUserManagementLog query:', error);
        toast({
          title: 'Error Loading Activity Log',
          description: 'Failed to fetch activity log. Please check your permissions.',
          variant: 'destructive',
        });
        // Don't throw error to prevent UI crash - return empty array
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  const approveUserMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole?: UserRole }) => {
      console.log('🔧 Approving user mutation:', userId, newRole);
      return await UserManagementService.approveUser(userId, newRole);
    },
    onSuccess: (_, variables) => {
      console.log('✅ User approved successfully:', variables.userId);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User approved successfully',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error approving user:', error);
      toast({
        title: 'Error Approving User',
        description: error.message || 'Failed to approve user',
        variant: 'destructive',
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      console.log('🔧 Rejecting user mutation:', userId, reason);
      return await UserManagementService.rejectUser(userId, reason);
    },
    onSuccess: (_, variables) => {
      console.log('✅ User rejected successfully:', variables.userId);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User rejected successfully',
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error rejecting user:', error);
      toast({
        title: 'Error Rejecting User',
        description: error.message || 'Failed to reject user',
        variant: 'destructive',
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole, reason }: { userId: string; newRole: UserRole; reason?: string }) => {
      console.log('🔧 Changing user role mutation:', userId, newRole, reason);
      return await UserManagementService.changeUserRole(userId, newRole, reason);
    },
    onSuccess: (_, variables) => {
      console.log('✅ User role changed successfully:', variables.userId, variables.newRole);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: `User role changed to ${variables.newRole}`,
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error changing user role:', error);
      toast({
        title: 'Error Changing Role',
        description: error.message || 'Failed to change user role',
        variant: 'destructive',
      });
    },
  });

  return {
    allUsers: allUsersQuery.data || [],
    pendingUsers: pendingUsersQuery.data || [],
    userManagementLog: userManagementLogQuery.data || [],
    isLoading: allUsersQuery.isLoading || pendingUsersQuery.isLoading || userManagementLogQuery.isLoading,
    error: allUsersQuery.error || pendingUsersQuery.error || userManagementLogQuery.error,
    approveUser: approveUserMutation.mutate,
    rejectUser: rejectUserMutation.mutate,
    changeUserRole: changeRoleMutation.mutate,
    isApproving: approveUserMutation.isPending,
    isRejecting: rejectUserMutation.isPending,
    isChangingRole: changeRoleMutation.isPending,
    refetchUsers: () => {
      console.log('🔄 Manually refetching user data...');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
    },
  };
};
