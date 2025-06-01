
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const AccessDeniedCard = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-semibold mb-2">Access Denied</h4>
          <p className="text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
