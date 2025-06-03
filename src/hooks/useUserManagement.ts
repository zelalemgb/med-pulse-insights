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
        console.log('Users details:', users.map(u => ({ email: u.email, status: u.approval_status, role: u.role })));
        return users;
      } catch (error) {
        console.error('❌ Error fetching all users:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch users. Please check your permissions.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  const pendingUsersQuery = useQuery({
    queryKey: ['users', 'pending'],
    queryFn: async () => {
      console.log('🚀 Starting getPendingUsers query...');
      try {
        const users = await UserManagementService.getPendingUsers();
        console.log('✅ Pending users fetched successfully:', users.length, 'users');
        console.log('Pending users details:', users.map(u => ({ email: u.email, status: u.approval_status })));
        return users;
      } catch (error) {
        console.error('❌ Error fetching pending users:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch pending users. Please check your permissions.',
          variant: 'destructive',
        });
        throw error;
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
        console.error('❌ Error fetching user management log:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch activity log. Please check your permissions.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  const approveUserMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole?: UserRole }) => {
      console.log('Approving user mutation:', userId, newRole);
      return await UserManagementService.approveUser(userId, newRole);
    },
    onSuccess: (_, variables) => {
      console.log('User approved successfully:', variables.userId);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User approved successfully',
      });
    },
    onError: (error: Error) => {
      console.error('Error approving user:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      console.log('Rejecting user mutation:', userId, reason);
      return await UserManagementService.rejectUser(userId, reason);
    },
    onSuccess: (_, variables) => {
      console.log('User rejected successfully:', variables.userId);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User rejected successfully',
      });
    },
    onError: (error: Error) => {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole, reason }: { userId: string; newRole: UserRole; reason?: string }) => {
      console.log('Changing user role mutation:', userId, newRole, reason);
      return await UserManagementService.changeUserRole(userId, newRole, reason);
    },
    onSuccess: (_, variables) => {
      console.log('User role changed successfully:', variables.userId, variables.newRole);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User role changed successfully',
      });
    },
    onError: (error: Error) => {
      console.error('Error changing user role:', error);
      toast({
        title: 'Error',
        description: error.message,
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
    },
  };
};
