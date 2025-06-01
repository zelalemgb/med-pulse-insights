
import React from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { FeatureDescriptions } from '@/components/dashboard/FeatureDescriptions';
import { WelcomeSection } from '@/components/welcome/WelcomeSection';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main>
        {user ? (
          <div className="container mx-auto px-4 py-8">
            <WelcomeSection />
          </div>
        ) : (
          <>
            <HeroSection />
            <FeatureDescriptions />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
