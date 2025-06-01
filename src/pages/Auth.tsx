
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminStatusChecker } from '@/components/admin/AdminStatusChecker';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Card */}
        <AuthCard />

        {/* Admin Status Card */}
        <div className="w-full">
          <AdminStatusChecker />
        </div>
      </div>
    </div>
  );
};

export default Auth;
