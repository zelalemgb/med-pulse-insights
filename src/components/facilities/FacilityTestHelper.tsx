
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useHealthFacilities, 
  useUserAssociations, 
  usePendingAssociations 
} from '@/hooks/useHealthFacilities';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, Clock, Building, Users, Shield } from 'lucide-react';

export const FacilityTestHelper = () => {
  const { profile } = useAuth();
  const { data: facilities, isLoading: facilitiesLoading } = useHealthFacilities();
  const { data: associations, isLoading: associationsLoading } = useUserAssociations();
  const { data: pendingAssociations, isLoading: pendingLoading } = usePendingAssociations();
  const [testResults, setTestResults] = useState<Array<{test: string, status: 'pass' | 'fail' | 'warning', message: string}>>([]);

  const runTests = () => {
    const results = [];

    // Test 1: User Authentication
    if (profile) {
      results.push({
        test: 'User Authentication',
        status: 'pass' as const,
        message: `User authenticated as ${profile.role}`
      });
    } else {
      results.push({
        test: 'User Authentication',
        status: 'fail' as const,
        message: 'User not authenticated'
      });
    }

    // Test 2: Facilities Loading
    if (!facilitiesLoading && facilities) {
      results.push({
        test: 'Facilities Loading',
        status: 'pass' as const,
        message: `Loaded ${facilities.length} facilities`
      });
    } else if (facilitiesLoading) {
      results.push({
        test: 'Facilities Loading',
        status: 'warning' as const,
        message: 'Still loading facilities...'
      });
    } else {
      results.push({
        test: 'Facilities Loading',
        status: 'fail' as const,
        message: 'Failed to load facilities'
      });
    }

    // Test 3: User Associations
    if (!associationsLoading && associations) {
      results.push({
        test: 'User Associations',
        status: 'pass' as const,
        message: `User has ${associations.length} facility associations`
      });
    } else if (associationsLoading) {
      results.push({
        test: 'User Associations',
        status: 'warning' as const,
        message: 'Still loading associations...'
      });
    } else {
      results.push({
        test: 'User Associations',
        status: 'fail' as const,
        message: 'Failed to load user associations'
      });
    }

    // Test 4: Admin Permissions
    const canApprove = profile?.role === 'national' || 
      profile?.role === 'regional' || 
      profile?.role === 'zonal' ||
      (profile as any)?.can_approve_associations;

    if (canApprove) {
      if (!pendingLoading && pendingAssociations) {
        results.push({
          test: 'Admin Dashboard Access',
          status: 'pass' as const,
          message: `Admin can view ${pendingAssociations.length} pending requests`
        });
      } else if (pendingLoading) {
        results.push({
          test: 'Admin Dashboard Access',
          status: 'warning' as const,
          message: 'Loading admin data...'
        });
      } else {
        results.push({
          test: 'Admin Dashboard Access',
          status: 'fail' as const,
          message: 'Admin access granted but failed to load pending requests'
        });
      }
    } else {
      results.push({
        test: 'Admin Dashboard Access',
        status: 'pass' as const,
        message: 'User has appropriate non-admin access'
      });
    }

    // Test 5: Facility Creation Permissions
    const canCreate = profile?.role === 'national' || 
      profile?.role === 'regional' || 
      profile?.role === 'zonal';

    results.push({
      test: 'Facility Creation Permissions',
      status: 'pass' as const,
      message: canCreate ? 'User can create facilities' : 'User has read-only access to facilities'
    });

    setTestResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Phase 3 Implementation Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runTests} className="w-full">
            Run Phase 3 Tests
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Test Results:</h4>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{result.message}</span>
                    <Badge variant={getStatusColor(result.status) as any}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {facilitiesLoading ? '...' : facilities?.length || 0}
                </div>
                <p className="text-xs text-gray-600">Total accessible</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Associations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {associationsLoading ? '...' : associations?.length || 0}
                </div>
                <p className="text-xs text-gray-600">User associations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pendingLoading ? '...' : pendingAssociations?.length || 0}
                </div>
                <p className="text-xs text-gray-600">Approval requests</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
