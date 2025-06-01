
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from './HeroSection';
import QuickActionCards from './QuickActionCards';
import FeatureDescriptions from './FeatureDescriptions';
import SystemOverview from './SystemOverview';

const UserDashboardPreview = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection userName={profile?.full_name} />
        <QuickActionCards />
        <FeatureDescriptions />
        <SystemOverview />
      </div>
    </div>
  );
};

export default UserDashboardPreview;
