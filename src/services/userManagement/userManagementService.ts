
import { UserRole } from '@/types/pharmaceutical';
import { UserOperationsService } from './userOperationsService';
import { UserManagementLogService } from './userManagementLogService';

// Re-export types for backward compatibility
export type { UserManagementRecord, UserManagementLogEntry } from './types';

export class UserManagementService {
  static async getAllUsers() {
    return UserOperationsService.getAllUsers();
  }

  static async getPendingUsers() {
    return UserOperationsService.getPendingUsers();
  }

  static async approveUser(userId: string, newRole: UserRole = 'facility_officer') {
    return UserOperationsService.approveUser(userId, newRole);
  }

  static async rejectUser(userId: string, reason?: string) {
    return UserOperationsService.rejectUser(userId, reason);
  }

  static async changeUserRole(userId: string, newRole: UserRole, reason?: string) {
    return UserOperationsService.changeUserRole(userId, newRole, reason);
  }

  static async getUserManagementLog() {
    return UserManagementLogService.getUserManagementLog();
  }
}
