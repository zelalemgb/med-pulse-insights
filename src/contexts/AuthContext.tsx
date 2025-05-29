
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/pharmaceutical';
import { Database } from '@/integrations/supabase/types';
import { 
  mapSupabaseToPharmaceuticalRole, 
  mapPharmaceuticalToSupabaseRole,
  isValidPharmaceuticalRole,
  VALID_PHARMACEUTICAL_ROLES 
} from '@/utils/roleMapping';

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
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('🔧 AuthProvider initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log(`🔍 Fetching profile for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        setProfile(null);
        return;
      }

      if (!data) {
        console.log('⚠️ No profile found for user:', userId);
        
        // Create a default profile if none exists
        console.log('🔧 Creating default profile for user');
        const defaultProfile: UserProfile = {
          id: userId,
          email: user?.email || '',
          full_name: null,
          role: 'viewer',
          facility_id: null,
          department: null,
          is_active: true
        };
        setProfile(defaultProfile);
        return;
      }

      console.log('📋 Raw profile data from database:', data);

      // Enhanced role mapping with validation
      let pharmaceuticalRole: UserRole;
      if (data.role && typeof data.role === 'string') {
        pharmaceuticalRole = mapSupabaseToPharmaceuticalRole(data.role as SupabaseUserRole);
      } else {
        console.warn('⚠️ Invalid or missing role in profile, defaulting to viewer');
        pharmaceuticalRole = 'viewer';
      }

      // Double-check role validity
      if (!isValidPharmaceuticalRole(pharmaceuticalRole)) {
        console.warn(`⚠️ Invalid pharmaceutical role: ${pharmaceuticalRole}, using viewer`);
        pharmaceuticalRole = 'viewer';
      }
      
      const pharmaceuticalProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: pharmaceuticalRole,
        facility_id: data.facility_id,
        department: data.department,
        is_active: data.is_active
      };

      console.log('✅ Final mapped pharmaceutical profile:', pharmaceuticalProfile);
      console.log(`🎯 User role confirmed as: ${pharmaceuticalRole}`);
      setProfile(pharmaceuticalProfile);
    } catch (error) {
      console.error('💥 Unexpected error fetching profile:', error);
      setProfile(null);
    }
  }, [user?.email]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    console.log('🔧 Setting up auth state change listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Reset profile when user changes
        if (!session?.user) {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Separate useEffect for profile fetching to avoid infinite loops
  useEffect(() => {
    if (user && !profile) {
      fetchUserProfile(user.id).finally(() => setLoading(false));
    } else if (!user) {
      setLoading(false);
    }
  }, [user, profile, fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
    } else {
      console.log('✅ Sign in successful');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 Attempting sign up for:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('❌ Sign up error:', error);
    } else {
      console.log('✅ Sign up successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
    setProfile(null);
  };

  const hasRole = useCallback((role: UserRole): boolean => {
    const hasRoleResult = profile?.role === role;
    console.log(`🔍 Checking if user has role ${role}:`, hasRoleResult, 'Current role:', profile?.role);
    return hasRoleResult;
  }, [profile?.role]);

  const validateRole = useCallback((role: string): boolean => {
    const isValid = isValidPharmaceuticalRole(role);
    console.log(`🔍 Validating role ${role}:`, isValid);
    return isValid;
  }, []);

  const updateUserRole = useCallback(async (userId: string, newRole: UserRole) => {
    // Enhanced validation
    if (!validateRole(newRole)) {
      console.error(`❌ Invalid role: ${newRole}`);
      return { error: { message: `Invalid role: ${newRole}` } };
    }

    // Enhanced permission check
    if (!profile || !['national', 'regional', 'zonal'].includes(profile.role)) {
      console.error('❌ Insufficient permissions to change user roles');
      return { error: { message: 'Insufficient permissions to change user roles' } };
    }

    try {
      console.log(`🔄 Updating user ${userId} role to ${newRole}`);
      
      // Convert pharmaceutical role to Supabase role for database update
      const supabaseRole = mapPharmaceuticalToSupabaseRole(newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: supabaseRole })
        .eq('id', userId);

      if (error) {
        console.error('❌ Error updating user role:', error);
        return { error };
      }

      console.log('✅ User role updated successfully');

      // If updating own role, refresh profile
      if (userId === user?.id) {
        await fetchUserProfile(userId);
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Unexpected error updating user role:', error);
      return { error };
    }
  }, [profile, validateRole, user?.id, fetchUserProfile]);

  const getEffectiveRoleForFacility = useCallback(async (userId: string, facilityId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase.rpc('get_effective_role_for_facility', {
        _user_id: userId,
        _facility_id: facilityId
      });

      if (error) {
        console.error('❌ Error getting effective role:', error);
        return null;
      }

      return data ? mapSupabaseToPharmaceuticalRole(data) : null;
    } catch (error) {
      console.error('💥 Error getting effective role:', error);
      return null;
    }
  }, []);

  const hasFacilityRole = useCallback(async (facilityId: string, role: UserRole): Promise<boolean> => {
    if (!user) return false;

    try {
      const effectiveRole = await getEffectiveRoleForFacility(user.id, facilityId);
      return effectiveRole === role;
    } catch (error) {
      console.error('💥 Error checking facility role:', error);
      return false;
    }
  }, [user, getEffectiveRoleForFacility]);

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
    refreshProfile,
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
