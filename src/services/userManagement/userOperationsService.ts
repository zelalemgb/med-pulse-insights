
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementRecord } from './types';
import { UserQueryService } from './userQueryService';
import { AuthValidationService } from './authValidationService';
import { UserActionsService } from './userActionsService';

export class UserOperationsService {
  static async getAllUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching all users...');
    
    // Validate current user authentication
    const currentUser = await AuthValidationService.getCurrentUserInfo();
    
    // Check current user's profile and permissions
    await AuthValidationService.getCurrentUserProfile(currentUser.id);

    // Fetch all profiles
    const data = await UserQueryService.getAllProfiles();

    // Check for users in auth who might not have profiles
    const profileUserIds = data.map(p => p.id);
    const profilesCreated = await AuthValidationService.validateAuthUsers(profileUserIds);
    
    if (profilesCreated) {
      // Re-fetch profiles after creating missing ones
      const updatedData = await UserQueryService.getAllProfiles();
      console.log('✅ Re-fetched profiles after creating missing ones:', updatedData.length);
      return UserQueryService.mapUsersToRecords(updatedData);
    }

    return UserQueryService.mapUsersToRecords(data);
  }

  static async getPendingUsers(): Promise<UserManagementRecord[]> {
    const data = await UserQueryService.getPendingProfiles();
    return UserQueryService.mapUsersToRecords(data);
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
