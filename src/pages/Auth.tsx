
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminStatusChecker } from '@/components/admin/AdminStatusChecker';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';

const Auth = () => {
  const { user, loading } = useAuth();

  // Early return for authenticated users - redirect to home page
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <AuthLoadingScreen />;
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
