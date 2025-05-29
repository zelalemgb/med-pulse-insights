
// Re-export all hooks and types for backward compatibility
export { useFacilityRoles } from './useFacilityRolesList';
export { useUserEffectiveRole } from './useUserEffectiveRole';
export { useAssignFacilityRole } from './useAssignFacilityRole';
export { useBulkAssignRoles } from './useBulkAssignRoles';
export { useRevokeFacilityRole } from './useRevokeFacilityRole';

// Re-export types
export type {
  FacilitySpecificRole,
  FacilityRoleAssignment,
  BulkRoleAssignmentResult,
  RoleChangeLogEntry,
  SupabaseUserRole
} from '@/types/facilityRoles';
