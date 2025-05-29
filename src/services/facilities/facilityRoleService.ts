
import { FacilityRoleAssignment } from '@/types/facilityRoles';
import { UserRole } from '@/types/pharmaceutical';
import { facilityRoleQueries } from './facilityRoleQueries';
import { facilityRoleOperations } from './facilityRoleOperations';
import { rolePermissionService } from './rolePermissionService';

export class FacilityRoleService {
  // Delegate to role operations
  async assignFacilityRole(
    userId: string,
    facilityId: string,
    role: UserRole,
    grantedBy?: string
  ): Promise<FacilityRoleAssignment> {
    return facilityRoleOperations.assignFacilityRole(userId, facilityId, role, grantedBy);
  }

  async revokeFacilityRole(roleId: string): Promise<void> {
    return facilityRoleOperations.revokeFacilityRole(roleId);
  }

  async bulkAssignRoles(
    userIds: string[],
    facilityId: string,
    role: UserRole
  ): Promise<number> {
    return facilityRoleOperations.bulkAssignRoles(userIds, facilityId, role);
  }

  // Delegate to role queries
  async getFacilityRoles(facilityId: string): Promise<FacilityRoleAssignment[]> {
    return facilityRoleQueries.getFacilityRoles(facilityId);
  }

  async getUserFacilityRoles(userId: string): Promise<FacilityRoleAssignment[]> {
    return facilityRoleQueries.getUserFacilityRoles(userId);
  }

  async getEffectiveRole(userId: string, facilityId: string): Promise<UserRole | null> {
    return facilityRoleQueries.getEffectiveRole(userId, facilityId);
  }

  // Delegate to permission service
  async canManageFacilityRoles(facilityId: string): Promise<boolean> {
    return rolePermissionService.canManageFacilityRoles(facilityId);
  }

  async logPermissionUsage(
    permissionName: string,
    resourceType: string,
    resourceId?: string,
    facilityId?: string,
    accessGranted: boolean = true,
    accessMethod: string = 'facility_role'
  ): Promise<void> {
    return rolePermissionService.logPermissionUsage(
      permissionName,
      resourceType,
      resourceId,
      facilityId,
      accessGranted,
      accessMethod
    );
  }
}

export const facilityRoleService = new FacilityRoleService();
