
import React from 'react';
import InteractiveLandingPage from "@/components/landing/InteractiveLandingPage";

const Index = () => {
  // Always show the interactive landing page with map
  // Both authenticated and non-authenticated users can access the map
  return <InteractiveLandingPage />;
};

export default Index;
