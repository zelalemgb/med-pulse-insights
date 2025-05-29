
// Re-export all conditional permission hooks and types for backward compatibility
export { useConditionalPermissions } from './useConditionalPermissionsList';
export { usePermissionUsageLog } from './usePermissionUsageLog';
export { useCreateConditionalPermission } from './useCreateConditionalPermission';
export { useCheckConditionalPermissions } from './useCheckConditionalPermissions';
export { useLogPermissionUsage } from './useLogPermissionUsage';
export type { ConditionalPermission, PermissionUsageEntry } from '@/types/conditionalPermissions';
