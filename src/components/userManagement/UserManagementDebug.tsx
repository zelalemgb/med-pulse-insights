
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/hooks/useUserManagement';
import { AlertCircle, RefreshCw, User, Users, Clock } from 'lucide-react';

export const UserManagementDebug = () => {
  const { profile, user } = useAuth();
  const { allUsers, pendingUsers, isLoading, error, refetchUsers } = useUserManagement();

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center text-blue-700">
              <User className="h-4 w-4 mr-2" />
              Current User
            </h4>
            <div className="text-sm">
              <div>Email: {user?.email || 'Not logged in'}</div>
              <div>Role: <Badge variant="outline">{profile?.role || 'Unknown'}</Badge></div>
              <div>Active: <Badge variant={profile?.is_active ? 'default' : 'destructive'}>
                {profile?.is_active ? 'Yes' : 'No'}
              </Badge></div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center text-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Data Status
            </h4>
            <div className="text-sm">
              <div>All Users: {allUsers.length}</div>
              <div>Pending Users: {pendingUsers.length}</div>
              <div>Loading: <Badge variant={isLoading ? 'default' : 'secondary'}>
                {isLoading ? 'Yes' : 'No'}
              </Badge></div>
              <div>Error: <Badge variant={error ? 'destructive' : 'default'}>
                {error ? 'Yes' : 'No'}
              </Badge></div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center text-blue-700">
              <Clock className="h-4 w-4 mr-2" />
              Actions
            </h4>
            <Button 
              onClick={refetchUsers} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h5 className="font-medium text-red-800 mb-1">Error Details:</h5>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        {allUsers.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Sample User Data:</h5>
            <pre className="text-xs text-green-700 overflow-auto">
              {JSON.stringify(allUsers[0], null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
