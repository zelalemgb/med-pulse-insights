
import { UserRole } from '@/types/pharmaceutical';
import { UserManagementRecord } from './types';
import { UserQueryService } from './userQueryService';
import { AuthValidationService } from './authValidationService';
import { UserActionsService } from './userActionsService';

export class UserOperationsService {
  static async getAllUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching all users...');
    
    try {
      // Fetch all profiles
      const data = await UserQueryService.getAllProfiles();
      console.log('✅ Successfully fetched all users:', data.length);
      return UserQueryService.mapUsersToRecords(data);
    } catch (error) {
      console.error('❌ Error in getAllUsers:', error);
      throw error;
    }
  }

  static async getPendingUsers(): Promise<UserManagementRecord[]> {
    console.log('🔍 Fetching pending users...');
    
    try {
      const data = await UserQueryService.getPendingProfiles();
      console.log('✅ Successfully fetched pending users:', data.length);
      return UserQueryService.mapUsersToRecords(data);
    } catch (error) {
      console.error('❌ Error in getPendingUsers:', error);
      throw error;
    }
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer'): Promise<void> {
    console.log('🔧 Approving user:', userId, 'with role:', newRole);
    return UserActionsService.approveUser(userId, newRole);
  }

  static async rejectUser(userId: string, reason?: string): Promise<void> {
    console.log('🔧 Rejecting user:', userId, 'reason:', reason);
    return UserActionsService.rejectUser(userId, reason);
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string): Promise<void> {
    console.log('🔧 Changing user role:', userId, 'to:', newRole, 'reason:', reason);
    return UserActionsService.changeUserRole(userId, newRole, reason);
  }
}
