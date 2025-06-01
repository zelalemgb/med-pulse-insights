
import React from 'react';

interface HeroSectionProps {
  userName?: string | null;
}

const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="text-center mb-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Welcome back, {userName || 'User'}!
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Access your pharmaceutical analytics platform and manage your supply chain data with confidence.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
