
import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { Database } from '@/integrations/supabase/types';

type SupabaseUserRole = Database['public']['Enums']['user_role'];

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  facility_id: string | null;
  department: string | null;
  is_active: boolean;
}

interface AuthContextType {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid roles for validation
const VALID_ROLES: UserRole[] = [
  'facility_officer',
  'facility_manager',
  'zonal',
  'regional',
  'national',
  'procurement',
  'finance',
  'program_manager',
  'qa',
  'data_analyst',
  'viewer'
];

// Fixed role mapping to ensure national role is properly recognized
const mapSupabaseRoleToPharmaceutical = (supabaseRole: SupabaseUserRole): UserRole => {
  console.log('Mapping Supabase role:', supabaseRole);
  
  switch (supabaseRole) {
    case 'national':
      return 'national';
    case 'regional':
      return 'regional';
    case 'zonal':
      return 'zonal';
    case 'admin':
      return 'national'; // Map legacy admin to national
    case 'manager':
      return 'facility_manager';
    case 'analyst':
      return 'data_analyst';
    case 'viewer':
      return 'viewer';
    default:
      console.warn(`Unmapped Supabase role: ${supabaseRole}, defaulting to facility_officer`);
      return 'facility_officer';
  }
};

// Map pharmaceutical roles back to Supabase roles for updates
const mapPharmaceuticalToSupabaseRole = (pharmaceuticalRole: UserRole): SupabaseUserRole => {
  switch (pharmaceuticalRole) {
    case 'national':
      return 'national';
    case 'regional':
      return 'regional';
    case 'zonal':
      return 'zonal';
    case 'facility_manager':
      return 'manager';
    case 'data_analyst':
      return 'analyst';
    case 'viewer':
      return 'viewer';
    case 'facility_officer':
    case 'procurement':
    case 'finance':
    case 'program_manager':
    case 'qa':
    default:
      return 'viewer';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // First check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      if (!data) {
        console.log('No profile found for user:', userId);
        setProfile(null);
        return;
      }

      console.log('Raw profile data from database:', data);

      // Convert the Supabase role to pharmaceutical role with validation
      const pharmaceuticalRole = mapSupabaseRoleToPharmaceutical(data.role);
      
      const pharmaceuticalProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: pharmaceuticalRole,
        facility_id: data.facility_id,
        department: data.department,
        is_active: data.is_active
      };

      console.log('Mapped pharmaceutical profile:', pharmaceuticalProfile);
      setProfile(pharmaceuticalProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasRole = (role: UserRole): boolean => {
    const hasRoleResult = profile?.role === role;
    console.log(`Checking if user has role ${role}:`, hasRoleResult, 'Current role:', profile?.role);
    return hasRoleResult;
  };

  // Role validation function
  const validateRole = (role: string): boolean => {
    return VALID_ROLES.includes(role as UserRole);
  };

  // Enhanced role upgrade/downgrade function
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    // Validate the new role
    if (!validateRole(newRole)) {
      return { error: { message: `Invalid role: ${newRole}` } };
    }

    // Check if current user has permission to change roles
    if (!profile || !['national', 'regional', 'zonal'].includes(profile.role)) {
      return { error: { message: 'Insufficient permissions to change user roles' } };
    }

    try {
      // Convert pharmaceutical role to Supabase role for database update
      const supabaseRole = mapPharmaceuticalToSupabaseRole(newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: supabaseRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return { error };
      }

      // If updating own role, refresh profile
      if (userId === user?.id) {
        await fetchUserProfile(userId);
      }

      return { error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { error };
    }
  };

  // Get effective role for a specific facility (includes inheritance)
  const getEffectiveRoleForFacility = async (userId: string, facilityId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
        _user_id: userId,
        _facility_id: facilityId
      });

      if (error) {
        console.error('Error getting effective role:', error);
        return null;
      }

      return mapSupabaseRoleToPharmaceutical(data);
    } catch (error) {
      console.error('Error getting effective role:', error);
      return null;
    }
  };

  // Check if user has specific role for a facility
  const hasFacilityRole = async (facilityId: string, role: UserRole): Promise<boolean> => {
    if (!user) return false;

    try {
      const effectiveRole = await getEffectiveRoleForFacility(user.id, facilityId);
      return effectiveRole === role;
    } catch (error) {
      console.error('Error checking facility role:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    updateUserRole,
    validateRole,
    getEffectiveRoleForFacility,
    hasFacilityRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
