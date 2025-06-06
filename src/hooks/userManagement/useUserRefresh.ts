
import { useQueryClient } from '@tanstack/react-query';

export const useUserRefresh = () => {
  const queryClient = useQueryClient();

  const refetchUsers = () => {
    console.log('🔄 Manually refetching user data...');
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['user-management-log'] });
  };

  return {
    refetchUsers,
  };
};
