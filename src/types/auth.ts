
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/pharmaceutical';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  facility_id: string | null;
  department: string | null;
  is_active: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ error: any }>;
  validateRole: (role: string) => boolean;
  getEffectiveRoleForFacility: (userId: string, facilityId: string) => Promise<UserRole | null>;
  hasFacilityRole: (facilityId: string, role: UserRole) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}
