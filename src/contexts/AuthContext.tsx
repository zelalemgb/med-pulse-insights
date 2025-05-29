
import React, { createContext, useContext, useEffect, useState } from 'react';
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

// Updated role mapping to handle viewer role and fix default assignments
const mapSupabaseRoleToPharmaceutical = (supabaseRole: SupabaseUserRole): UserRole => {
  const roleMapping: Record<SupabaseUserRole, UserRole> = {
    'admin': 'national',
    'manager': 'facility_manager',
    'analyst': 'data_analyst',
    'viewer': 'viewer',
    'zonal': 'zonal',
    'regional': 'regional',
    'national': 'national'
  };
  
  const mappedRole = roleMapping[supabaseRole] || 'facility_officer';
  
  // Validate that the mapped role exists in our valid roles
  if (!VALID_ROLES.includes(mappedRole)) {
    console.warn(`Invalid role detected: ${mappedRole}, falling back to facility_officer`);
    return 'facility_officer';
  }
  
  return mappedRole;
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile data:', data);

      // Convert the Supabase role to pharmaceutical role with validation
      const pharmaceuticalProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: mapSupabaseRoleToPharmaceutical(data.role),
        facility_id: data.facility_id,
        department: data.department,
        is_active: data.is_active
      };

      console.log('Mapped pharmaceutical profile:', pharmaceuticalProfile);
      setProfile(pharmaceuticalProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
    return profile?.role === role;
  };

  // Role validation function
  const validateRole = (role: string): boolean => {
    return VALID_ROLES.includes(role as UserRole);
  };

  // Role upgrade/downgrade function
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
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
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
