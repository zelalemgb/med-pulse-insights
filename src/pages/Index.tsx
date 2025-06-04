
import React, { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import InteractiveLandingPage from "@/components/landing/InteractiveLandingPage";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect for authenticated users
  useEffect(() => {
    if (!loading && user) {
      console.log('✅ User found, redirecting to dashboard');
      navigate('/dashboard');
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

  // Show interactive landing page for non-authenticated users
  return <InteractiveLandingPage />;
};

export default Index;
