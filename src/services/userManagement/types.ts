
import { UserRole } from '@/types/pharmaceutical';

export interface UserManagementRecord {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  approved_by: string | null;
  approved_at: string | null;
}

export interface UserManagementLogEntry {
  id: string;
  admin_user_id: string;
  target_user_id: string;
  action: string;
  old_status: string | null;
  new_status: string | null;
  old_role: UserRole | null;
  new_role: UserRole | null;
  reason: string | null;
  created_at: string;
  admin_profile?: {
    full_name: string | null;
    email: string;
  };
  target_profile?: {
    full_name: string | null;
    email: string;
  };
}
