
import { UserManagementRecord } from './types';
import { BaseQueryService } from './baseQueryService';
import { QueryFilterService } from './queryFilterService';
import { UserDataMapper } from './userDataMapper';
import { AuthValidationService } from './authValidationService';

export class UserQueryService {
  static async getAllProfiles(): Promise<any[]> {
    console.log('🔍 Fetching all users...');
    
    try {
      // Validate current user authentication
      const currentUser = await BaseQueryService.getCurrentUserInfo();
      
      // Check current user's profile and permissions
      const currentProfile = await BaseQueryService.getCurrentUserProfile(currentUser.id);

      // Build role-based query
      const query = QueryFilterService.buildAllUsersQuery(currentProfile.role);

      // Execute query
      const data = await BaseQueryService.executeProfileQuery(query);

      // Check for users in auth who might not have profiles
      const profileUserIds = data.map(p => p.id);
      const profilesCreated = await AuthValidationService.validateAuthUsers(profileUserIds);
      
      if (profilesCreated) {
        // Re-fetch profiles after creating missing ones
        const updatedQuery = QueryFilterService.buildAllUsersQuery(currentProfile.role);
        const updatedData = await BaseQueryService.executeProfileQuery(updatedQuery);
        console.log('✅ Re-fetched profiles after creating missing ones:', updatedData.length);
        return updatedData;
      }

      console.log('✅ Successfully fetched all users:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error in getAllProfiles:', error);
      throw error;
    }
  }

  static async getPendingProfiles(): Promise<any[]> {
    console.log('🔍 Fetching pending users...');
    
    try {
      // Validate current user authentication
      const currentUser = await BaseQueryService.getCurrentUserInfo();
      
      // Check current user's profile and permissions
      const currentProfile = await BaseQueryService.getCurrentUserProfile(currentUser.id);

      // Build role-based query for pending users
      const query = QueryFilterService.buildPendingUsersQuery(currentProfile.role);

      // Execute query
      const data = await BaseQueryService.executeProfileQuery(query);

      console.log('🔍 Pending users query result:', data?.length || 0, 'users found');
      console.log('📋 Pending users details:', data?.map(u => ({ 
        id: u.id.slice(0, 8), 
        email: u.email, 
        role: u.role, 
        approval_status: u.approval_status 
      })));

      return data;
    } catch (error) {
      console.error('❌ Error in getPendingProfiles:', error);
      throw error;
    }
  }

  static mapUsersToRecords(profiles: any[]): UserManagementRecord[] {
    return UserDataMapper.mapUsersToRecords(profiles);
  }
}
