
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from '@/types/auth';
import { AuthService } from '@/services/auth/authService';
import { ProfileService } from '@/services/auth/profileService';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('🔧 AuthProvider initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Set up auth state listener and get initial session
  useEffect(() => {
    let isMounted = true;
    
    console.log('🔧 Setting up auth state change listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile for authenticated user
          const userProfile = await ProfileService.fetchUserProfile(session.user.id, session.user.email);
          if (isMounted) setProfile(userProfile);
        } else {
          // Clear profile for unauthenticated user
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log('🔍 Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        ProfileService.fetchUserProfile(session.user.id, session.user.email).then((userProfile) => {
          if (isMounted) {
            setProfile(userProfile);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Get auth operations from custom hook
  const authOperations = useAuthOperations(profile, user, refreshProfile);

  const signOut = async () => {
    await AuthService.signOut();
    setProfile(null);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn: AuthService.signIn,
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
