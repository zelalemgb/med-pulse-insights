
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Settings, Bell, Globe, Palette, Shield, Download } from 'lucide-react';

export const UserSettingsSection = () => {
  const { preferences, updatePreferences, isUpdating } = useUserPreferences();

  const handleNotificationChange = (setting: string, value: boolean) => {
    const currentSettings = preferences?.notification_settings || {};
    updatePreferences({
      notification_settings: {
        ...currentSettings,
        [setting]: value
      }
    });
  };

  const handleThemeChange = (setting: string, value: string) => {
    const currentTheme = preferences?.theme_preferences || {};
    updatePreferences({
      theme_preferences: {
        ...currentTheme,
        [setting]: value
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences?.notification_settings?.email_notifications || false}
              onCheckedChange={(value) => handleNotificationChange('email_notifications', value)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={preferences?.notification_settings?.push_notifications || false}
              onCheckedChange={(value) => handleNotificationChange('push_notifications', value)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="system-alerts">System Alerts</Label>
            <Switch
              id="system-alerts"
              checked={preferences?.notification_settings?.system_alerts || false}
              onCheckedChange={(value) => handleNotificationChange('system_alerts', value)}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-reports">Weekly Reports</Label>
            <Switch
              id="weekly-reports"
              checked={preferences?.notification_settings?.weekly_reports || false}
              onCheckedChange={(value) => handleNotificationChange('weekly_reports', value)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={preferences?.theme_preferences?.theme || 'light'}
              onValueChange={(value) => handleThemeChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select
              value={preferences?.theme_preferences?.color_scheme || 'blue'}
              onValueChange={(value) => handleThemeChange('color_scheme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                <SelectItem value="or">Afaan Oromoo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-visibility">Public Profile</Label>
            <Switch id="profile-visibility" />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="activity-tracking">Activity Tracking</Label>
            <Switch id="activity-tracking" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="data-collection">Analytics Data Collection</Label>
            <Switch id="data-collection" defaultChecked />
          </div>
          
          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your personal data and account preferences.
          </p>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="w-full">
              Request Data Deletion
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 pt-2">
            <p>Last backup: Never</p>
            <p>Data retention: 30 days after deletion</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
