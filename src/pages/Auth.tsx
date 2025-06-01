
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </main>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <AuthCard />
      </main>
    </div>
  );
};

export default Auth;
