
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import InteractiveLandingPage from "@/components/landing/InteractiveLandingPage";
import MainNavigation from "@/components/layout/MainNavigation";
import Footer from '@/components/layout/Footer';

const Index = () => {
  const { user, loading } = useAuth();

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

  // For authenticated users, show the map with the main navigation and hide the top navigation
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MainNavigation />
        <main className="flex-1">
          <InteractiveLandingPage hideTopNavigation={true} />
        </main>
        <Footer />
      </div>
    );
  }

  // For non-authenticated users, show the standalone interactive landing page with top navigation
  return <InteractiveLandingPage />;
};

export default Index;
