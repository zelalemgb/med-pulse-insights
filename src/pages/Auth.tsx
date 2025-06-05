
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect for authenticated users
  useEffect(() => {
    if (user && !loading) {
      console.log('✅ User authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Don't render anything if user is authenticated (redirect is in progress)
  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
};

export default Auth;
