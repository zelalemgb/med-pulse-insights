
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserManagementService } from '@/services/userManagement/userManagementService';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';

export const useUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    approveUser: approveUserMutation.mutate,
    rejectUser: rejectUserMutation.mutate,
    changeUserRole: changeRoleMutation.mutate,
    isApproving: approveUserMutation.isPending,
    isRejecting: rejectUserMutation.isPending,
    isChangingRole: changeRoleMutation.isPending,
  };
};
