import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminUser } from '@/services/admin/adminService';
import { useToast } from './use-toast';

export const useAdminStatus = () => {
  return useQuery({
    queryKey: ['has-national-users'],
    queryFn: () => adminService.hasNationalUsers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminUsers = () => {
  return useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAdminUsers(),
    staleTime: 60 * 1000,
  });
};

interface CreateFirstAdminParams {
  userId: string;
  email: string;
  fullName: string;
}

export const useCreateFirstAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, email, fullName }: CreateFirstAdminParams) =>
      adminService.createFirstAdmin(userId, email, fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['has-national-users'] });
      toast({
        title: 'Success',
        description: 'First admin created successfully',
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
};
