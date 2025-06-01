
import React, { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import WelcomeSection from "@/components/welcome/WelcomeSection";
import UserDashboardPreview from "@/components/dashboard/UserDashboardPreview";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect for unauthenticated users who try to access protected content
  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ No user found, staying on welcome page');
    } else if (!loading && user) {
      console.log('✅ User found, showing dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <UserDashboardPreview /> : <WelcomeSection />;
};

export default Index;
