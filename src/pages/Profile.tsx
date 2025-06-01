
import React, { useState } from 'react';
import MainNavigation from '@/components/layout/MainNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDetailsSection } from '@/components/profile/UserDetailsSection';
import { UserSettingsSection } from '@/components/profile/UserSettingsSection';
import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { ActivitySection } from '@/components/profile/ActivitySection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Home, Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <PageHeader
          title="User Profile"
          description="Manage your profile, settings, and view your achievements"
          breadcrumbItems={breadcrumbItems}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <UserDetailsSection />
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Facility Information
                </CardTitle>
                <CardDescription>
                  Your associated facilities and roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Facility association information will be displayed here
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <UserSettingsSection />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsSection />
          </TabsContent>

          <TabsContent value="activity">
            <ActivitySection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
