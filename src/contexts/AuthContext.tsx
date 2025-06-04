
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

  console.log('🔧 AuthProvider state initialized');

  // Create a stable reference to the profile refresh function
  const refreshProfile = useCallback(async () => {
    const currentUser = user;
    if (!currentUser) return;

    try {
      const updatedProfile = await ProfileService.fetchUserProfile(currentUser.id, currentUser.email);
      setProfile(updatedProfile);
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
    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      // Set a default profile on error to prevent hanging
      setProfile({
        id: userId,
        email: userEmail || '',
        full_name: null,
        role: 'viewer',
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
        // Get initial session first
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        console.log('🔍 Initial session check:', initialSession?.user?.id);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id, initialSession.user.email);
        }
        
        setLoading(false);
        setAuthInitialized(true);
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
        
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          // Only fetch profile for meaningful auth events, not token refreshes
          await fetchUserProfile(session.user.id, session.user.email);
        } else if (!session?.user) {
          // Clear profile for unauthenticated user
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
    const { data, error } = await AuthService.signIn(email, password);
    if (!error) {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id, currentSession.user.email);
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

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp: AuthService.signUp,
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
