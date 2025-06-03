
import React from 'react';
import HeroSection from './HeroSection';
import LiveMetrics from './LiveMetrics';
import RegionalPerformance from './RegionalPerformance';
import SystemCapabilities from './SystemCapabilities';
import FieldEvidence from './FieldEvidence';
import AccessSection from './AccessSection';

const WelcomeSection = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <HeroSection />
        <LiveMetrics />
        <RegionalPerformance />
        <SystemCapabilities />
        <FieldEvidence />
        <AccessSection />
      </div>
    </div>
  );
};

export default WelcomeSection;
