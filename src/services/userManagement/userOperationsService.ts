
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementRecord } from './types';
import { UserDataService } from './userDataService';
import { AuthUserService } from './authUserService';
import { UserActionsService } from './userActionsService';

export class UserOperationsService {
  static async getAllUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching all users...');
    
    // Get current user info for debugging
    const { data: currentUser, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', currentUser.user?.email, 'Error:', userError);

    if (!currentUser.user) {
      console.error('❌ No authenticated user found');
      throw new Error('Authentication required');
    }

    // Check current user's profile and permissions
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.user.id)
      .single();

    console.log('Current user profile:', currentProfile, 'Error:', profileError);

    // Fetch all profiles
    const data = await UserDataService.fetchAllProfiles();

    // Check for users in auth who might not have profiles
    const profileUserIds = data.map(p => p.id);
    const profilesCreated = await AuthUserService.checkAuthUsers(profileUserIds);
    
    if (profilesCreated) {
      // Re-fetch profiles after creating missing ones
      const updatedData = await UserDataService.fetchAllProfiles();
      console.log('✅ Re-fetched profiles after creating missing ones:', updatedData.length);
      return UserDataService.mapUsersToRecords(updatedData);
    }

    return UserDataService.mapUsersToRecords(data);
  }

  static async getPendingUsers(): Promise<UserManagementRecord[]> {
    const data = await UserDataService.fetchPendingProfiles();
    return UserDataService.mapUsersToRecords(data);
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer'): Promise<void> {
    return UserActionsService.approveUser(userId, newRole);
  }

  static async rejectUser(userId: string, reason?: string): Promise<void> {
    return UserActionsService.rejectUser(userId, reason);
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string): Promise<void> {
    return UserActionsService.changeUserRole(userId, newRole, reason);
  }
}
