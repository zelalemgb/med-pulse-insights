
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import WelcomeSection from "@/components/welcome/WelcomeSection";
import UserDashboardPreview from "@/components/dashboard/UserDashboardPreview";

const Index = () => {
  const { user } = useAuth();

  return user ? <UserDashboardPreview /> : <WelcomeSection />;
};

export default Index;
