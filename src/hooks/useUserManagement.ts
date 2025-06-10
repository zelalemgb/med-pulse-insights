
import { useUserQueries } from './userManagement/useUserQueries';
import { useUserMutations } from './userManagement/useUserMutations';
import { useUserRefresh } from './userManagement/useUserRefresh';

export const useUserManagement = () => {
  const { 
    allUsersQuery, 
    pendingUsersQuery, 
    userManagementLogQuery, 
    isLoading, 
    error 
  } = useUserQueries();

  const {
    approveUser,
    rejectUser,
    changeUserRole,
    isApproving,
    isRejecting,
    isChangingRole,
  } = useUserMutations();

  const { refetchUsers } = useUserRefresh();

  return {
    allUsers: allUsersQuery.data || [],
    pendingUsers: pendingUsersQuery.data || [],
    userManagementLog: userManagementLogQuery.data || [],
    isLoading,
    error,
    approveUser,
    rejectUser,
    changeUserRole,
    isApproving,
    isRejecting,
    isChangingRole,
    refetchUsers,
  };
};
