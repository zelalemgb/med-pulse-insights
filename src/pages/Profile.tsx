
import React from 'react';
import { UserProfileManagement } from '@/components/facilities/UserProfileManagement';
import { UserDetailsSection } from '@/components/profile/UserDetailsSection';
import { UserSettingsSection } from '@/components/profile/UserSettingsSection';
import { AchievementsSection } from '@/components/profile/AchievementsSection';
import { ActivitySection } from '@/components/profile/ActivitySection';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Award, Activity, Building } from 'lucide-react';

const Profile = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="User Profile"
          description="Manage your account, facilities, settings, and track your achievements"
          breadcrumbItems={breadcrumbItems}
        />
        
        <div className="mt-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Facilities
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <UserDetailsSection />
            </TabsContent>

            <TabsContent value="facilities">
              <UserProfileManagement />
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
