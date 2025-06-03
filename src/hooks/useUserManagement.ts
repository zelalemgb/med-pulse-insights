
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserManagementService } from '@/services/userManagement/userManagementService';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const allUsersQuery = useQuery({
    queryKey: ['users', 'all'],
    queryFn: UserManagementService.getAllUsers,
  });

  const pendingUsersQuery = useQuery({
    queryKey: ['users', 'pending'],
    queryFn: UserManagementService.getPendingUsers,
  });

  const userManagementLogQuery = useQuery({
    queryKey: ['user-management-log'],
    queryFn: UserManagementService.getUserManagementLog,
  });

  const approveUserMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole?: UserRole }) =>
      UserManagementService.approveUser(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User approved successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      UserManagementService.rejectUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User rejected successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, newRole, reason }: { userId: string; newRole: UserRole; reason?: string }) =>
      UserManagementService.changeUserRole(userId, newRole, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
      toast({
        title: 'Success',
        description: 'User role changed successfully',
      });
    },
    onError: (error: Error) => {
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
    isLoading: allUsersQuery.isLoading || pendingUsersQuery.isLoading,
    approveUser: approveUserMutation.mutate,
    rejectUser: rejectUserMutation.mutate,
    changeUserRole: changeRoleMutation.mutate,
    isApproving: approveUserMutation.isPending,
    isRejecting: rejectUserMutation.isPending,
    isChangingRole: changeRoleMutation.isPending,
  };
};
