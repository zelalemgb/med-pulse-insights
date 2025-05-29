
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Users, Shield, AlertCircle } from 'lucide-react';
import { useHasNationalUsers } from '@/hooks/useFirstAdmin';

const AdminSetupPrompt = () => {
  const { data: hasNationalUsers, isLoading, error } = useHasNationalUsers();

  console.log('🔍 AdminSetupPrompt render:', { hasNationalUsers, isLoading, error });

  // Show loading state
  if (isLoading) {
    console.log('⏳ AdminSetupPrompt: Still loading...');
    return (
      <Card className="w-full max-w-md mx-auto mb-6 border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking system status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    console.error('❌ AdminSetupPrompt error:', error);
    return (
      <Card className="w-full max-w-md mx-auto mb-6 border-2 border-dashed border-red-300 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 font-medium">Unable to check system status</p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if national users already exist
  if (hasNationalUsers) {
    console.log('✅ AdminSetupPrompt: National users exist, hiding prompt');
    return null;
  }

  console.log('🚀 AdminSetupPrompt: Showing setup prompt');

  return (
    <Card className="w-full max-w-md mx-auto mb-6 border-2 border-dashed border-blue-300 bg-blue-50/50">
      <CardHeader className="text-center pb-4">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Crown className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-lg text-blue-900">System Setup Required</CardTitle>
        <CardDescription className="text-blue-700">
          No administrator accounts found. Set up the first admin to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-blue-800">Full system access and control</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-blue-800">Ability to create other user accounts</span>
          </div>
        </div>
        
        <Link to="/admin-setup" className="block">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Crown className="w-4 h-4 mr-2" />
            Setup First Admin
          </Button>
        </Link>
        
        <p className="text-xs text-blue-600 text-center">
          This option will disappear once an admin account is created
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminSetupPrompt;
