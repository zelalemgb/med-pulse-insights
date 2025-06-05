
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from '@/types/auth';
import { AuthService } from '@/services/auth/authService';
import { ProfileService } from '@/services/auth/profileService';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔧 AuthProvider rendering...');
  
  // Initialize state with proper error boundaries
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  console.log('🔧 AuthProvider state initialized - User:', !!user, 'Profile:', !!profile, 'Loading:', loading);

  // Create a stable reference to the profile refresh function
  const refreshProfile = useCallback(async () => {
    const currentUser = user;
    if (!currentUser) {
      console.log('🔍 No user to refresh profile for');
      return;
    }

    try {
      console.log('🔄 Refreshing profile for user:', currentUser.id);
      const updatedProfile = await ProfileService.fetchUserProfile(currentUser.id, currentUser.email);
      setProfile(updatedProfile);
      console.log('✅ Profile refreshed:', updatedProfile);
    } catch (error) {
      console.error('💥 Error refreshing profile:', error);
    }
  }, [user]);

  // Centralized profile fetching function
  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const userProfile = await ProfileService.fetchUserProfile(userId, userEmail);
      setProfile(userProfile);
      console.log('✅ Profile fetched and set:', userProfile);
    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      // Set a default profile on error to prevent hanging
      setProfile({
        id: userId,
        email: userEmail || '',
        full_name: null,
        role: 'facility_officer',
        facility_id: null,
        department: null,
        is_active: true
      });
    }
  }, []);

  // Set up auth state listener and get initial session - run only once
  useEffect(() => {
    if (authInitialized) return;

    console.log('🔧 Setting up auth state change listener...');

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        // Get initial session first
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log('🔍 Initial session check:', initialSession?.user?.id || 'No session');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log('👤 Found existing user, fetching profile...');
          await fetchUserProfile(initialSession.user.id, initialSession.user.email);
        } else {
          console.log('🚫 No existing session found');
        }
        
        setLoading(false);
        setAuthInitialized(true);
        console.log('✅ Auth initialization complete');
      } catch (error) {
        console.error('💥 Error during auth initialization:', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!authInitialized) return; // Skip events until initialized
        
        console.log('🔄 Auth state changed:', event, session?.user?.id || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          console.log('👤 User authenticated, fetching profile...');
          await fetchUserProfile(session.user.id, session.user.email);
        } else if (!session?.user) {
          console.log('🚫 User signed out, clearing profile');
          setProfile(null);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [authInitialized, fetchUserProfile]);

  // Get auth operations from custom hook
  const authOperations = useAuthOperations(profile, user, refreshProfile);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Signing in user:', email);
    const { data, error } = await AuthService.signIn(email, password);
    if (!error && data?.session) {
      console.log('✅ Sign in successful, updating state');
      setSession(data.session);
      setUser(data.session.user);
      if (data.session.user) {
        await fetchUserProfile(data.session.user.id, data.session.user.email);
      }
    }
    return { data, error };
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    setProfile(null);
    setUser(null);
    setSession(null);
    await AuthService.signOut();
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 Signing up user:', email);
    return await AuthService.signUp(email, password, fullName);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    ...authOperations,
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
